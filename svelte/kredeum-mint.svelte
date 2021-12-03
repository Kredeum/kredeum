<script lang="ts">
  import type { Signer } from "ethers";
  import type { Nft } from "lib/ktypes";

  import { mintImage } from "lib/kmint";
  import KredeumCreateNft from "./kredeum-create-nft.svelte";

  import Metamask from "./kredeum-metamask.svelte";
  import { createEventDispatcher } from "svelte";
  import { getNetwork, Network } from "lib/kconfig";
  const dispatch = createEventDispatcher();

  import { ipfsGatewayLink, urlToLink, nftOpenSeaUrl } from "lib/knfts";

  export let key: string = undefined;
  export let metadata: string = undefined;
  export let alt: string = undefined;
  export let src: string = undefined;
  export let pid: string = undefined;
  export let collection: string = undefined;
  export let minted: Nft = undefined;
  export let width = 100;
  export let display = false;

  let minting = false;
  let cidImage: string;
  let cidJson: string;

  let signer: Signer;
  let address = "";
  let network: Network;

  let chainId;
  let chainIdOld;

  // CONTRACT OR NETWORK CHANGE
  $: if (chainId) {
    // console.log("kredeum-mint chainId changed", chainId);
    init();
  }

  async function init() {
    // console.log(`kredeum-mint init ${chainId}`, key, metadata);
    network = getNetwork(chainId);
    if (network) {
      if (!collection && chainId != chainIdOld) {
        // chain changed : force collection to default
        collection = network.openNFTs;
      }

      chainIdOld = chainId;
    }
  }

  const _mintImage = (e: Event) => {
    e.preventDefault();
    mintImage(src, {}, chainId, collection, signer);
  };
</script>

<main id="kredeum-mint">
  {#if display && src}
    <img {src} {alt} {width} /><br />
  {/if}

  {#if address}
    {#if minted}
      <a href={nftOpenSeaUrl(chainId, minted)} class="btn btn-small btn-sell" title="Sell"
        >SELL NFT</a
      >
    {:else if minting}
      <button id="mint-button" class="btn btn-small minting">MINTING...</button>
    {:else if !network}
      <button id="mint-button" class="btn btn-small switch">No network</button>
    {:else}
      <button id="mint-button-{pid}" on:click={_mintImage} class="btn btn-small btn-mint">
        MINT NFT
      </button>
    {/if}

    {#if display}
      <small>
        <br />{urlToLink(src, `${src}@${alt}`)}

        <br />{ipfsGatewayLink(cidImage)}
      </small>
    {/if}
  {:else}
    <small>
      <br /><Metamask autoconnect="off" bind:address bind:chainId bind:signer />
    </small>
  {/if}
</main>

<style>
  button {
    color: white;
    background-color: #2a81de;
    border: 0px;
    margin: 10px;
  }
  button:hover {
    cursor: pointer;
  }
  button.switch {
    background-color: grey;
  }
  button.mint:hover {
    background-color: black;
    cursor: pointer;
  }
  button.mint {
    background-color: #2a81de;
  }
  button.minting {
    color: black;
    background-color: grey;
  }
  button.sell {
    background-color: #36d06f;
  }
</style>
