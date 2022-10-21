<script lang="ts">
  import type { Readable } from "svelte/store";
  import { onMount } from "svelte";
  import { BigNumber, BigNumberish, constants } from "ethers";
  import { formatEther } from "ethers/lib/utils";

  import type { NftType } from "@lib/common/ktypes";
  import { explorerCollectionUrl, explorerTxLog, explorerTxUrl, getCurrency, textShort } from "@lib/common/kconfig";
  import { setTokenPrice, isValidPrice, getMinPrice } from "@lib/nft/kautomarket";

  import { metamaskSigner, metamaskAccount } from "@main/metamask";
  import { nftStore } from "@stores/nft/nft";

  import InputPrice from "../InputFields/InputPrice.svelte";
  import IncomesPreview from "../Global/IncomesPreview.svelte";

  /////////////////////////////////////////////////
  //  <NftSetPrice {chainId} {address} {tokenID} />
  // Set  NFT Price
  /////////////////////////////////////////////////
  export let chainId: number;
  export let address: string;
  export let tokenID: string;
  /////////////////////////////////////////////////

  let collectionApproved: boolean = false;

  let tokenSettingPrice: number;
  let tokenSetPriceTxHash: string;
  let tokenSetPriceError: string;

  let inputError: string;

  const _tokenSetPriceError = (err: string): void => {
    tokenSetPriceError = err;
    console.error(tokenSetPriceError);
    tokenSettingPrice = 0;
  };

  const _inputPriceError = (err: string): void => {
    inputError = err;
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

    tokenSettingPrice = S1_CONFIRM;
  };

  let nft: Readable<NftType>;
  let inputPrice: BigNumber;

  $: nftPrice = BigNumber.from($nft?.price || 0);
  $: nftOwner = String($nft?.owner || "");
  $: nftRoyalty = $nft?.royalty || {};
  $: nftRoyaltyMinimum = BigNumber.from(nftRoyalty?.minimum || 0);

  $: if (nftRoyaltyMinimum) inputPrice = getMinPrice(nftRoyaltyMinimum).mul(2);

  $: onSale = nftPrice.gt(0);

  $: console.log("input price", String(inputPrice));

  $: minimalPriceHandler(inputPrice);
  const minimalPriceHandler = (inputPrice: BigNumber): void => {
    inputError = isValidPrice(inputPrice, nftRoyaltyMinimum)
      ? ""
      : `Price to low compared to minimum royalty!
         Set a price at least double of minimal royalty, i.e. ${displayEther(nftRoyaltyMinimum.mul(2))}`;
  };

  const displayEther = (price: BigNumberish): string => `${formatEther(price)} ${getCurrency(chainId)}`;

  onMount(() => {
    nft = nftStore.getOneStore(chainId, address, tokenID);
    inputPrice = BigNumber.from($nft?.price || 0);

    const approvedForAll = $nft?.collection?.approvedForAll;
    collectionApproved = approvedForAll?.size > 0 ? approvedForAll.get($metamaskAccount) : false;

    tokenSetPriceInit();
  });

  const tokenSetPriceConfirm = async (price: BigNumber) => {
    console.log("tokenSetPriceConfirm ~ tokenSetPriceConfirm", displayEther(price));

    if (price.eq(nftPrice)) return _inputPriceError("Price unchanged !");

    if (!isValidPrice(price, nftRoyaltyMinimum)) return _inputPriceError("Price too low !");

    const tokenSetPriceTxRespYield = setTokenPrice(chainId, $nft.address, $nft.tokenID, $metamaskSigner, price);

    tokenSettingPrice = S2_SIGN_TX;

    const tokenSetPriceTxResp = (await tokenSetPriceTxRespYield.next()).value;
    tokenSetPriceTxHash = tokenSetPriceTxResp?.hash;
    if (!tokenSetPriceTxHash)
      return _tokenSetPriceError(`ERROR while sending transaction... ${JSON.stringify(tokenSetPriceTxResp, null, 2)}`);

    explorerTxLog(chainId, tokenSetPriceTxResp);
    tokenSettingPrice = S3_WAIT_TX;

    const txReceipt = (await tokenSetPriceTxRespYield.next()).value;

    if (!Boolean(txReceipt.status)) return _tokenSetPriceError(`ERROR returned by transaction ${txReceipt}`);

    tokenSettingPrice = S4_PRICE_SETTED;

    await nftStore.refreshOne(chainId, $nft.address, $nft.tokenID).catch(console.error);
  };
