<svelte:options tag="kredeum-metamask" />

<script>
  import { ethers } from "ethers";
  import detectEthereumProvider from "@metamask/detect-provider";
  import { onMount } from "svelte";
  import { getNetwork, networks } from "../lib/kconfig";

  export let signer = undefined;
  export let address = undefined;
  export let chainId = undefined;
  export let autoconnect = undefined;

  let network;
  let nameOrAddress = "";
  let connectmetamask = "Connect to Metamask";

  let targetChain = false;

  async function addEthereumChain() {
    // console.log("<kredeum-metamask/> addEthereumChain", chainId);

    if (targetChain) {
      console.log("already connecting network...");
    }
    targetChain = true;

    // no need to add default ethereum chain
    if (chainId !== "0x1") {

      const _network = getNetwork(chainId);
      if (_network) {
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
        ethereum
          .request({
            method: "wallet_addEthereumChain",
            params: [_network]
          })
          .catch((e) => console.error("ERROR wallet_addEthereumChain", e));
      }
    }
  }

  async function handleChainId(_chainId) {
    // console.log("<kredeum-metamask/> handleChainId", _chainId);

    if (_chainId && _chainId != chainId) {
      const _network = getNetwork(_chainId);
      if (_network) {
        chainId = _chainId;
        network = _network;
      } else {
        // _chainId not accepted : add first accepted chainId
        addEthereumChain(networks[0].chainId);
      }
    }
  }

  async function switchEthereumChain(_chainId) {
    try {
      await ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: _chainId }]
      });
    } catch (switchError) {
      if (switchError.code === 4902) {
        addEthereumChain(_chainId);
      }
    }
  }

  async function handleAccounts(_accounts) {
    // console.log("<kredeum-metamask/> handleAccounts", _accounts);

    if (_accounts?.length === 0) {
      if (autoconnect !== "off") connectMetamask();
    } else if (_accounts[0] !== address) {
      address = ethers.utils.getAddress(_accounts[0]);

      let name;
      const provider = new ethers.providers.Web3Provider(ethereum);
      try {
        name = await provider.lookupAddress(address);
      } catch (e) {
        console.error("NO ENS on this chain");
      }
      nameOrAddress = name || address || "";

      signer = provider.getSigner(0);

      // console.log(`<kredeum-metamask/> nameOrAddress ${nameOrAddress} ${name ? address : ""}`);
    }
  }
  async function connectMetamask() {
    // console.log("connectMetamask");

    ethereum
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
  }
  onMount(async function () {
    // console.log("init");
    const provider = await detectEthereumProvider();
    if (provider) {
      if (provider !== window.ethereum) {
        alert("Do you have multiple wallets installed?");
      }

      ethereum
        .request({
          method: "eth_accounts"
        })
        .then(handleAccounts)
        .catch((e) => console.error("ERROR eth_accounts", e));

      ethereum
        .request({
          method: "eth_chainId"
        })
        .then(handleChainId)
        .catch((e) => console.error("ERROR eth_chainId", e));

      ethereum.on("chainChanged", handleChainId);

      ethereum.on("accountsChanged", handleAccounts);
    } else {
      console.log("Please install MetaMask!");
      connectmetamask =
        "Please install MetaMask chrome extension to connect your blockchain address to your site";
    }
  });
</script>

{#if address}
  {#if network}
    <a href="{network?.blockExplorerUrls[0]}/address/{address}/tokens" target="_blank"
      >{nameOrAddress}@{network?.chainName}</a
    >
  {:else}
    {nameOrAddress}
  {/if}
  <small>
    switch to
    {#each networks.filter((nw) => nw.type == "mainnet") as network}
      {#if network.chainId !== chainId}
        &nbsp;<a href on:click="{() => switchEthereumChain(network.chainId)}">
          @{network.chainName}
        </a>
      {/if}
    {/each}
    {#if address == network?.admin}
      ( testnets
      {#each networks.filter((nw) => nw.type == "testnet") as network}
        {#if network.chainId !== chainId}
          &nbsp;<a href on:click="{() => switchEthereumChain(network.chainId)}">
            @{network.chainName}
          </a>
        {/if}
      {/each}
      )
    {/if}
  </small>
{:else}
  <button on:click="{connectMetamask}">{connectmetamask}</button>
{/if}
