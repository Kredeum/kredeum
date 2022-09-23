<script lang="ts">
  import { Readable } from "svelte/store";
  import { NftType } from "@lib/common/ktypes";

  import { BigNumber, utils } from "ethers";

  import { onMount } from "svelte";

  import { metamaskChainId, metamaskSigner, metamaskAccount } from "@main/metamask";
  import { explorerCollectionUrl, explorerTxLog, explorerTxUrl, getCurrency, textShort } from "@lib/common/kconfig";

  import { nftStore } from "@stores/nft/nft";
  import { setTokenPrice } from "@lib/nft/kautomarket";

  import InputEther from "../Global/InputEther.svelte";
  import IncomesPreview from "../Global/IncomesPreview.svelte";
  import { collectionStore } from "@stores/collection/collection";

  /////////////////////////////////////////////////
  //  <NftSetPrice {chainId} {address} {tokenID} />
  // Set  NFT Price
  /////////////////////////////////////////////////
  export let chainId: number;
  export let address: string;
  export let tokenID: string;
  /////////////////////////////////////////////////

  let collectionApproved: boolean = false;
  let tokenNewPrice: string;

  let tokenPriceSetting: number;
  let tokenSetPriceTxHash: string;
  let tokenSetPriceError: string;

  let nft: Readable<NftType>;

  // HANDLE CHANGE : on truthy chainId and address, and whatever account
  $: chainId && address && tokenID && $metamaskChainId && handleChange();
  const handleChange = async (): Promise<void> => {
    // console.log(`NFTDETAIL CHANGE #${i++} ${nftKey(chainId, address, tokenID)}`);

    // STATE VIEW : sync get Nft
    nft = nftStore.getOneStore(chainId, address, tokenID);
    // if (!$nft.collection?.supports) {
    //   await nftStore.refreshSubList(chainId, address, $nft.owner);
    // }

    // ACTION : async refresh Nft
    await nftStore.refreshOne(chainId, address, tokenID).catch(console.error);
  };

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

    if ($nft?.price?.gt(0)) tokenNewPrice = utils.formatEther($nft?.price);
  };

  // $: console.log(collectionApproved);

  $: if (nft) {
    collectionApproved = [...$nft.collection?.approvedForAll].filter((approved) => approved[0] === $metamaskAccount)[0]
      ? [...$nft.collection?.approvedForAll].filter((approved) => approved[0] === $metamaskAccount)[0][1]
      : false;
  }

  onMount(() => {
    tokenSetPriceInit();
  });

  const setPriceConfirm = async () => {
    const tokenSetPriceTxRespYield = setTokenPrice(
      chainId,
      address,
      tokenID,
      $metamaskSigner,
      utils.parseEther(tokenNewPrice)
    );

    tokenPriceSetting = S2_SIGN_TX;

    const tokenSetPriceTxResp = (await tokenSetPriceTxRespYield.next()).value;
    tokenSetPriceTxHash = tokenSetPriceTxResp?.hash;
    if (!tokenSetPriceTxHash)
      return _tokenSetPriceError(`ERROR while sending transaction... ${JSON.stringify(tokenSetPriceTxResp, null, 2)}`);

    explorerTxLog(chainId, tokenSetPriceTxResp);
    tokenPriceSetting = S3_WAIT_TX;

    const txReceipt = (await tokenSetPriceTxRespYield.next()).value;

    if (!Boolean(txReceipt.status)) return _tokenSetPriceError(`ERROR returned by transaction ${txReceipt}`);

    tokenPriceSetting = S4_PRICE_SETTED;

    collectionStore.refreshOne(chainId, address, $metamaskAccount).catch(console.error);
    await nftStore.refreshSubList(chainId, address, $metamaskAccount);
    await nftStore.refreshOne(chainId, address, tokenID).catch(console.error);
  };

  const setPriceZeroConfirm = async () => {
    tokenNewPrice = "0";
    setPriceConfirm();
  };
</script>

{#if tokenPriceSetting == S1_CONFIRM}
  <div class="titre">
    <p><i class="fas fa-angle-right" /> List item #{tokenID} for sale using AutoMarket smartcontract</p>
  </div>

  <div class="section">
    <InputEther {chainId} bind:inputPrice={tokenNewPrice} />
  </div>

  <IncomesPreview
    {chainId}
    {address}
    {tokenID}
    price={tokenNewPrice ? utils.parseEther(tokenNewPrice) : BigNumber.from(0)}
  />

  {#if !collectionApproved}
    <div class="section">
      <div class="form-field kre-warning-msg">
        <p>
          By completing this listing you allow this AutoMarket collection to manage the exchange of your NFTs
          <a class="link" href={explorerCollectionUrl(chainId, address)} title={address} target="_blank">
            {address}
          </a>
        </p>
      </div>
    </div>
  {/if}

  <div class="txtright">
    <button class="btn btn-default btn-sell" type="submit" on:click={() => setPriceConfirm()}>Complete Listing</button>
    <button
      class="btn btn-default {Number(tokenNewPrice) == 0 && $nft.price?.gt(0) ? 'btn-remove-red' : 'btn-remove'}"
      type="submit"
      on:click={() => setPriceZeroConfirm()}>Remove</button
    >
  </div>
{/if}

{#if tokenPriceSetting >= S2_SIGN_TX && tokenPriceSetting < S4_PRICE_SETTED}
  <div class="titre">
    <p>
      <i class="fas fa-sync fa-left c-green" />Setting NFT price to {tokenNewPrice}
      {getCurrency(chainId)}...
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
      <i class="fas fa-check fa-left c-green" /> NFT #{tokenID} Price setted to {tokenNewPrice}
      {getCurrency(chainId)} !
    </p>
  </div>
  <IncomesPreview {chainId} {address} {tokenID} price={tokenNewPrice ? utils.parseEther(tokenNewPrice) : $nft?.price} />
{/if}

{#if tokenSetPriceTxHash}
  <div class="flex">
    <a class="link" href={explorerTxUrl(chainId, tokenSetPriceTxHash)} target="_blank"
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
  .btn-remove-red {
    opacity: 1;
    background-color: red;
  }

  .btn-remove {
    background-color: red;
    opacity: 0.3;
  }

  .btn-remove:hover {
    opacity: 1;
  }
</style>
