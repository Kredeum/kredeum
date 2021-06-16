<svelte:options tag="kredeum-web3modal" />

<script>
  // import Web3 from "web3";
  import Web3Modal from "web3modal";

  import { ethers } from "ethers";
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
  let provider;

  let targetChain = false;

  const providerOptions = {
    /* See Provider Options Section */
  };

  async function addEthereumChain(_chainId) {
    if (targetChain) {
      //console.log('already connecting network...');
    }
    targetChain = true;

    if (_chainId !== "0x1") {
      console.log("addEthereumChain", _chainId);
      // no need to add default provider chain

      const _network = networks.find((nw) => Number(nw.chainId) === Number(_chainId));
      console.log("addEthereumChain", _network);
      if (_network) {
        for (const field in _network) {
          // IEP-3085 fields only or fails
          if (!["chainId", "blockExplorerUrls", "chainName", "iconUrls", "nativeCurrency", "rpcUrls"].includes(field)) {
            delete _network[field];
          }
        }
        // add new chain
        provider
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
    if (_chainId) {
      // _chainId not null
      if (_chainId != chainId) {
        // _chainId changed

        // transform chain_ids list to chainIds array : "0x89,0x13881" => ["0x89","0x13881"]
        const chainIds = chain_ids?.split(",");
        //console.log("handleChainId <=", _chainId, chainIds);

        if (chainIds && !chainIds.find((id) => Number(id) === Number(_chainId))) {
          // _chainId not accepted : add first accepted chainId
          addEthereumChain(chainIds[0]);
        } else {
          chainId = _chainId;
          network = networks.find((nw) => Number(nw.chainId) === Number(_chainId));
        }
      }
    }
  }

  async function handleAccounts(_accounts) {
    if (_accounts?.length === 0) {
      if (autoconnect !== "off") connectMetamask();
    } else if (_accounts[0] !== address) {
      address = _accounts[0];
      signer = new ethers.providers.Web3Provider(provider).getSigner(0);
      dispatch("address", { address: address });
    }
  }

  onMount(async function () {
    //console.log('init');

    const web3Modal = new Web3Modal({
      network: "mumbai", // optional
      cacheProvider: true, // optional
      providerOptions // required
    });
    provider = await web3Modal.connect();
    // const web3 = new Web3(provider);

    provider.on("chainChanged", handleChainId);
    provider.on("accountsChanged", handleAccounts);
    provider.on("connect", console.log);
    provider.on("disconnect", console.log);
  });
</script>

{#if address}
  {#if network}
    <a href="{network?.blockExplorerUrls[0]}/address/{address}/tokens" target="_blank">{network?.chainName}@{address}</a
    >
  {:else}
    {network?.chainName}@{address}
  {/if}
{:else}
  <button on:click>Connect ?</button>
{/if}
