<script lang="ts">
  import type { Signer } from "ethers";
  import type { Nft } from "../lib/ktypes";

  import { mintImage } from "../lib/kmint";

  import Metamask from "./kredeum-metamask.svelte";
  import { createEventDispatcher } from "svelte";
  import { getNetwork, Network } from "lib/kconfig";
  const dispatch = createEventDispatcher();

  import { ipfsGatewayLink, urlToLink, nftOpenSeaUrl } from "../lib/knfts";

  export let key: string;
  export let alt: string;
  export let src: string;
  export let pid: string;
  export let collection: string;
  export let metadata: string;
  export let width: number = 100;
  export let display: boolean = false;
  export let minted: Nft;

  let minting: boolean = false;
  let cidImage: string;
  let cidJson: string;

  let signer: Signer;
  let address: string = "";
  let network: Network;

  let chainId;
  let chainIdOld;

  // CONTRACT OR NETWORK CHANGE
  $: if (chainId) {
    // console.log("<kredeum-nfts-mint/> chainId changed", chainId);
    init();
  }

  async function init() {
    // console.log(`<kredeum-nfts-mint/> init ${chainId}`);
    network = getNetwork(chainId);
    if (network) {
      if (!collection && chainId != chainIdOld) {
        // chain changed : force collection to default
        collection = network.openNFTs;
      }

      chainIdOld = chainId;
    }
  }

  const _mintImage = () => mintImage(src, {}, chainId, collection, signer);
</script>

<main id="kredeum-mint">
  IMAGE
  {#if display && src}
    <img src="{src}" alt="{alt}" width="{width}" /><br />
  {/if}

  {#if address}
    {#if minted}
      <a href="{nftOpenSeaUrl(chainId, minted)}" class="btn btn-small btn-sell" title="Sell"
        >SELL NFT</a
      >

      <!-- </a> -->
    {:else if minting}
      <button id="mint-button" class="minting">MINTING...</button>
    {:else if !network}
      <button id="mint-button" class="switch">No network</button>
    {:else}
      <!-- <a href="#" class="btn btn-small btn-mint" title="Mint">Mint</a> -->

      <button id="mint-button-{pid}" on:click="{_mintImage}" class="btn btn-small btn-mint">
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

  <div class="box-section">
    <span class="label label-big">Statut</span>
    <div class="box-fields">
      <input class="box-field" id="mint" name="statut" type="checkbox" value="Mint" />
      <label class="field" for="mint">Mint</label>

      <input class="box-field" id="inactive" name="statut" type="checkbox" value="Inactive" />
      <label class="field" for="inactive">Inactive</label>

      <input class="box-field" id="sell" name="statut" type="checkbox" value="Sell" />
      <label class="field" for="sell">Sell</label>
    </div>
  </div>
</main>
