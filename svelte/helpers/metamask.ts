import type { WindowEthereumProvider, WindowExternalProvider } from "@lib/common/types";
import type { EthereumProvider } from "hardhat/types";
import detectEthereumProvider from "@metamask/detect-provider";
import { ethers } from "ethers";
import { get } from "svelte/store";

import { numberToHexString, getChecksumAddress, getNetwork, networks } from "@lib/common/config";
import { metamaskChainId, metamaskSignerAddress, metamaskProvider, metamaskSigner } from "@main/metamask";

let _ethereumProvider: EthereumProvider;

const metamaskConnectMessage = "Connect to Metamask";
const metamaskInstallMessage = "Install MetaMask to connect";
const metamaskMultipleWallets = "Do you have multiple wallets installed?";

let targetChain = false;

const addEthereumChain = (_chainId: number): void => {
  if (_chainId) {
    console.info("addEthereumChain", _chainId);

    if (targetChain) {
      console.warn("Already connecting network...");
    }
    targetChain = true;

    // no need to add default ethereum chain
    if (_chainId !== 1) {
      const _network = getNetwork(_chainId);
      if (_network) {
        // EIP-3085 fields only or fails
        type EthereumChainParameter = {
          chainId: string;
          blockExplorerUrls?: string[];
          chainName?: string;
          iconUrls?: string[];
          nativeCurrency?: {
            name: string;
            symbol: string;
            decimals: number;
          };
          rpcUrls?: string[];
        };
        const params: EthereumChainParameter = {
          chainId: numberToHexString(_network.chainId),
          blockExplorerUrls: _network.blockExplorerUrls,
          chainName: _network.chainName,
          iconUrls: [],
          nativeCurrency: _network.nativeCurrency,
          rpcUrls: _network.rpcUrls
        };

        // add new chain to metamask
        _ethereumProvider
          .request({
            method: "wallet_addEthereumChain",
            params: [params]
          })
          .catch((err) => console.error("Metamask ERROR wallet_addEthereumChain", err));
      }
    }
  }
};

const handleChainIdSync = (_chainId: number): void => {
  handleChainId(_chainId).catch(console.error);
};
const handleChainId = async (_chainId: number): Promise<void> => {
  // console.info(`handleChainId ${_chainId}`);

  if (_chainId && _chainId != get(metamaskChainId)) {
    const _network = getNetwork(_chainId);

    if (_network) {
      // SAVE chainId in Svelte store $metamaskChainId
      metamaskChainId.set(Number(_network.chainId));
    } else {
      // chainId not accepted : switch to first accepted chainId
      await metamaskSwitchChain(networks[0].chainId);
    }
  }
};

const handleAccountsSync = (accounts: Array<string>): void => {
  handleAccounts(accounts).catch(console.error);
};
const handleAccounts = async (accounts: Array<string>): Promise<void> => {
  // console.info("handleAccountsSync", accounts);

  if (accounts?.length === 0) accounts = await metamaskConnect();

  if (accounts[0] && accounts[0] !== String(get(metamaskSignerAddress))) {
    metamaskSigner.set(get(metamaskProvider).getSigner(0));
    metamaskSignerAddress.set(getChecksumAddress(accounts[0]));
  }
};

const metamaskConnect = async (): Promise<Array<string>> => {
  console.info("metamaskConnect");
  let accounts: Array<string>;

  try {
    accounts = (await _ethereumProvider.request({ method: "eth_requestAccounts" })) as Array<string>;
  } catch (err) {
    if ((err as { code: number }).code === 4001) {
      alert(metamaskConnectMessage);
    } else {
      console.error("Metamask ERROR eth_requestAccounts", err);
    }
  }
  return accounts;
};

const metamaskSwitchChain = async (_chainId: number): Promise<void> => {
  console.info(`metamaskSwitchChain ${_chainId}`);

  if (_chainId > 0 && _chainId != Number(get(metamaskChainId))) {
    try {
      await _ethereumProvider.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: numberToHexString(_chainId) }]
      });
    } catch (err) {
      if ((err as { code: number }).code === 4902) addEthereumChain(_chainId);
    }
  }
};

const metamaskInstalled = async (): Promise<boolean> => Boolean(await detectEthereumProvider());

const metamaskInit = async (): Promise<void> => {
  let chainId = 0;
  let accounts: Array<string> = [];

  if (!get(metamaskChainId)) {
    // console.info("metamaskInit");
    _ethereumProvider = await detectEthereumProvider();

    if (_ethereumProvider) {
      if (_ethereumProvider !== (window as WindowEthereumProvider).ethereum) alert(metamaskMultipleWallets);

      const ethersProvider = new ethers.providers.Web3Provider((window as WindowExternalProvider).ethereum, "any");
      metamaskProvider.set(ethersProvider);

      try {
        // GET chainId from node connected to
        chainId = (await _ethereumProvider.request({ method: "eth_chainId" })) as number;
      } catch (err) {
        console.error("Metamask ERROR eth_chainId", err);
      }

      await handleChainId(Number(chainId));

      try {
        accounts = (await _ethereumProvider.request({ method: "eth_accounts" })) as Array<string>;
        handleAccountsSync(accounts);
      } catch (err) {
        console.error("Metamask ERROR eth_accounts", err);
      }

      _ethereumProvider.on("chainChanged", handleChainIdSync);

      _ethereumProvider.on("accountsChanged", handleAccountsSync);
    } else {
      console.info(metamaskInstallMessage);
    }
  }
};

export {
  metamaskInstalled,
  metamaskInit,
  metamaskConnect,
  metamaskSwitchChain,
  metamaskConnectMessage,
  metamaskInstallMessage
};
