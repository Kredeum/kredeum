<script lang="ts">
  import { Readable } from "svelte/store";
  import { NftType } from "@lib/common/ktypes";

  import { constants, utils } from "ethers";

  import { onMount } from "svelte";
  import { fade } from "svelte/transition";
  import { clickOutside } from "@helpers/clickOutside";

  import { metamaskChainId, metamaskSigner } from "@main/metamask";
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
  //  <NftBuy {chainId} {address} {tokenID} />
  // Buy one NFT
  /////////////////////////////////////////////////
  export let chainId: number;
  export let address: string;
  export let tokenID: string;
  ///////////////////////////////////////////////////////////

  let buying: number;
  let buyTxHash: string;
  let buyError: string;

  let open = false;

  let nft: Readable<NftType>;

  // HANDLE CHANGE : on truthy chainId and address, and whatever account
  $: chainId && address && tokenID && $metamaskChainId && handleChange();
  const handleChange = async (): Promise<void> => {
    // console.log(`NFTDETAIL CHANGE #${i++} ${nftKey(chainId, address, tokenID)}`);

    // STATE VIEW : sync get Nft
    nft = nftStore.getOneStore(chainId, address, tokenID);

    // ACTION : async refresh Nft
    await nftStore.refreshOne(chainId, address, tokenID).catch(console.error);
  };

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

  const buyInit = async () => {
    buyTxHash = null;

    buying = S1_CONFIRM;
  };

  onMount(() => {
    buyInit();
  });

  const buyConfirm = async () => {
    const buyTxRespYield = buyNft(chainId, address, tokenID, $nft.price, $metamaskSigner);

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
    if ($nft.price.gt(0)) open = true;
  }}
  href="#buy-nft-{tokenID}"
  class="btn-buy-modal {constants.Zero.eq($nft?.price) ? 'kre-disabled' : ''}"
  title="Buy this nft"><i class="fa fa-shopping-cart fa-left" aria-disabled={constants.Zero.eq($nft?.price)} /> Buy</a
>

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
                    <i class="fas fa-shopping-cart" /> Buy this NFT #{tokenID} for {utils.formatEther($nft.price)}
                    {getCurrency(chainId)} using AutoMarket smartcontract ?
                  </p>
                </div>
                <IncomesPreview {chainId} {address} {tokenID} />
                <div class="txtright">
                  <button class="btn btn-default btn-sell" type="submit" on:click={() => buyConfirm()}>Buy</button>
                </div>
                {#if getOpenSea(chainId)}
                  <div class="kre-modal-block">
                    <div class="txtright">
                      <a href={nftOpenSeaUrl(chainId, $nft)} class="btn btn-small btn-buy" title="Buy" target="_blank">
                        Buy on OpenSea
                      </a>
                    </div>
                  </div>
                {/if}
              {/if}

              {#if buying >= S2_SIGN_TX && buying < S4_BUYED}
                <div class="titre">
                  <p>
                    <i class="fas fa-sync fa-left c-green" />Buying NFT #{tokenID} for {utils.formatEther($nft.price)}
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
                      target="_blank">#{tokenID}</a
                    >
                    buyed!
                  </p>
                </div>
              {/if}

              {#if buyTxHash}
                <div class="flex">
                  <a class="link" href={explorerTxUrl(chainId, buyTxHash)} target="_blank">{textShort(buyTxHash)}</a>
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
  }

  .btn-buy-modal {
    background-color: #192247 !important;
    color: white !important;
  }

  .btn-buy-modal:hover {
    background-color: #3acf6e !important;
  }
</style>
