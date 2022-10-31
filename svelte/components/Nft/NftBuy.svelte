<script lang="ts">
  import { ReceiverType } from "@lib/common/ktypes";
  import { BigNumber, constants, utils } from "ethers";

  import { onMount } from "svelte";
  import { fade } from "svelte/transition";
  import { clickOutside } from "@helpers/clickOutside";

  import { metamaskSigner } from "@main/metamask";
  import { buyNft } from "@lib/nft/kbuy";
  import {
    explorerNftUrl,
    explorerTxUrl,
    explorerTxLog,
    textShort,
    getOpenSea,
    nftOpenSeaUrl,
    getCurrency
  } from "@lib/common/kconfig";

  import { nftStore } from "@stores/nft/nft";
  import IncomesPreview from "../Global/IncomesPreview.svelte";

  /////////////////////////////////////////////////
  //  <NftBuy {chainId} {address} {tokenID}  {nftOwner} {nftPrice} {nftRoyalty} />
  // Buy one NFT
  /////////////////////////////////////////////////
  export let chainId: number;
  export let address: string;
  export let tokenID: string;
  export let nftOwner: string;
  export let nftPrice: BigNumber;
  export let nftRoyalty: ReceiverType;
  export let platform = "dapp";
  ///////////////////////////////////////////////////////////

  let buying: number;
  let buyTxHash: string;
  let buyError: string;

  let open = false;

  const _buyError = (err: string): void => {
    buyError = err;
    console.error(buyError);
    buying = 0;
  };

  // BUYING STATES
  //
  //  STATE 0 Start
  //    |
  //  STATE 1
  //  Confirm buy
  //    |
  //  STATE 2
  // Ask for signature
  //    |
  //  TEST TxResp --> ERROR sending TX
  //    |
  //  STATE 3 Display TX Hash
  //    |
  //  TEST TxReceipt --> ERROR inside TX
  //    |
  //  STATE 4 End TX & Refresh
  //    |
  //  CLICK Close
  //    |
  //  STATE 0 popup closed

  // STATES : S0-S4
  const S1_CONFIRM = 1;
  const S2_SIGN_TX = 2;
  const S3_WAIT_TX = 3;
  const S4_BUYED = 4;

  const buyInit = () => {
    buyTxHash = null;

    buying = S1_CONFIRM;
  };

  onMount(() => {
    buyInit();
  });

  const buyConfirm = async () => {
    const buyTxRespYield = buyNft(chainId, address, tokenID, nftPrice, $metamaskSigner);

    buying = S2_SIGN_TX;

    const buyTxResp = (await buyTxRespYield.next()).value;
    buyTxHash = buyTxResp?.hash;
    if (!buyTxHash) return _buyError(`ERROR while sending transaction... ${JSON.stringify(buyTxResp, null, 2)}`);

    explorerTxLog(chainId, buyTxResp);
    buying = S3_WAIT_TX;

    const txReceipt = (await buyTxRespYield.next()).value;

    if (!Boolean(txReceipt.status)) return _buyError(`ERROR returned by transaction ${txReceipt}`);

    buying = S4_BUYED;

    await nftStore.refreshOne(chainId, address, tokenID).catch(console.error);
  };
</script>

<a
  on:click={() => {
    if (constants.Zero.lt(nftPrice || 0)) open = true;
  }}
  href="#buy-nft-{tokenID}"
  class="btn-buy {platform === 'buy-external' ? 'btn btn-default btn-buy-shortcode' : 'btn-buy-modal'}"
  title="Buy this NFT"
  ><i class="fa fa-shopping-cart fa-left" aria-disabled={constants.Zero.eq(nftPrice || 0)} />
  {#if nftPrice.gt(0)}
    BUY <strong>{utils.formatEther(nftPrice)} {getCurrency(chainId)}</strong>
  {:else}
    <strong>Not on sale</strong>
  {/if}
</a>

{#if open}
  <div id="kre-buy-nft" class="modal-window" transition:fade>
    <div use:clickOutside={() => (open = false)}>
      <div id="kredeum-buy-nft">
        <div class="modal-content">
          <span on:click={() => (open = false)} title="Close" class="modal-close"><i class="fa fa-times" /></span>

          <div class="modal-body">
            <div>
              {#if buying == S1_CONFIRM}
                <div class="titre">
                  <p>
                    <i class="fas fa-shopping-cart" /> Buy this NFT #{tokenID} for {utils.formatEther(nftPrice)}
                    {getCurrency(chainId)} using AutoMarket smartcontract ?
                  </p>
                </div>
                <div class="section">
                  <IncomesPreview {chainId} {nftPrice} {nftOwner} {nftRoyalty} />
                </div>
                <div class="txtright">
                  <button class="btn btn-default btn-sell" type="submit" on:click={() => buyConfirm()}>Buy</button>
                </div>
              {/if}

              {#if buying >= S2_SIGN_TX && buying < S4_BUYED}
                <div class="titre">
                  <p>
                    <i class="fas fa-sync fa-left c-green" />Buying NFT #{tokenID} for {utils.formatEther(nftPrice)}
                    {getCurrency(chainId)}...
                  </p>
                </div>
              {/if}

              {#if buying == S2_SIGN_TX}
                <div class="section">Please, sign the transaction</div>
              {:else if buying == S3_WAIT_TX}
                <div class="section">Wait till completed, it may take one minute or more.</div>
              {/if}

              {#if buying == S4_BUYED}
                <div class="titre">
                  <p>
                    <i class="fas fa-check fa-left c-green" /> NFT
                    <a
                      class="link"
                      href="{explorerNftUrl(chainId, {
                        chainId: chainId,
                        address: address,
                        tokenID: tokenID
                      })}}"
                      target="_blank"
                      rel="noreferrer">#{tokenID}</a
                    >
                    buyed!
                  </p>
                </div>
              {/if}

              {#if buyTxHash}
                <div class="flex">
                  <a class="link" href={explorerTxUrl(chainId, buyTxHash)} target="_blank" rel="noreferrer"
                    >{textShort(buyTxHash)}</a
                  >
                </div>
              {/if}

              {#if buyError}
                <div class="section">
                  <div class="form-field kre-warning-msg">
                    <p><i class="fas fa-exclamation-triangle fa-left c-red" />{buyError}</p>
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

  #kre-buy-nft {
    z-index: 1000;
    pointer-events: auto;
    color: #1e1e43;
  }

  .btn-buy strong {
    margin-left: 0.5em;
  }

  .btn-buy-modal {
    background-color: #192247 !important;
    color: white !important;
  }

  .btn-buy-modal,
  .btn-buy-shortcode:hover {
    background-color: #3acf6e !important;
  }
</style>
