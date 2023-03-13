<script lang="ts">
  import type { Readable } from "svelte/store";

  import type { BigNumberish } from "ethers";
  import { BigNumber, constants } from "ethers";
  import { formatEther } from "ethers/lib/utils";

  import type { NftType } from "@lib/common/types";
  import {
    explorerCollectionUrl,
    explorerTxLog,
    explorerTxUrl,
    getCurrency,
    getOpenSea,
    nftOpenSeaUrl,
    textShort
  } from "@lib/common/config";

  import { isValidPrice, reduceDecimals } from "@lib/nft/nft-automarket-get";
  import { setTokenPrice } from "@lib/nft/nft-automarket-set";

  import { metamaskSignerAddress } from "@main/metamask";
  import { nftStore } from "@stores/nft/nft";

  import InputPrice from "../Input/InputPrice.svelte";
  import NftIncomes from "./NftIncomes.svelte";
  import { nftPrice, nftRoyaltyMinimum, nftOnSale, nftCollectionApproved } from "@helpers/nft";

  /////////////////////////////////////////////////
  //  <NftSetPrice {chainId} {address} {tokenID} />
  // Set  NFT Price
  /////////////////////////////////////////////////
  export let chainId: number;
  export let address: string;
  export let tokenID: string;
  ///////////////////////////////////////////////////////////
  let nft: Readable<NftType>;
  $: chainId && address && tokenID && handleNft();
  const handleNft = () => {
    nft = nftStore.getOne(chainId, address, tokenID);

    const nftMinimumPrice = nftRoyaltyMinimum($nft);
    inputPrice = nftPrice($nft).lt(nftMinimumPrice) ? nftMinimumPrice : nftPrice($nft);

    collectionApproved = nftCollectionApproved($nft, $metamaskSignerAddress);

    tokenSetPriceInit();
  };
  ///////////////////////////////////////////////////////////

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
    removingFromSale = false;

    tokenSettingPrice = S1_CONFIRM;
  };

  let inputPrice: BigNumber;

  $: console.log("input price", String(inputPrice));

  $: minimalPriceHandler(inputPrice);
  const minimalPriceHandler = (inputPrice: BigNumber): void => {
    inputError = isValidPrice(inputPrice, nftRoyaltyMinimum($nft))
      ? ""
      : `Price too low compared to minimum royalty!
         You should set a price at least double of minimal royalty, i.e. ${reduceDecimals(
           displayEther(nftRoyaltyMinimum($nft).mul(2))
         )}`;
  };

  let removingFromSale = false;

  const displayEther = (price: BigNumberish): string => `${formatEther(price)} ${getCurrency(chainId)}`;

  const tokenSetPriceConfirm = async (price: BigNumber): Promise<void> => {
    // console.log("tokenSetPriceConfirm ~ tokenSetPriceConfirm", displayEther(price));
    // console.log("tokenSetPriceConfirm ~ nftPrice($nft)", displayEther(nftPrice($nft)));
    // console.log("tokenSetPriceConfirm ~ $nft", $nft);

    if (price.eq(nftPrice($nft))) return _inputPriceError("Price unchanged !");

    if (!isValidPrice(price, nftRoyaltyMinimum($nft))) return _inputPriceError("Price too low !");

    await tokenSetPriceTx(price);
  };

  const tokenSetPriceTx = async (price: BigNumber): Promise<void> => {
    const tokenSetPriceTxRespYield = setTokenPrice(chainId, $nft.address, $nft.tokenID, price);

    tokenSettingPrice = S2_SIGN_TX;
    // console.log("tokenSetPriceTx ~ tokenSettingPrice", tokenSettingPrice);

    const tokenSetPriceTxResp = (await tokenSetPriceTxRespYield.next()).value;
    // console.log("tokenSetPriceTx ~ tokenSetPriceTxResp", tokenSetPriceTxResp);

    tokenSetPriceTxHash = tokenSetPriceTxResp?.hash;
    // console.log("tokenSetPriceTx ~ tokenSetPriceTxHash", tokenSetPriceTxHash);

    if (!tokenSetPriceTxHash)
      return _tokenSetPriceError(`ERROR while sending transaction... ${JSON.stringify(tokenSetPriceTxResp, null, 2)}`);

    explorerTxLog(chainId, tokenSetPriceTxResp);
    tokenSettingPrice = S3_WAIT_TX;

    const txReceipt = (await tokenSetPriceTxRespYield.next()).value;

    if (!Boolean(txReceipt.status)) return _tokenSetPriceError(`ERROR returned by transaction ${txReceipt}`);

    tokenSettingPrice = S4_PRICE_SETTED;

    await nftStore.refreshOne(chainId, $nft.address, $nft.tokenID).catch(console.error);
  };

  const removeFromSale = async (): Promise<void> => {
    removingFromSale = true;
    await tokenSetPriceTx(constants.Zero);
  };
</script>

<div class="titre">
  <i class="fas fa-plus fa-left c-green" />SELL -
  {#if nftPrice($nft).eq(0)}Set{:else}Modify{/if} Price
</div>

{#if tokenSettingPrice == S1_CONFIRM}
  <div class="section">
    <p><i class="fas fa-angle-right" /> List item #{$nft.tokenID} for sale using AutoMarket smartcontract</p>
  </div>

  <div class="section">
    <InputPrice {chainId} bind:price={inputPrice} {inputError} />
  </div>

  <div class="section">
    <NftIncomes nft={$nft} price={inputPrice} />
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

  {#if getOpenSea(chainId)}
    <div class="kre-modal-block">
      <div class="txt-left">
        <a
          href={nftOpenSeaUrl(chainId, { chainId, address, tokenID })}
          class="btn btn-second"
          title="Sell"
          target="_blank"
          rel="noreferrer"
        >
          View on OpenSea
        </a>
      </div>
    </div>
  {/if}

  <div class="txtright">
    {#if nftOnSale($nft)}
      <button class="btn btn-default btn-remove" type="submit" on:click={removeFromSale}>Remove from Sale</button>
    {/if}

    <button class="btn btn-default btn-sell" type="submit" on:click={() => tokenSetPriceConfirm(inputPrice)}>
      {#if nftOnSale($nft)}
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
      {#if nftOnSale($nft)}
        {#if removingFromSale}
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
      {#if removingFromSale}
        NFT #{$nft.tokenID} removed from sale...
      {:else}
        NFT #{$nft.tokenID} Price modified to {displayEther(nftPrice($nft))}
      {/if}
    </p>
  </div>

  {#if !removingFromSale}
    <div class="section">
      <NftIncomes nft={$nft} />
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

  .txt-left {
    float: left;
  }
</style>
