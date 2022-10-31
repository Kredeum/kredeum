<script lang="ts">
  import { fade } from "svelte/transition";

  import { clickOutside } from "@helpers/clickOutside";
  import NftSetPrice from "./NftSetPrice.svelte";

  /////////////////////////////////////////////////
  //  <NftSell {chainId} {address} {tokenID} />
  // Set sell parameters for NFT(s)
  /////////////////////////////////////////////////
  export let chainId: number;
  export let address: string;
  export let tokenID: string;
  export let platform = "dapp";
  /////////////////////////////////////////////////

  let open = false;
</script>

<button
  on:click={() => (open = true)}
  class={platform === "buy-external" ? "btn btn-default  btn-sell" : "btn-sell-modal"}
  title="Sell this NFT"
>
  SELL
</button>

{#if open}
  <div id="kre-sell-nft" class="modal-window" transition:fade>
    <div use:clickOutside={() => (open = false)}>
      <div id="kredeum-sell-nft">
        <div class="modal-content">
          <span on:click={() => (open = false)} title="Close" class="modal-close"><i class="fa fa-times" /></span>

          <div class="modal-body">
            <div>
              <NftSetPrice {chainId} {address} {tokenID} />
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
    color: #1e1e43;
  }

  .btn-sell-modal {
    background-color: #192247 !important;
    color: white !important;
  }

  .btn-sell-modal:hover {
    background-color: #3acf6e !important;
  }
</style>
