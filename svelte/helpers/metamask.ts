import type { EthereumProvider } from "hardhat/types";
import detectEthereumProvider from "@metamask/detect-provider";
import { ethers } from "ethers";
import { get } from "svelte/store";

import { numberToHexString, getChecksumAddress, getNetwork, networks } from "@lib/kconfig";

import { urlHash2RefNFT } from "@helpers/urlHash";
import { metamaskChainId, metamaskAccount, metamaskProvider, metamaskSigner } from "@main/metamask";

let ethereumProvider: EthereumProvider;
let metamaskInstalled = false;

const metamaskConnectMessage = "Connect to Metamask";
const metamaskInstallMessage = "Please install MetaMask extension to connect";
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
        ethereumProvider
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
  console.info(`handleChainId ${_chainId}`);

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
  console.info("handleAccountsSync", accounts);

  if (accounts?.length === 0) {
    metamaskConnect();
  } else if (accounts[0] !== String(get(metamaskAccount))) {
    metamaskSigner.set(get(metamaskProvider).getSigner(0));
    metamaskAccount.set(getChecksumAddress(accounts[0]));
  }
};

const metamaskSwitchChain = async (_chainId: number): Promise<void> => {
  console.info(`metamaskSwitchChain ${_chainId}`);

  if (_chainId > 0 && _chainId != Number(get(metamaskChainId))) {
    try {
      await ethereumProvider.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: numberToHexString(_chainId) }]
      });
    } catch (err) {
      if ((err as { code: number }).code === 4902) addEthereumChain(_chainId);
    }
  }
};

const metamaskConnect = (): void => {
  console.info("metamaskConnect");

  ethereumProvider
    .request({
      method: "eth_requestAccounts"
    })
    .then(handleAccountsSync)
    .catch((err: { code: number }) => {
      if (err.code === 4001) {
        alert(metamaskConnectMessage);
      } else {
        console.error("Metamask ERROR eth_requestAccounts", err);
      }
    });
};

const metamaskInit = async (): Promise<boolean> => {
  if (!get(metamaskChainId)) {
    console.info("metamaskInit");
    ethereumProvider = (await detectEthereumProvider()) as EthereumProvider;

    if (ethereumProvider) {
      metamaskInstalled = true;

      if (ethereumProvider !== window.ethereum) alert(metamaskMultipleWallets);

      const ethersProvider = new ethers.providers.Web3Provider(window.ethereum, "any");
      metamaskProvider.set(ethersProvider);

      let _chainId: number;
      try {
        // GET chainId from node connected to
        _chainId = (await ethereumProvider.request({ method: "eth_chainId" })) as number;
      } catch (err) {
        console.error("Metamask ERROR eth_chainId", err);
      }

      // IF chainId requested in url is different THEN switch chain on metamask
      const { chainId: _urlChainId } = urlHash2RefNFT();
      if (_urlChainId > 0 && _urlChainId != _chainId) {
        _chainId = _urlChainId;
        await metamaskSwitchChain(_urlChainId);
      }
      await handleChainId(Number(_chainId));

      try {
        const _accounts = (await ethereumProvider.request({ method: "eth_accounts" })) as Array<string>;
        handleAccountsSync(_accounts);
      } catch (err) {
        console.error("Metamask ERROR eth_accounts", err);
      }

      ethereumProvider.on("chainChanged", handleChainIdSync);

      ethereumProvider.on("accountsChanged", handleAccountsSync);
    } else {
      console.info(metamaskInstallMessage);
    }
  }

  return metamaskInstalled;
};

export { metamaskInit, metamaskConnect, metamaskSwitchChain, metamaskConnectMessage, metamaskInstallMessage };
