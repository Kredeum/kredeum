<script lang="ts">
  import { utils } from "ethers";

  import { onMount } from "svelte";
  import { fade } from "svelte/transition";
  import { clickOutside } from "@helpers/clickOutside";
  import { nftPrice } from "@helpers/nft";

  import { buyNft } from "@lib/nft/nft-buy";
  import { explorerNftUrl, explorerTxUrl, explorerTxLog, textShort, getCurrency } from "@lib/common/config";

  import { nftStore } from "@stores/nft/nft";
  import NftIncomes from "./NftIncomes.svelte";
  import AccountConnect from "../Account/AccountConnect.svelte";

  /////////////////////////////////////////////////
  //  <NftBuy {chainId} {address} {tokenID} {mode}? />
  // Buy one NFT
  /////////////////////////////////////////////////
  export let chainId: number;
  export let address: string;
  export let tokenID: string;
  export let mode: string = undefined;
  ///////////////////////////////////////////////////////////
  $: nft = nftStore.getOne(chainId, address, tokenID);
  ///////////////////////////////////////////////////////////

  let buying: number;
  let buyTxHash: string;
  let buyError: string;

  let open = false;
  let signer: string = undefined;

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

  const buyConfirm = async () => {
    const buyTxRespYield = buyNft(chainId, address, tokenID, nftPrice($nft));

    buying = S2_SIGN_TX;

    const buyTxResp = (await buyTxRespYield.next()).value;
    buyTxHash = buyTxResp?.hash;
    if (!buyTxHash) return _buyError(`ERROR while sending transaction... ${JSON.stringify(buyTxResp, null, 2)}`);

    explorerTxLog(chainId, buyTxResp);
    buying = S3_WAIT_TX;

    const txReceipt = (await buyTxRespYield.next()).value;

    if (!Boolean(txReceipt.status)) return _buyError(`ERROR returned by transaction ${txReceipt}`);

    buying = S4_BUYED;

    nftStore.refreshOne(chainId, address, tokenID).catch(console.error);
  };

  const handleClose = () => (open = false);

  const handleCLick = (evt: Event) => {
    console.log("handleCLick ~ evt:", evt);
    evt.preventDefault();
    open = nftPrice($nft).gt(0);
  };
  onMount(buyInit);
</script>

{#if nftPrice($nft).gt(0)}
  <button
    on:click={handleCLick}
    on:keyup={handleCLick}
    type="button"
    class="btn-buy {mode === 'detail' ? 'btn-buy-modal' : 'btn btn-default btn-buy-web'}"
    title="Buy this NFT"
  >
    <i class="fa fa-shopping-cart fa-left" />
    BUY
    {#if mode === "detail"}
      &nbsp; <strong>{utils.formatEther(nftPrice($nft))} {getCurrency(chainId)}</strong>
    {/if}
  </button>
{:else}
  <button type="button" class="btn btn-disable" title="NFT not on sale">
    <i class="fa fa-shopping-cart fa-left" />
    NOT ON SALE
  </button>
{/if}

{#if open}
  <div id="kre-buy-nft" class="modal-window" transition:fade>
    <div class="modal-content" use:clickOutside={handleClose}>
      <span on:click={handleClose} on:keydown={handleClose} title="Close" class="modal-close"
        ><i class="fa fa-times" /></span
      >

      <div class="modal-body">
        <div>
          {#if buying == S1_CONFIRM}
            <div class="titre">
              <p>
                <i class="fas fa-shopping-cart" /> BUY
              </p>
            </div>

            <div class="section">
              <p>
                <i class="fas fa-angle-right" /> Buy this NFT #{tokenID} for
                {utils.formatEther(nftPrice($nft))}
                {getCurrency(chainId)} ?
              </p>
            </div>

            <div class="section">
              <NftIncomes nft={$nft} />
            </div>
            <div class="txtright">
              {#if signer}
                <button class="btn btn-default btn-sell" type="submit" on:click={() => buyConfirm()}>Buy</button>
              {:else}
                <AccountConnect bind:signer />
              {/if}
            </div>
          {/if}

          {#if buying >= S2_SIGN_TX && buying < S4_BUYED}
            <div class="titre">
              <p>
                <i class="fas fa-sync fa-left c-green" />Buying NFT #{tokenID} for {utils.formatEther(nftPrice($nft))}
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

  .btn-disable {
    cursor: not-allowed;
  }

  .btn-buy-modal {
    background-color: #192247 !important;
    color: white !important;
  }

  .btn-buy-modal,
  .btn-buy-web:hover {
    background-color: #3acf6e !important;
  }
</style>
