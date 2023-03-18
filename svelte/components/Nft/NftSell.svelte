<script lang="ts">
  import { fade } from "svelte/transition";

  import { clickOutside } from "@helpers/clickOutside";
  import NftSetPrice from "./NftSetPrice.svelte";
  import { nftPrice } from "@helpers/nft";
  import { nftStore } from "@stores/nft/nft";
  import { getCurrency } from "@lib/common/config";
  import { utils } from "ethers";

  /////////////////////////////////////////////////
  //  <NftSell {chainId} {address} {tokenID} />
  // Set sell parameters for NFT(s)
  /////////////////////////////////////////////////
  export let chainId: number;
  export let address: string;
  export let tokenID: string;
  export let mode: string = undefined;
  /////////////////////////////////////////////////
  $: nft = nftStore.getOne(chainId, address, tokenID);
  /////////////////////////////////////////////////

  let open = false;

  const handleClose = () => (open = false);
</script>

<button
  on:click={() => (open = true)}
  class={mode == "detail" ? "btn-detail" : "btn btn-default btn-sell"}
  title="Sell this NFT"
>
  <i class="fa fa-dollar-sign fa-left" />
  {#if nftPrice($nft).gt(0)}
    ON SALE
    {#if mode === "detail"}
      &nbsp; <strong>{utils.formatEther(nftPrice($nft))} {getCurrency(chainId)}</strong>
    {/if}
  {:else}
    SELL
  {/if}
</button>

{#if open}
  <div id="kre-sell-nft" class="modal-window" transition:fade>
    <div use:clickOutside={() => (open = false)}>
      <div id="kredeum-sell-nft">
        <div class="modal-content">
          <span on:click={handleClose} on:keydown={handleClose} title="Close" class="modal-close"
            ><i class="fa fa-times" /></span
          >

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

  button.btn-sell {
    font-weight: 900;
  }

  .btn-detail {
    background-color: #192247 !important;
    color: white !important;
  }

  .btn-detail:hover {
    background-color: #3acf6e !important;
  }
</style>
