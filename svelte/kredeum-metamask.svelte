<svelte:options tag="kredeum-metamask" />

<script>
  import { ethers } from "ethers";
  import detectEthereumProvider from "@metamask/detect-provider";
  import { onMount } from "svelte";
  import { createEventDispatcher } from "svelte";
  import networks from "../config/networks.json";

  const dispatch = createEventDispatcher();

  export let signer = undefined;
  export let address = undefined;
  export let chainId = undefined;
  export let autoconnect = undefined;
  export let chain_ids = undefined;

  let network;
  let connectmetamask = "Connect to Metamask";

  let targetChain = false;

  function networkGet(_chainId) {
    return networks.find((nw) => Number(nw.chainId) === Number(_chainId));
  }

  async function addEthereumChain(_chainId) {
    if (targetChain) {
      //console.log('already connecting network...');
    }
    targetChain = true;

    if (_chainId !== "0x1") {
      console.log("addEthereumChain", _chainId);
      // no need to add default ethereum chain

      const _network = networkGet(_chainId);
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
    if (_chainId && _chainId != chainId) {
      network = networkGet(_chainId);
      if (network) {
        chainId = _chainId;
      } else {
        // _chainId not accepted : add first accepted chainId
        addEthereumChain(chain_ids?.split(",")[0]);
      }
    }
  }

  async function handleAccounts(_accounts) {
    if (_accounts?.length === 0) {
      if (autoconnect !== "off") connectMetamask();
    } else if (_accounts[0] !== address) {
      address = _accounts[0];
      signer = new ethers.providers.Web3Provider(ethereum).getSigner(0);
      dispatch("address", { address: address });
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
{:else}
  <button on:click="{connectMetamask}">{connectmetamask}</button>
{/if}
