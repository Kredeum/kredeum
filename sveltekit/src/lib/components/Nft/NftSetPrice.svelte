<script lang="ts">
  import { BigNumber, constants } from "ethers";

  import { nftCollectionPrice, nftPriceValid, nftRoyaltyAndFeeMinimum } from "@kredeum/common/lib/nft/nft";

  import {
    displayEther,
    explorerCollectionUrl,
    explorerTxLog,
    explorerTxUrl,
    textShort
  } from "@kredeum/common/lib/common/config";

  import { getMax } from "@kredeum/common/lib/nft/nft-automarket-get";
  import { setTokenPrice } from "@kredeum/common/lib/nft/nft-automarket-set";

  import { metamaskSignerAddress } from "@kredeum/sveltekit/src/lib/stores/metamask";
  import { nftStoreAndRefresh, nftStoreRefresh } from "@kredeum/sveltekit/src/lib/stores/nft/nft";

  import InputPrice from "../Input/InputPrice.svelte";
  import NftIncomes from "./NftIncomes.svelte";
  import { nftPrice, nftOnSale, nftCollectionApproved } from "@kredeum/common/lib/nft/nft";
  import { onMount } from "svelte";
  import { networks } from "@kredeum/common/lib/common/networks";

  /////////////////////////////////////////////////
  //  <NftSetPrice {chainId} {address} {tokenID} />
  // Set  NFT Price
  /////////////////////////////////////////////////
  export let chainId: number;
  export let address: string;
  export let tokenID: string;
  ///////////////////////////////////////////////////////////
  $: nft = nftStoreAndRefresh(chainId, address, tokenID);
  /////////////////////////////////////////////////////////////

  let collectionApproved: boolean = false;

  let tokenSettingPrice: number;
  let tokenSetPriceTxHash = "";
  let tokenSetPriceError: string;
  let removingFromSale = false;
  let inputPriceError: string;

  const tokenSetPriceInit = async () => {
    tokenSetPriceTxHash = "";
    removingFromSale = false;
    tokenSettingPrice = S1_CONFIRM;
  };

  const _tokenSetPriceError = (err: string): void => {
    tokenSetPriceError = err;
    console.error(tokenSetPriceError);
    tokenSettingPrice = S1_CONFIRM;
  };

  const _inputPriceError = (err: string): void => {
    inputPriceError = err;
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

  let priceInput = BigNumber.from(0);

  const handleNft = async (refresh = false) => {
    if (refresh) await nftStoreRefresh(chainId, address, tokenID);

    priceInput = getMax(nftPrice($nft) || nftCollectionPrice($nft), nftRoyaltyAndFeeMinimum($nft));
    collectionApproved = nftCollectionApproved($nft, $metamaskSignerAddress);
  };
  ///////////////////////////////////////////////////////////

  $: priceInput && minimalPriceHandler();
  const minimalPriceHandler = (): void => {
    if (!nftPriceValid($nft, priceInput)) {
      const minPrice = nftRoyaltyAndFeeMinimum($nft);
      inputPriceError = `Price too low, minimum price should be set above ${displayEther(chainId, minPrice)}`;
    } else {
      inputPriceError = "";
    }
  };

  const tokenSetPriceConfirm = async (price: BigNumber): Promise<void> => {
    if (price.eq(nftPrice($nft))) return _inputPriceError("Price unchanged !");

    if (!nftPriceValid($nft, price)) return _inputPriceError("Price too low !");

    await tokenSetPriceTx(price);
  };

  const tokenSetPriceTx = async (price: BigNumber): Promise<void> => {
    const tokenSetPriceTxRespYield = setTokenPrice(chainId, $nft.address, tokenID, price);

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
    // console.log("tokenSetPriceTx S3", tokenSettingPrice);

    const txReceipt = (await tokenSetPriceTxRespYield.next()).value;

    if (!Boolean(txReceipt.status)) return _tokenSetPriceError(`ERROR returned by transaction ${txReceipt}`);

    tokenSettingPrice = S4_PRICE_SETTED;
    // console.log("tokenSetPriceTx S4", tokenSettingPrice);

    nftStoreRefresh(chainId, address, tokenID);
  };

  const removeFromSale = async (): Promise<void> => {
    removingFromSale = true;
    await tokenSetPriceTx(constants.Zero);
  };

  onMount(async () => {
    tokenSetPriceInit();
    await handleNft();
  });
</script>

<div class="titre">
  <i class="fas fa-plus fa-left c-green" />SELL -
  {#if nftPrice($nft).eq(0)}Set{:else}Modify{/if} Price
</div>

{#if tokenSettingPrice == S1_CONFIRM}
  <div class="section">
    <p>
      <i class="fas fa-angle-right" /> List item #{tokenID} for sale using AutoMarket smartcontract
    </p>
  </div>

  <div class="section">
    <InputPrice {chainId} bind:price={priceInput} error={inputPriceError} />
  </div>

  <div class="section">
    <NftIncomes nft={$nft} {priceInput} />
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

  {#if networks.getOpenSea(chainId)}
    <div class="kre-modal-block">
      <div class="txt-left">
        <a
          href={networks.getOpenSeaUrl(chainId, { chainId, address, tokenID })}
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

    <button class="btn btn-default btn-sell" type="submit" on:click={() => tokenSetPriceConfirm(priceInput)}>
      {#if nftOnSale($nft)}
        Modify Listing
      {:else}
        Complete Listing
      {/if}
    </button>
  </div>
{/if}

{#if tokenSettingPrice == S2_SIGN_TX || tokenSettingPrice == S3_WAIT_TX}
  <div class="titre">
    <p>
      <i class="fas fa-sync fa-left c-green" />
      {#if nftOnSale($nft)}
        {#if removingFromSale}
          Removing NFT from sale...
        {:else}
          Modifying NFT price to {displayEther(chainId, priceInput)}...
        {/if}
      {:else}
        Setting NFT price to {displayEther(chainId, priceInput)}...
      {/if}
    </p>
  </div>
{/if}

{#if tokenSettingPrice == S2_SIGN_TX}
  <div class="section">Please, sign the transaction</div>
{/if}
{#if tokenSettingPrice == S3_WAIT_TX}
  <div class="section">Wait till completed, it may take one minute or more.</div>
{/if}

{#if tokenSettingPrice == S4_PRICE_SETTED}
  <div class="titre">
    <p>
      <i class="fas fa-check fa-left c-green" />
      {#if removingFromSale}
        NFT #{tokenID} removed from sale...
      {:else}
        NFT #{tokenID} Price modified to {displayEther(chainId, nftPrice($nft))}
      {/if}
    </p>
  </div>
  {#if !removingFromSale}
    <div class="section">
      <NftIncomes nft={$nft} priceInput={null} />
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
