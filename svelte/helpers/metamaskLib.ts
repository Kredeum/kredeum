import type { EthereumProvider } from "hardhat/types";
import detectEthereumProvider from "@metamask/detect-provider";
import { ethers } from "ethers";
import { get as storeGet } from "svelte/store";

import { numberToHexString, getChecksumAddress, getNetwork, networks } from "lib/kconfig";

import { chainId, network, provider, signer, owner } from "main/network";

let ethereumProvider: EthereumProvider;
let metamaskInstalled = false;

const metamaskConnectMessage = "Connect to Metamask";
const metamaskInstallMessage = "Please install MetaMask extension to connect";
const metamaskMultipleWallets = "Do you have multiple wallets installed?";

let targetChain = false;

const addEthereumChain = (chainId: number): void => {
  if (chainId) {
    console.log("addEthereumChain", chainId);

    if (targetChain) {
      console.warn("Already connecting network...");
    }
    targetChain = true;

    // no need to add default ethereum chain
    if (chainId !== 1) {
      const _network = getNetwork(chainId);
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

const handleChainId = (_chainId: number): void => {
  console.log(`handleChainId ${_chainId}`);

  if (_chainId && _chainId != storeGet(chainId)) {
    const _network = getNetwork(_chainId);

    if (_network) {
      const ethersProvider = new ethers.providers.Web3Provider(window.ethereum, "any");

      network.set(_network);
      provider.set(ethersProvider);
      chainId.set(Number(_chainId));
    } else {
      // chainId not accepted : switch to first accepted chainId
      metamaskSwitchChain(networks[0].chainId);
    }
  }
};

const handleAccounts = (accounts: Array<string>): void => {
  console.log("handleAccounts", accounts);

  if (accounts?.length === 0) {
    metamaskConnect();
  } else if (accounts[0] !== String(storeGet(owner))) {
    signer.set(storeGet(provider).getSigner(0));
    owner.set(getChecksumAddress(accounts[0]));
  }
};

const metamaskSwitchChain = (_chainId: number): void => {
  console.log(`metamaskSwitchChain ${_chainId}`);

  if (_chainId > 0 && _chainId != Number(storeGet(chainId))) {
    ethereumProvider
      .request({
        method: "wallet_switchEthereumChain",
        params: [{ _chainId: numberToHexString(_chainId) }]
      })
      .catch((err: { code: number }) => {
        if (err.code === 4902) {
          addEthereumChain(_chainId);
        }
      });
  }
};

const metamaskConnect = (): void => {
  console.log("metamaskConnect");

  ethereumProvider
    .request({
      method: "eth_requestAccounts"
    })
    .then(handleAccounts)
    .catch((err: { code: number }) => {
      if (err.code === 4001) {
        alert(metamaskConnectMessage);
      } else {
        console.error("Metamask ERROR eth_requestAccounts", err);
      }
    });
};

const metamaskInit = async (): Promise<boolean> => {
  console.log("metamaskInit", metamaskInstalled);

  if (!metamaskInstalled) {
    ethereumProvider = (await detectEthereumProvider()) as EthereumProvider;

    if (ethereumProvider) {
      metamaskInstalled = true;

      if (ethereumProvider !== window.ethereum) alert(metamaskMultipleWallets);

      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.has("chainId")) {
        metamaskSwitchChain(Number(urlParams.get("chainId")));
      } else {
        try {
          const _chainId = (await ethereumProvider.request({ method: "eth_chainId" })) as string;
          handleChainId(Number(_chainId));
        } catch (err) {
          console.error("Metamask ERROR eth_chainId", err);
        }
      }

      try {
        const _accounts = (await ethereumProvider.request({ method: "eth_accounts" })) as Array<string>;
        handleAccounts(_accounts);
      } catch (err) {
        console.error("Metamask ERROR eth_accounts", err);
      }

      ethereumProvider.on("chainChanged", handleChainId);

      ethereumProvider.on("accountsChanged", handleAccounts);
    } else {
      console.log(metamaskInstallMessage);
    }
  }

  return metamaskInstalled;
};

export { metamaskInit, metamaskConnect, metamaskSwitchChain, metamaskConnectMessage, metamaskInstallMessage };
