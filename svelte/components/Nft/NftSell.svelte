<script lang="ts">
  import { NftType } from "@lib/common/ktypes";

  import { fade } from "svelte/transition";
  import { clickOutside } from "@helpers/clickOutside";

  import { metamaskAccount } from "@main/metamask";

  import NftSetPrice from "./NftSetPrice.svelte";
  import NftWithdraw from "./NftWithdraw.svelte";
  import { addressSame, getOpenSea, nftOpenSeaUrl } from "@lib/common/kconfig";
  // import NftTokenApprove from "./NftTokenApprove.svelte";
  // import CollectionSetApproval from "../Collection/CollectionSetApproval.svelte";

  /////////////////////////////////////////////////
  //  <NftSell {chainId} {address} {tokenID} {nftPrice} />
  // Set sell parameters for NFT(s)
  /////////////////////////////////////////////////
  export let chainId: number;
  export let address: string;
  export let tokenID: string;
  export let nft: NftType;
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
              <NftSetPrice {chainId} {address} {tokenID} {nft} />

              <NftWithdraw {chainId} {address} {tokenID} {nft} />

              {#if getOpenSea(chainId)}
                <div class="kre-modal-block">
                  <div class="txtright">
                    <!-- {#if addressSame(nft.owner, $metamaskAccount)} -->
                    <a href={nftOpenSeaUrl(chainId, nft)} class="btn btn-small btn-sell" title="Sell" target="_blank">
                      Sell on OpenSea
                      <!-- </a>
                    {:else}
                      <a href={nftOpenSeaUrl(chainId, nft)} class="btn btn-small btn-buy" title="Buy" target="_blank">
                        Buy on OpenSea
                      </a>
                    {/if} -->
                    </a>
                  </div>
                </div>
              {/if}
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
    background-color: #3acf6e !important;
  }
</style>
