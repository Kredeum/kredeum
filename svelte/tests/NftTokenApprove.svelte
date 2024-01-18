<script lang="ts">
  import { onMount } from "svelte";

  import { explorerTxLog, explorerTxUrl, textShort } from "@lib/common/config";

  import { getApproved, isApprovedForAll } from "@lib/nft/nft-automarket-get";
  import { setTokenApprove } from "@lib/nft/nft-automarket-set";

  /////////////////////////////////////////////////
  //  <NftTokenApprove {chainId} {address} {tokenID} {nftPrice} />
  // Set Approval parameter for NFT
  /////////////////////////////////////////////////
  export let chainId: number;
  export let address: string;
  export let tokenID: string;
  /////////////////////////////////////////////////

  let tokenApproving: number;
  let tokenApproveTxHash: string;
  let tokenApproveError: string;

  const _tokenApproveError = (err: string): void => {
    tokenApproveError = err;
    console.error(tokenApproveError);
    tokenApproving = 0;
  };

  // TOKEN APPROVING STATES
  //
  //  STATE 0 Start
  //    |
  //  STATE 1
  //  Confirm Approve
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
  const S4_APPROVEDED = 4;

  const tokenApproveInit = async () => {
    tokenApproveTxHash = null;

    const approved = await getApproved(chainId, address, tokenID);
    const approvedForAll = await isApprovedForAll(chainId, address);

    tokenApproving = approved || approvedForAll ? S4_APPROVEDED : S1_CONFIRM;
  };

  onMount(() => {
    tokenApproveInit();
  });

  const approveConfirm = async () => {
    const tokenApproveTxRespYield = setTokenApprove(chainId, address, tokenID);

    tokenApproving = S2_SIGN_TX;

    const tokenApproveTxResp = (await tokenApproveTxRespYield.next()).value;
    tokenApproveTxHash = tokenApproveTxResp?.hash;
    if (!tokenApproveTxHash)
      return _tokenApproveError(`ERROR while sending transaction... ${JSON.stringify(tokenApproveTxResp, null, 2)}`);

    explorerTxLog(chainId, tokenApproveTxResp);
    tokenApproving = S3_WAIT_TX;

    const txReceipt = (await tokenApproveTxRespYield.next()).value;

    if (!Boolean(txReceipt.status)) return _tokenApproveError(`ERROR returned by transaction ${txReceipt}`);

    tokenApproving = S4_APPROVEDED;
  };
</script>

{#if tokenApproving == S1_CONFIRM}
  <div class="titre">
    <i class="fas fa-angle-right" /> You have to approuve this NFT #{tokenID} to be sellable
  </div>
  <div class="section">Do you want to approve this Nft</div>
  <div class="txtright">
    <button class="btn btn-default btn-sell" type="submit" on:click={() => approveConfirm()}>Approve</button>
  </div>
{/if}
{#if tokenApproving >= S2_SIGN_TX && tokenApproving < S4_APPROVEDED}
  <div class="titre">
    <i class="fas fa-sync fa-left c-green" />Approving NFT #{tokenID}...
  </div>
{/if}

{#if tokenApproving == S2_SIGN_TX}
  <div class="section">Please, sign the transaction</div>
{:else if tokenApproving == S3_WAIT_TX}
  <div class="section">Wait till completed, it may take one minute or more.</div>
{/if}

{#if tokenApproving == S4_APPROVEDED}
  <div>
    <div class="titre">
      <i class="fas fa-check fa-left c-green" />
      Token #{tokenID} approved for sale !
    </div>
  </div>
{/if}

{#if tokenApproveTxHash}
  <div class="flex">
    <a class="link" href={explorerTxUrl(chainId, tokenApproveTxHash)} target="_blank" rel="noreferrer"
      >{textShort(tokenApproveTxHash)}</a
    >
  </div>
{/if}

{#if tokenApproveError}
  <div class="section">
    <div class="form-field kre-warning-msg">
      <p><i class="fas fa-exclamation-triangle fa-left c-red" />{tokenApproveError}</p>
    </div>
  </div>
{/if}
