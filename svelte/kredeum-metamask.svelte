<svelte:options tag="kredeum-metamask" />

<script>
  import { ethers } from "ethers";
  import detectEthereumProvider from "@metamask/detect-provider";
  import { onMount } from "svelte";
  import { getNetwork, networks } from "../lib/config.mjs";

  export let signer = undefined;
  export let address = undefined;
  export let chainId = undefined;
  export let autoconnect = undefined;

  let network;
  let connectmetamask = "Connect to Metamask";

  let targetChain = false;

  async function addEthereumChain(_chainId) {
    console.log("addEthereumChain", _chainId);

    if (targetChain) {
      //console.log('already connecting network...');
    }
    targetChain = true;

    if (_chainId !== "0x1") {
      console.log("addEthereumChain", _chainId);
      // no need to add default ethereum chain

      const _network = getNetwork(_chainId);
      console.log("addEthereumChain", _network);
      if (_network) {
        for (const field in _network) {
          // IEP-3085 fields only or fails
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
          .then(() => {
            network = _network;
          })
          .catch((e) => console.error("ERROR wallet_addEthereumChain", e));
      }
    }
  }

  async function handleChainId(_chainId) {
    // console.log("handleChainId", _chainId);

    if (_chainId && _chainId != chainId) {
      network = getNetwork(_chainId);
      if (network) {
        chainId = _chainId;
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
    // console.log("handleAccounts", _accounts);

    if (_accounts?.length === 0) {
      if (autoconnect !== "off") connectMetamask();
    } else if (_accounts[0] !== address) {
      address = _accounts[0];
      signer = new ethers.providers.Web3Provider(ethereum).getSigner(0);
    }
  }
  async function connectMetamask() {
    //console.log('connectMetamask');

    ethereum
      .request({
        method: "eth_requestAccounts"
      })
      .then(handleAccounts)
      .catch((e) => {
        if (e.code === 4001) {
          alert("Please connect to MetaMask.");
        } else {
          //console.error('ERROR eth_requestAccounts', e);
        }
      });
  }
  onMount(async function () {
    //console.log('init');
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
      //console.log('Please install MetaMask!');
      connectmetamask =
        "Please install MetaMask chrome extension to connect your blockchain address to your site";
    }
  });
</script>

{#if address}
  {#if network}
    <a href="{network?.blockExplorerUrls[0]}/address/{address}/tokens" target="_blank"
      >{network?.chainName}@{address}</a
    >
  {:else}
    @{address}
  {/if}
  <small>
    (switch to
    {#each networks.filter((nw) => nw.prod) as network}
      {#if network.chainId !== chainId}
        &nbsp;<a href on:click="{() => switchEthereumChain(network.chainId)}">{network.chainName}</a
        >{/if}{/each})
  </small>
{:else}
  <button on:click="{connectMetamask}">{connectmetamask}</button>
{/if}