</script>

<div class="titre">
  <i class="fas fa-plus fa-left c-green" />SELL ({tokenSettingPrice})
</div>

{#if tokenSettingPrice == S1_CONFIRM}
  <div class="section">
    <p><i class="fas fa-angle-right" /> List item #{$nft.tokenID} for sale using AutoMarket smartcontract</p>
  </div>

  <div class="section">
    <InputPrice {chainId} bind:price={inputPrice} {inputError} />
  </div>

  <div class="section">
    <IncomesPreview {chainId} {nftOwner} nftPrice={inputPrice} {nftRoyalty} />
  </div>

  {#if !collectionApproved}
    <div class="section">
      <div class="form-field kre-warning-msg">
        <p>
          By completing this listing you allow this AutoMarket collection to manage the exchange of your NFTs
          <a
            class="link"
            href={explorerCollectionUrl(chainId, $nft.address)}
            title={$nft.address}
            target="_blank"
            rel="noreferrer"
          >
            {$nft.address}
          </a>
        </p>
      </div>
    </div>
  {/if}

  <div class="txtright">
    {#if onSale}
      <button class="btn btn-default btn-remove" type="submit" on:click={() => tokenSetPriceConfirm(constants.Zero)}
        >Remove from Sale</button
      >
    {/if}

    <button class="btn btn-default btn-sell" type="submit" on:click={() => tokenSetPriceConfirm(inputPrice)}>
      {#if onSale}
        Modify Listing
      {:else}
        Complete Listing
      {/if}
    </button>
  </div>
{/if}

{#if tokenSettingPrice >= S2_SIGN_TX && tokenSettingPrice < S4_PRICE_SETTED}
  <div class="titre">
    <p>
      <i class="fas fa-sync fa-left c-green" />
      {#if onSale}
        {#if inputPrice.eq(0)}
          Removing NFT from sale...
        {:else}
          Modifying NFT price to {displayEther(inputPrice)}...
        {/if}
      {:else}
        Setting NFT price to {displayEther(inputPrice)}...
      {/if}
    </p>
  </div>
{/if}

{#if tokenSettingPrice == S2_SIGN_TX}
  <div class="section">Please, sign the transaction</div>
{:else if tokenSettingPrice == S3_WAIT_TX}
  <div class="section">Wait till completed, it may take one minute or more.</div>
{/if}

{#if tokenSettingPrice == S4_PRICE_SETTED}
  <div class="titre">
    <p>
      <i class="fas fa-check fa-left c-green" />
      {#if onSale}
        {#if nftPrice.eq(0)}
          NFT #{$nft.tokenID} removed from sale...
        {:else}
          NFT #{$nft.tokenID} Price modified to {displayEther(nftPrice)}
        {/if}
      {:else}
        NFT #{$nft.tokenID} Price setted to {displayEther(nftPrice)}
      {/if}
    </p>
  </div>

  {#if nftPrice.gt(0)}
    <div class="section">
      <IncomesPreview {chainId} {nftOwner} {nftPrice} {nftRoyalty} />
    </div>
  {/if}
{/if}

{#if tokenSetPriceTxHash}
  <div class="flex">
    <a class="link" href={explorerTxUrl(chainId, tokenSetPriceTxHash)} target="_blank" rel="noreferrer"
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
