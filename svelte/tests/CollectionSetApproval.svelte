<script lang="ts">
  import { onMount } from "svelte";

  import { metamaskSigner, metamaskAccount, metamaskProvider } from "@main/metamask";
  import { explorerAddressUrl, explorerTxLog, explorerTxUrl, textShort } from "@lib/common/kconfig";

  import { isApprovedForAll, setCollectionApproval } from "@lib/nft/kautomarket";

  /////////////////////////////////////////////////
  //  <CollectionSetApproval {chainId} {address} />
  // Set Approval parameter for NFT
  /////////////////////////////////////////////////
  export let chainId: number;
  export let address: string;
  export let approval: boolean;
  /////////////////////////////////////////////////

  let approvedForAll = false;

  let collectionApproving: number;
  let collectionApproveTxHash: string;
  let collectionApproveError: string;

  const _collectionApproveError = (err: string): void => {
    collectionApproveError = err;
    console.error(collectionApproveError);
    collectionApproving = 0;
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

  const collectionApproveInit = async () => {
    collectionApproveTxHash = null;

    approvedForAll = await isApprovedForAll(chainId, address, $metamaskAccount, $metamaskProvider);

    collectionApproving = approvedForAll ? S4_APPROVEDED : S1_CONFIRM;
  };

  onMount(() => {
    collectionApproveInit();
  });

  const approveCollectionConfirm = async () => {
    const collectionApproveTxRespYield = setCollectionApproval(chainId, address, approval, $metamaskSigner);

    collectionApproving = S2_SIGN_TX;

    const collectionApproveTxResp = (await collectionApproveTxRespYield.next()).value;
    collectionApproveTxHash = collectionApproveTxResp?.hash;
    if (!collectionApproveTxHash)
      return _collectionApproveError(
        `ERROR while sending transaction... ${JSON.stringify(collectionApproveTxResp, null, 2)}`
      );

    explorerTxLog(chainId, collectionApproveTxResp);
    collectionApproving = S3_WAIT_TX;

    const txReceipt = (await collectionApproveTxRespYield.next()).value;

    if (!Boolean(txReceipt.status)) return _collectionApproveError(`ERROR returned by transaction ${txReceipt}`);

    collectionApproving = S4_APPROVEDED;
  };
</script>

{#if collectionApproving == S1_CONFIRM}
  <div class="titre">
    <p><i class="fas fa-angle-right" /> Do you want to approuve all NFTs of this collection to be sellable</p>
  </div>
  <div class="section">
    <a class="link" href={explorerAddressUrl(chainId, address)} target="_blank" rel="noreferrer">{address}</a>
  </div>
  <div class="txtright">
    <button class="btn btn-default btn-sell" type="submit" on:click={() => approveCollectionConfirm()}>Approve</button>
  </div>
{/if}
{#if collectionApproving >= S2_SIGN_TX && collectionApproving < S4_APPROVEDED}
  <div class="titre">
    <p><i class="fas fa-sync fa-left c-green" />Approving NFTs of the collection...</p>
  </div>
{/if}

{#if collectionApproving == S2_SIGN_TX}
  <div class="section">Please, sign the transaction</div>
{:else if collectionApproving == S3_WAIT_TX}
  <div class="section">Wait till completed, it may take one minute or more.</div>
{/if}

{#if collectionApproving == S4_APPROVEDED}
  <div>
    <div class="titre">
      <i class="fas fa-check fa-left c-green" />
      Nfts of collection
      <a class="link" href={explorerAddressUrl(chainId, address)} target="_blank" rel="noreferrer">{address}</a> approved
      for sale !
    </div>
  </div>
{/if}

{#if collectionApproveTxHash}
  <div class="flex">
    <a class="link" href={explorerTxUrl(chainId, collectionApproveTxHash)} target="_blank" rel="noreferrer"
      >{textShort(collectionApproveTxHash)}</a
    >
  </div>
{/if}

{#if collectionApproveError}
  <div class="section">
    <div class="form-field kre-warning-msg">
      <p><i class="fas fa-exclamation-triangle fa-left c-red" />{collectionApproveError}</p>
    </div>
  </div>
{/if}
