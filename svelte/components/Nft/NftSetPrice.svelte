<script lang="ts">
  import { ethers } from "ethers";

  import { onMount } from "svelte";

  import { metamaskSigner } from "@main/metamask";
  import { explorerTxLog, explorerTxUrl, sleep, textShort } from "@lib/common/kconfig";

  import { nftStore } from "@stores/nft/nft";
  import { setTokenPrice } from "@lib/nft/kautomarket";

  import InputEther from "../Global/InputEther.svelte";

  /////////////////////////////////////////////////
  //  <NftTokenApprove {chainId} {address} {tokenID} {nftPrice} />
  // Set Approval parameter for NFT
  /////////////////////////////////////////////////
  export let chainId: number;
  export let address: string;
  export let tokenID: string;
  export let nftPrice: string;
  /////////////////////////////////////////////////

  let tokenNewPrice: string;

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

  onMount(() => {
    tokenSetPriceInit();
  });

  const setPriceConfirm = async () => {
    const tokenSetPriceTxRespYield = await setTokenPrice(chainId, address, tokenID, tokenNewPrice, $metamaskSigner);

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

    await nftStore.refreshOne(chainId, address, tokenID).catch(console.error);
  };
</script>

{#if tokenPriceSetting == S1_CONFIRM}
  <div class="titre">
    <p><i class="fas fa-angle-right" /> Set this NFT #{tokenID} price</p>
  </div>
  <div class="section">
    From {ethers.utils.formatEther(nftPrice)} Eth to
    <InputEther bind:etherParsed={tokenNewPrice} />
  </div>
  <div class="txtright">
    <button class="btn btn-default btn-sell" type="submit" on:click={() => setPriceConfirm()}>Set price</button>
  </div>
{/if}

{#if tokenPriceSetting >= S2_SIGN_TX && tokenPriceSetting < S4_PRICE_SETTED}
  <div class="titre">
    <p>
      <i class="fas fa-sync fa-left c-green" />Setting NFT price to {ethers.utils.formatEther(tokenNewPrice)}
      Eth...
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
    <p><i class="fas fa-check fa-left c-green" /> NFT #{tokenID} Price setted !</p>
  </div>
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
