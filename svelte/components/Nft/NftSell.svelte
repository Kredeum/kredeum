<script lang="ts">
  import { fade } from "svelte/transition";
  import { clickOutside } from "@helpers/clickOutside";

  import NftTokenApprove from "./NftTokenApprove.svelte";
  import NftSetPrice from "./NftSetPrice.svelte";
  import CollectionSetApproval from "../Collection/CollectionSetApproval.svelte";

  /////////////////////////////////////////////////
  //  <NftSell {chainId} {address} {tokenID} {nftPrice} />
  // Set sell parameters for NFT(s)
  /////////////////////////////////////////////////
  export let chainId: number;
  export let address: string;
  export let tokenID: string;
  export let nftPrice: string;
  /////////////////////////////////////////////////

  let open = false;
</script>

<button on:click={() => (open = true)} class="btn-sell-modal" title="Sell this NFT"> SELL </button>

{#if open}
  <div id="kre-sell-nft" class="modal-window" transition:fade>
    <div use:clickOutside={() => (open = false)}>
      <div id="kredeum-sell-nft">
        <div class="modal-content">
          <span on:click={() => (open = false)} title="Close" class="modal-close"><i class="fa fa-times" /></span>

          <div class="modal-body">
            <div>
              <!-- <div >
                <NftTokenApprove {chainId} {address} {tokenID} />
              </div>
              <div class="kre-modal-block">
                <CollectionSetApproval {chainId} {address} approval={true} />
              </div> -->
              <div class="kre-modal-block">
                <NftSetPrice {chainId} {address} {tokenID} {nftPrice} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
{/if}

<style>
  .modal-window {
    visibility: visible;
    opacity: 1;
  }

  #kre-sell-nft {
    z-index: 1000;
    pointer-events: auto;
  }

  .btn-sell-modal {
    background-color: #192247 !important;
    color: white !important;
  }

  .btn-sell-modal:hover {
    background-color: white !important;
    color: #192247 !important;
    border-color: #192247 !important;
  }
</style>
