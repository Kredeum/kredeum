import type { EthereumProvider, WindowEthereumProvider, WindowExternalProvider } from "@lib/common/types";
import type {} from "@ethersproject/providers";

import detectEthereumProvider from "@metamask/detect-provider";
import { ethers } from "ethers";
import { get } from "svelte/store";

import { numberToHexString, getChecksumAddress, getNetwork, isNetwork, isAddressNotZero } from "@lib/common/config";
import { metamaskChainId, metamaskSignerAddress, metamaskProvider, metamaskSigner } from "@stores/metamask";

let _ethereumProvider: EthereumProvider;

const metamaskConnectMessage = "Connect to Metamask";
const metamaskInstallMessage = "Install MetaMask to connect";
const metamaskMultipleWallets = "Do you have multiple wallets installed?";

let _open = true;

const metamaskConnected = (): boolean => isAddressNotZero(get(metamaskSignerAddress));

const metamaskInstalled = async (): Promise<boolean> => Boolean(await detectEthereumProvider());

const _handleChainId = (_chainId: string): void => {
  const newChainId = Number(_chainId);

  if (!(isNetwork(newChainId) && newChainId != get(metamaskChainId))) return;

  console.log("_handleChainId:", _chainId, newChainId);

  metamaskChainId.set(newChainId);
};

const _handleAccounts = (accounts: Array<string>): void => {
  if (accounts?.length === 0) return;
  // console.log("_handleAccounts:", accounts);

  metamaskSigner.set(get(metamaskProvider).getSigner(0));
  metamaskSignerAddress.set(getChecksumAddress(accounts[0]));
};

const metamaskConnect = async (): Promise<void> => {
  if (!_ethereumProvider) return;

  console.info("metamaskConnect");

  try {
    await _ethereumProvider.request({ method: "eth_requestAccounts" });
  } catch (err) {
    if ((err as { code: number }).code === 4001) {
      alert(metamaskConnectMessage);
    } else {
      console.error("Metamask ERROR eth_requestAccounts", err);
    }
  }
};

const metamaskInit = async (): Promise<void> => {
  if (get(metamaskChainId)) return;

  _ethereumProvider = await detectEthereumProvider();
  if (_ethereumProvider) {
    // SET provider
    if (_ethereumProvider !== (window as WindowEthereumProvider).ethereum) alert(metamaskMultipleWallets);
    metamaskProvider.set(new ethers.providers.Web3Provider((window as WindowExternalProvider).ethereum, "any"));

    // Handle chainId on init then later on "chainChanged"
    try {
      _handleChainId(String(await _ethereumProvider.request({ method: "eth_chainId" })));
    } catch (err) {
      console.error("Metamask ERROR eth_chainId", err);
    }
    _ethereumProvider.on("chainChanged", _handleChainId);

    // Handle accounts on init then later on "accountsChanged"
    try {
      _handleAccounts((await _ethereumProvider.request({ method: "eth_accounts" })) as Array<string>);
    } catch (err) {
      console.error("Metamask ERROR eth_accounts", err);
    }
    _ethereumProvider.on("accountsChanged", _handleAccounts);
  } else {
    console.info(metamaskInstallMessage);
  }
};

const _addEthereumChain = (_chainId: number): void => {
  // no need to add default ethereum chain 1
  if (!(isNetwork(_chainId) && _chainId != 1 && _open && _ethereumProvider)) return;
  _open = false;

  console.info("_addEthereumChain", _chainId, _open);

  const _network = getNetwork(_chainId);
  if (_network) {
    // add new chain to metamask
    _ethereumProvider
      .request({
        method: "wallet_addEthereumChain",
        params: [
          {
            chainId: numberToHexString(_network.chainId),
            blockExplorerUrls: _network.blockExplorerUrls,
            chainName: _network.chainName,
            iconUrls: [],
            nativeCurrency: _network.nativeCurrency,
            rpcUrls: _network.rpcUrls
          }
        ]
      })
      .catch((err) => console.error("Metamask ERROR wallet_addEthereumChain", err));
  }
  _open = true;
};

const metamaskSwitchChain = async (_chainId: number): Promise<void> => {
  if (!(isNetwork(_chainId) && _chainId != get(metamaskChainId) && _ethereumProvider)) return;

  console.info(`metamaskSwitchChain ${_chainId}`);

  try {
    await _ethereumProvider.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: numberToHexString(_chainId) }]
    });
  } catch (err) {
    if ((err as { code: number }).code === 4902) _addEthereumChain(_chainId);
  }
};

export {
  metamaskConnected,
  metamaskInstalled,
  metamaskInit,
  metamaskConnect,
  metamaskSwitchChain,
  metamaskConnectMessage,
  metamaskInstallMessage
};
