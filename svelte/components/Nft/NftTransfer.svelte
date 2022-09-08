<script lang="ts">
  import { onMount } from "svelte";
  // import { getContext } from "svelte";
  // import { Writable } from "svelte/store";

  import { explorerNftUrl, explorerTxUrl, textShort } from "@lib/common/kconfig";
  import { transferNft } from "@lib/nft/ktransfer";

  import { metamaskChainId, metamaskSigner } from "@main/metamask";
  import { nftStore } from "@stores/nft/nft";

  /////////////////////////////////////////////////
  //  <NftTransfer {chainId} {address} {tokenID} />
  // Display NFT
  /////////////////////////////////////////////////
  export let chainId: number;
  export let address: string;
  export let tokenID: string;

  let transfering: number;
  let transfered: boolean;
  let transferTxHash: string;
  let error: string;

  let destinationAddress = "";

  const _error = (err: string): void => {
    error = err;
    console.error(error);
    transfering = 0;
  };

  // Context for refreshCollectionList & refreshNftsList
  ///////////////////////////////////////////////////////////
  // let refreshCollectionList: Writable<number> = getContext("refreshCollectionList");
  // let refreshNftsList: Writable<number> = getContext("refreshNftsList");
  ///////////////////////////////////////////////////////////

  // TRANSFERING STATES
  //
  //  STATE 0 Start
  //    |
  //  STATE 1
  //  Confirm Transfer
  //    |
  //  STATE 3
  // Ask for signature
  //    |
  //  STATE 4  Sending TX
  //    |
  //  TEST TxResp --> ERROR sending TX
  //    |
  //  STATE 5 Display TX Hash
  //    |
  //  TEST TxReceipt --> ERROR inside TX
  //    |
  //  STATE 6 End TX & Refresh
  //    |
  //  CLICK Close
  //    |
  //  STATE 0 popup closed

  // STATES : S0 -S6
  const S1_CONFIRM_TRANSFER = 1;
  const S2_SIGN_TX = 2;
  const S3_SENT_TX = 3;
  const S4_WAIT_TX = 4;
  const S5_TRANSFERED = 5;

  const transferInit = async () => {
    transferTxHash = null;

    transfering = S1_CONFIRM_TRANSFER;
  };

  const transferConfirm = async () => {
    const txRespYield = transferNft(chainId, address, tokenID, $metamaskSigner, destinationAddress);

    transfering = S2_SIGN_TX;

    const txResp = (await txRespYield.next()).value;

    transfering = S3_SENT_TX;

    transferTxHash = txResp?.hash;
    if (!transferTxHash) return _error(`ERROR while sending transaction... ${JSON.stringify(txResp, null, 2)}`);

    transfering = S4_WAIT_TX;

    const txReceipt = (await txRespYield.next()).value;

    if (!Boolean(txReceipt.status)) return _error(`ERROR returned by transaction ${txReceipt}`);

    transfering = S5_TRANSFERED;

    nftStore.nftRemoveOne(chainId, address, tokenID);
  };

  onMount(() => {
    transferInit();
  });
</script>

<div id="kredeum-transfer-nft">
  <div class="modal-content">
    <a href="./#" title="Close" class="modal-close"><i class="fa fa-times" /></a>

    <div class="modal-body">
      <div>
        <div class="titre">
          <i class="fas fa-gift" /> Transfer NFT #{tokenID} 
        </div>
        {#if transfering == S1_CONFIRM_TRANSFER}

        <div class="section">To what address ?</div>
        <div class="section">
            <div class="form-field">
              <input type="text" placeholder="destinator address" bind:value={destinationAddress} />
            </div>
          </div>

          <div class="txtright">
            <button class="btn btn-default btn-sell" type="submit" on:click={transferConfirm}>Transfer</button>
          </div>
        {:else if transfering == S2_SIGN_TX}
          <div class="section">Please, sign the transaction</div>
        {:else if transfering == S3_SENT_TX}
          <div class="section">Sending transaction...</div>
        {:else if transfering == S4_WAIT_TX}
          <div class="section">Wait till completed, it may take one minute or more.</div>
        {:else if transfering == S5_TRANSFERED}
          <div>
            <div class="titre">
              <i class="fas fa-check fa-left c-green" />
              NFT
              <a class="link" href="{explorerNftUrl(chainId, { chainId, address, tokenID })}}" target="_blank"
                >#{tokenID}</a
              >
              transfered!
            </div>
          </div>
        {/if}

        {#if transferTxHash}
          <div class="flex">
            <a class="link" href={explorerTxUrl($metamaskChainId, transferTxHash)} target="_blank"
              >{textShort(transferTxHash)}</a
            >
          </div>
        {/if}
      </div>
    </div>
  </div>
</div>
