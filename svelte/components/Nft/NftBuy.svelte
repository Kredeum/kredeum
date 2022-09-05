<script lang="ts">
  import { buyNftResponse, buyNftReceipt } from "@lib/nft/kbuy";
  import { explorerNftUrl, explorerTxUrl, explorerTxLog, textShort } from "@lib/common/kconfig";

  import { metamaskChainId, metamaskSigner } from "@main/metamask";

  import { getContext } from "svelte";
  import { Writable } from "svelte/store";
  import { fade } from "svelte/transition";
  import { clickOutside } from "@helpers/clickOutside";
  import { ethers } from "ethers";
  // import { formatEther } from "ethers/lib/utils";

  /////////////////////////////////////////////////
  //  <NftTransfer {chainId} {address} {tokenID} />
  // Display NFT
  /////////////////////////////////////////////////
  export let chainId: number;
  export let address: string;
  export let tokenID: string;
  export let nftPrice: string;

  let buyTxHash: string = null;
  let buying = false;
  let buyed = false;
  let fail = false;

  // Context for refreshCollectionList
  ///////////////////////////////////////////////////////////
  let refreshCollectionList: Writable<number> = getContext("refreshCollectionList");
  let refreshNftsList: Writable<number> = getContext("refreshNftsList");

  ///////////////////////////////////////////////////////////

  let open = false;

  const openBuyModal = () => {
    open = true;
  };

  const closeBuyModal = () => {
    open = false;
  };

  const buy = async () => {
    if ($metamaskSigner) {
      buyTxHash = null;
      buying = true;
      buyed = false;

      const txResp = await buyNftResponse(chainId, address, tokenID, $metamaskSigner, nftPrice);
      if (txResp) {
        buyTxHash = txResp.hash;
        explorerTxLog(chainId, txResp);

        const txReceipt = await buyNftReceipt(txResp);

        buyed = Boolean(txReceipt.status);
      } else {
        fail = true;
      }
      buying = false;

      $refreshCollectionList += 1;
      $refreshNftsList += 1;
    }
  };
</script>

<span on:click={() => openBuyModal()} class="btn btn-small btn-outline" title="Buy this nft"
  ><i class="fa fa-shopping-cart" /> Buy</span
>

{#if open}
  <div id="kre-buy-nft" class="modal-window" transition:fade>
    <div
      use:clickOutside={() => {
        closeBuyModal();
      }}
    >
      <div id="kredeum-buy-nft">
        <div class="modal-content">
          <span on:click={closeBuyModal} title="Close" class="modal-close"><i class="fa fa-times" /></span>

          <div class="modal-body">
            <div>
              {#if buyed}
                <div>
                  <div class="titre">
                    <i class="fas fa-check fa-left c-green" />
                    NFT
                    <a class="link" href="{explorerNftUrl(chainId, { chainId, address, tokenID })}}" target="_blank"
                      >#{tokenID}</a
                    >
                    buyed!
                  </div>
                </div>
              {:else if fail}
                <div class="section">
                  <div class="kre-buy-warning">
                    <i class="fas fa-exclamation-triangle fa-left c-red" />
                    Buy process failed ! NFT sould not be on sale or there was an error during process
                  </div>
                </div>
              {:else if buying}
                <div class="titre">
                  <i class="fas fa-sync fa-left c-green" />buying NFT...
                </div>
                <div class="section">
                  {#if buyTxHash}
                    Wait till completed, it may take one minute or more.
                  {:else}
                    Sign the transaction
                  {/if}
                </div>
              {:else}
                <div class="titre">
                  <i class="fas fa-shopping-cart" /> Buy this NFT #{tokenID} for {ethers.utils.formatEther(nftPrice)} Eth
                  ?
                </div>

                <div class="txtright">
                  <button class="btn btn-default btn-sell" type="submit" on:click={() => buy()}>Buy</button>
                </div>
              {/if}
              {#if buyTxHash}
                <div class="flex">
                  <a class="link" href={explorerTxUrl($metamaskChainId, buyTxHash)} target="_blank"
                    >{textShort(buyTxHash)}</a
                  >
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

  #kre-buy-nft {
    z-index: 1000;
    pointer-events: auto;
  }

  .kre-buy-warning {
    background-color: rgba(255, 0, 0, 0.07);
    border-radius: 6px;
    padding: 15px 30px;
  }
</style>
