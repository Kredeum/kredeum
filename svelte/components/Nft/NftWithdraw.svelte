<script lang="ts">
  import { NftType } from "@lib/common/ktypes";

  import { BigNumber, ethers, utils } from "ethers";

  import { onMount } from "svelte";

  import { config, getNetwork } from "@lib/common/kconfig";
  // import config from "@config/config.json";

  import { metamaskSigner } from "@main/metamask";
  import { explorerTxLog, explorerTxUrl, textShort } from "@lib/common/kconfig";

  import { nftStore } from "@stores/nft/nft";
  import { isApprovedForAll, setTokenPrice } from "@lib/nft/kautomarket";

  import InputEther from "../Global/InputEther.svelte";
  import IncomesPreview from "../Global/IncomesPreview.svelte";
  import { parseEther } from "ethers/lib/utils";

  /////////////////////////////////////////////////
  //  <NftTokenApprove {chainId} {address} {tokenID} {nftPrice} />
  // Set Approval parameter for NFT
  /////////////////////////////////////////////////
  export let chainId: number;
  export let address: string;
  export let tokenID: string;
  export let nft: NftType;
  /////////////////////////////////////////////////

  let tokenWithdrawing: number;
  let tokenWithdrawTxHash: string;
  let tokenWithdrawError: string;

  $: if (nft.price) {
    tokenWithdrawInit();
  }

  const _tokenSetPriceError = (err: string): void => {
    tokenWithdrawError = err;
    console.error(tokenWithdrawError);
    tokenWithdrawing = 0;
  };

  // TOKEN WITHDRAWING STATES
  //
  //  STATE 0 Start
  //    |
  //  STATE 1
  //  Confirm Withdraw
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
  const S4_WITHDRAWED = 4;

  const tokenWithdrawInit = async () => {
    tokenWithdrawTxHash = null;

    tokenWithdrawing = S1_CONFIRM;
  };

  onMount(() => {
    tokenWithdrawInit();
  });

  const withdrawConfirm = async () => {
    const tokenSetPriceTxRespYield = setTokenPrice(chainId, address, tokenID, "0", $metamaskSigner, 2);

    tokenWithdrawing = S2_SIGN_TX;

    const tokenSetPriceTxResp = (await tokenSetPriceTxRespYield.next()).value;
    tokenWithdrawTxHash = tokenSetPriceTxResp?.hash;
    if (!tokenWithdrawTxHash)
      return _tokenSetPriceError(`ERROR while sending transaction... ${JSON.stringify(tokenSetPriceTxResp, null, 2)}`);

    explorerTxLog(chainId, tokenSetPriceTxResp);
    tokenWithdrawing = S3_WAIT_TX;

    const txReceipt = (await tokenSetPriceTxRespYield.next()).value;

    if (!Boolean(txReceipt.status)) return _tokenSetPriceError(`ERROR returned by transaction ${txReceipt}`);

    tokenWithdrawing = S4_WITHDRAWED;

    await nftStore.refreshOne(chainId, address, tokenID).catch(console.error);
  };
</script>

{#if Number(nft.price) > 0}
  <div class="kre-modal-block">
    {#if tokenWithdrawing == S1_CONFIRM}
      <div class="titre">
        <p>
          <i class="fas fa-angle-right" /> Withdraw this Nft #{tokenID} from sale with Kredeum AutoMarket smartcontract
        </p>
      </div>

      <div class="txtright">
        <button class="btn btn-default btn-sell" type="submit" on:click={() => withdrawConfirm()}>Remove</button>
      </div>
    {/if}

    {#if tokenWithdrawing >= S2_SIGN_TX && tokenWithdrawing < S4_WITHDRAWED}
      <div class="titre">
        <p>
          <i class="fas fa-sync fa-left c-green" />Withdrawing this Nft #{tokenID} from sale
        </p>
      </div>
    {/if}

    {#if tokenWithdrawing == S2_SIGN_TX}
      <div class="section">Please, sign the transaction</div>
    {:else if tokenWithdrawing == S3_WAIT_TX}
      <div class="section">Wait till completed, it may take one minute or more.</div>
    {/if}

    {#if tokenWithdrawing == S4_WITHDRAWED}
      <div class="titre">
        <p><i class="fas fa-check fa-left c-green" /> NFT #{tokenID} Withdrawed from sale !</p>
      </div>
    {/if}

    {#if tokenWithdrawTxHash}
      <div class="flex">
        <a class="link" href={explorerTxUrl(chainId, tokenWithdrawTxHash)} target="_blank"
          >{textShort(tokenWithdrawTxHash)}</a
        >
      </div>
    {/if}

    {#if tokenWithdrawError}
      <div class="section">
        <div class="form-field kre-warning-msg">
          <p><i class="fas fa-exclamation-triangle fa-left c-red" />{tokenWithdrawError}</p>
        </div>
      </div>
    {/if}
  </div>
{/if}
