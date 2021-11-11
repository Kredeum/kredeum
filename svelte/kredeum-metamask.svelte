<script lang="ts">
  import type { Signer } from "ethers";
  import type { EthereumProvider } from "hardhat/types";
  import type { Web3Provider, Provider } from "@ethersproject/providers";
  import type { Network } from "../lib/kconfig";

  import { ethers } from "ethers";
  import detectEthereumProvider from "@metamask/detect-provider";
  import { onMount } from "svelte";
  import { getNetwork, getEnsName, networks } from "../lib/kconfig";
  import {
    addressShort,
    textShort,
    numberToHexString,
    explorerAddressLink,
    explorerAddressUrl,
    explorerOpenNFTsUrl
  } from "../lib/knfts";

  export let signer: Signer;
  export let address: string;
  export let chainId: number;
  export let autoconnect: string;

  const testnets = true;

  let ethereumProvider: EthereumProvider;
  let ethersProvider: Web3Provider;

  let network: Network;
  let nameOrAddress = "";

  let connectmetamask = "Connect to Metamask";
  let targetChain = false;

  $: if (address) setEnsName();
  const setEnsName = async () => {
    nameOrAddress = address;
    nameOrAddress = await getEnsName(address);
  };

  const strUpFirst = (str: string): string =>
    str.length >= 1 ? str.charAt(0).toUpperCase() + str.substr(1) : "";

  const chainname = (network: Network): string => network?.chainName || "unknown";
  const chainName = (network: Network): string => strUpFirst(chainname(network));

  const addEthereumChain = async (_chainId) => {
    // console.log("<kredeum-metamask/> addEthereumChain", _chainId);

    if (targetChain) {
      console.log("already connecting network...");
    }
    targetChain = true;

    // no need to add default ethereum chain
    if (_chainId !== 1) {
      const _network = getNetwork(_chainId);
      if (_network) {
        _network.chainId = chainId;
        for (const field in _network) {
          // EIP-3085 fields only or fails
          if (
            ![
              "chainId",
              "blockExplorerUrls",
              "chainName",
              "iconUrls",
              "nativeCurrency",
              "rpcUrls"
            ].includes(field)
          ) {
            delete _network[field];
          }
        }
        // add new chain to metamask
        ethereumProvider
          .request({
            method: "wallet_addEthereumChain",
            params: [_network]
          })
          .catch((e) => console.error("ERROR wallet_addEthereumChain", e));
      }
    }
  };

  const handleChainId = async (_chainId) => {
    // console.log("<kredeum-metamask/> handleChainId", _chainId);

    if (_chainId && _chainId != chainId) {
      const _network = getNetwork(_chainId);
      if (_network) {
        chainId = Number(_chainId);
        network = _network;
      } else {
        // _chainId not accepted : add first accepted chainId
        addEthereumChain(networks[0].chainId);
      }
    }
  };

  const switchEthereumChain = async (_chainId) => {
    console.log("switchEthereumChain", _chainId, numberToHexString(_chainId));
    try {
      await ethereumProvider.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: numberToHexString(_chainId) }]
      });
    } catch (switchError) {
      if (switchError.code === 4902) {
        addEthereumChain(_chainId);
      }
    }
  };

  const handleAccounts = async (_accounts) => {
    // console.log("<kredeum-metamask/> handleAccounts", _accounts);

    if (_accounts?.length === 0) {
      if (autoconnect !== "off") connectMetamask();
    } else if (_accounts[0] !== address) {
      address = ethers.utils.getAddress(_accounts[0]);

      signer = ethersProvider.getSigner(0);

      // console.log(`<kredeum-metamask/> nameOrAddress ${nameOrAddress} ${name ? address : ""}`);
    }
  };

  const connectMetamask = async () => {
    // console.log("connectMetamask");

    ethereumProvider
      .request({
        method: "eth_requestAccounts"
      })
      .then(handleAccounts)
      .catch((e) => {
        if (e.code === 4001) {
          alert("Please connect to MetaMask.");
        } else {
          console.error("ERROR eth_requestAccounts", e);
        }
      });
  };

  onMount(async () => {
    // console.log("init");
    const provider = await detectEthereumProvider();
    if (provider) {
      if (provider !== window.ethereum) {
        alert("Do you have multiple wallets installed?");
      }

      ethereumProvider = window.ethereum as EthereumProvider;
      ethersProvider = new ethers.providers.Web3Provider(window.ethereum);

      ethereumProvider
        .request({
          method: "eth_accounts"
        })
        .then(handleAccounts)
        .catch((e) => console.error("ERROR eth_accounts", e));

      ethereumProvider
        .request({
          method: "eth_chainId"
        })
        .then(handleChainId)
        .catch((e) => console.error("ERROR eth_chainId", e));

      ethereumProvider.on("chainChanged", handleChainId);

      ethereumProvider.on("accountsChanged", handleAccounts);
    } else {
      console.log("Please install MetaMask!");
      connectmetamask = "Please install MetaMask chrome extension to connect with your address";
    }
  });
</script>

<div class="col col-xs-12 col-sm-3">
  <span class="label"
    >Address &nbsp;&nbsp;&nbsp;
    <a
      class="info-button"
      href={explorerAddressUrl(chainId, address)}
      target="_blank"
      title={address}><i class="fas fa-info-circle" /></a
    >
  </span>
  <div class="form-field">
    {#if address}
      <input type="text" value={addressShort(nameOrAddress, 10)} />
    {:else}
      <button on:click={connectMetamask}>{connectmetamask}</button>
    {/if}
  </div>
</div>

<div class="col col-xs-12 col-sm-3">
  <span class="label"
    >Network &nbsp;&nbsp;&nbsp;
    <a
      class="info-button"
      href={explorerOpenNFTsUrl(chainId)}
      target="_blank"
      title={chainId?.toString()}><i class="fas fa-info-circle" /></a
    >
  </span>
  <div class="select-wrapper select-network">
    <div class="select">
      <div class="select-trigger">
        <span class={chainname(network)}>{chainName(network)}</span>
      </div>
      <div class="custom-options">
        {#each networks.filter((nw) => nw.mainnet) as _network}
          <span
            class="custom-option {_network.chainId == chainId && 'selected'}"
            data-value={chainname(_network)}
            on:click={() => switchEthereumChain(_network.chainId)}
          >
            {chainName(_network)}
          </span>
        {/each}
      </div>
    </div>
  </div>
</div>

<!-- {#if network?.testnet}
    <div><br /></div>
    <span class="label label-big">Testnets</span>

    <div class="box-fields">
      {#each networks.filter((nw) => nw.testnet) as _network}
        <input
          class="box-field"
          id="{_network.chainName}"
          name="blockchain-type"
          type="checkbox"
          value="{_network.chainName}"
          checked="{_network.chainId == chainId}"
          on:click="{() => switchEthereumChain(_network.chainId)}"
        />
        <label class="field" for="{_network.chainName}">{_network.chainName}</label>
      {/each}
    </div>
  {/if} -->
