<script lang="ts">
  import { NftType } from "@lib/common/ktypes";

  import { BigNumber, constants } from "ethers";

  import { onMount } from "svelte";

  import { metamaskSigner, metamaskAccount } from "@main/metamask";
  import { explorerCollectionUrl, explorerTxLog, explorerTxUrl, getCurrency, textShort } from "@lib/common/kconfig";

  import { nftStore } from "@stores/nft/nft";
  import { setTokenPrice } from "@lib/nft/kautomarket";

  import InputPrice from "../Global/InputPrice.svelte";
  import IncomesPreview from "../Global/IncomesPreview.svelte";
  import type { Readable } from "svelte/store";
  import { formatEther } from "ethers/lib/utils";

  /////////////////////////////////////////////////
  //  <NftSetPrice {chainId} {address} {tokenID} />
  // Set  NFT Price
  /////////////////////////////////////////////////
  export let chainId: number;
  export let address: string;
  export let tokenID: string;
  /////////////////////////////////////////////////

  let nftPrice: BigNumber;
  let collectionApproved: boolean = false;

  let tokenPriceSetting: number;
  let tokenSetPriceTxHash: string;
  let tokenSetPriceError: string;

  const _tokenSetPriceError = (err: string): void => {
    tokenSetPriceError = err;
    console.error(tokenSetPriceError);
    tokenPriceSetting = 0;
  };

  // TOKEN PRICE SETTING STATES
  //
  //  STATE 0 Start
  //    |
  //  STATE 1
  //  Confirm set price
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
  const S4_PRICE_SETTED = 4;

  const tokenSetPriceInit = async () => {
    tokenSetPriceTxHash = null;

    tokenPriceSetting = S1_CONFIRM;
  };

  let nft: Readable<NftType>;
  let onSale: boolean;
  let currentPrice: BigNumber;

  onMount(() => {
    nft = nftStore.getOneStore(chainId, address, tokenID);

    currentPrice = BigNumber.from($nft.price || 0);
    nftPrice = currentPrice;
    onSale = currentPrice.gt(0);

    const approvedForAll = $nft.collection?.approvedForAll;
    collectionApproved = approvedForAll.size > 0 ? approvedForAll.get($metamaskAccount) : false;

    tokenSetPriceInit();
  });

  const setPriceConfirm = async (price: BigNumber) => {
    if (price.eq(currentPrice)) return _tokenSetPriceError("Price unchanged !");

    const tokenSetPriceTxRespYield = setTokenPrice($nft.chainId, $nft.address, $nft.tokenID, $metamaskSigner, price);

    tokenPriceSetting = S2_SIGN_TX;

    const tokenSetPriceTxResp = (await tokenSetPriceTxRespYield.next()).value;
    tokenSetPriceTxHash = tokenSetPriceTxResp?.hash;
    if (!tokenSetPriceTxHash)
      return _tokenSetPriceError(`ERROR while sending transaction... ${JSON.stringify(tokenSetPriceTxResp, null, 2)}`);

    explorerTxLog($nft.chainId, tokenSetPriceTxResp);
    tokenPriceSetting = S3_WAIT_TX;

    const txReceipt = (await tokenSetPriceTxRespYield.next()).value;

    if (!Boolean(txReceipt.status)) return _tokenSetPriceError(`ERROR returned by transaction ${txReceipt}`);

    tokenPriceSetting = S4_PRICE_SETTED;

    await nftStore.refreshOne($nft.chainId, $nft.address, $nft.tokenID).catch(console.error);
  };
</script>

<div class="titre">
  <i class="fas fa-plus fa-left c-green" />SELL ({tokenPriceSetting})
</div>

{#if tokenPriceSetting == S1_CONFIRM}
  <div class="section">
    <p><i class="fas fa-angle-right" /> List item #{$nft.tokenID} for sale using AutoMarket smartcontract</p>
  </div>

  <div class="section">
    <InputPrice chainId={$nft.chainId} bind:price={nftPrice} />
  </div>

  <div class="section">
    <IncomesPreview chainId={$nft.chainId} nftOwner={$nft.owner} nftRoyalty={$nft.royalty} {nftPrice} />
  </div>

  {#if !collectionApproved}
    <div class="section">
      <div class="form-field kre-warning-msg">
        <p>
          By completing this listing you allow this AutoMarket collection to manage the exchange of your NFTs
          <a class="link" href={explorerCollectionUrl($nft.chainId, $nft.address)} title={$nft.address} target="_blank">
            {$nft.address}
          </a>
        </p>
      </div>
    </div>
  {/if}

  <div class="txtright">
    {#if onSale}
      <button class="btn btn-default  btn-remove" type="submit" on:click={() => setPriceConfirm(constants.Zero)}
        >Remove from Sale</button
      >
    {/if}

    <button class="btn btn-default btn-sell" type="submit" on:click={() => setPriceConfirm(nftPrice)}>
      {#if onSale}
        Modify Listing
      {:else}
        Complete Listing
      {/if}
    </button>
  </div>
{/if}

{#if tokenPriceSetting >= S2_SIGN_TX && tokenPriceSetting < S4_PRICE_SETTED}
  <div class="titre">
    <p>
      <i class="fas fa-sync fa-left c-green" />
      {#if onSale}
        Removing NFT from sale...
      {:else}
        Setting NFT price to {formatEther(nftPrice)} {getCurrency($nft.chainId)}...
      {/if}
    </p>
  </div>
{/if}

{#if tokenPriceSetting == S2_SIGN_TX}
  <div class="section">Please, sign the transaction</div>
{:else if tokenPriceSetting == S3_WAIT_TX}
  <div class="section">Wait till completed, it may take one minute or more.</div>
{/if}

{#if tokenPriceSetting == S4_PRICE_SETTED}
  <div class="titre">
    <p>
      <i class="fas fa-check fa-left c-green" />
      {#if onSale}
        NFT #{$nft.tokenID} removed from sale...
      {:else}
        NFT #{$nft.tokenID} Price setted to {formatEther(nftPrice)} {getCurrency($nft.chainId)} !
      {/if}
    </p>
  </div>

  <div class="section">
    <IncomesPreview chainId={$nft.chainId} nftOwner={$nft.owner} nftRoyalty={$nft.royalty} {nftPrice} />
  </div>
{/if}

{#if tokenSetPriceTxHash}
  <div class="flex">
    <a class="link" href={explorerTxUrl($nft.chainId, tokenSetPriceTxHash)} target="_blank"
      >{textShort(tokenSetPriceTxHash)}</a
    >
  </div>
{/if}

{#if tokenSetPriceError}
  <div class="section">
    <div class="form-field kre-warning-msg">
      <p><i class="fas fa-exclamation-triangle fa-left c-red" />{tokenSetPriceError}</p>
    </div>
  </div>
{/if}

<style>
  .btn-remove {
    background-color: red;
    opacity: 0.3;
  }

  .btn-remove:hover {
    opacity: 1;
  }
</style>
