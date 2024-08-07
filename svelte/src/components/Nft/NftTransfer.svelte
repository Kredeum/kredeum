<script lang="ts">
  import { onMount } from "svelte";

  import {
    explorerNftUrl,
    explorerTxUrl,
    textShort,
    explorerTxLog,
    displayEther
  } from "@kredeum/common/src/common/config";
  import { transferNft } from "@kredeum/common/src/nft/nft-transfer";

  import { metamaskSignerAddress } from "../../stores/metamask";
  import { nftStore, nftStoreRefresh } from "../../stores/nft/nft";

  import InputEthAddress from "../Input/InputEthAddress.svelte";
  import { nftRoyaltyMinimum } from "@kredeum/common/src/nft/nft";

  /////////////////////////////////////////////////
  // <NftTransfer {chainId} {address} {tokenID} />
  // Transfer NFT
  /////////////////////////////////////////////////
  export let chainId: number;
  export let address: string;
  export let tokenID: string;
  /////////////////////////////////////////////////
  $: nft = nftStore(chainId, address, tokenID);
  /////////////////////////////////////////////////

  let transfering: number;
  let transferTxHash: string = "";
  let transferError: string;

  let destinationAddress = "";

  const _transferError = (err: string): void => {
    transferError = err;
    console.error(transferError);
    transfering = 0;
  };

  // TRANSFERING STATES
  //
  //  STATE 0 Start
  //    |
  //  STATE 1
  //  Confirm Transfer
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
  const S4_TRANSFERED = 4;

  const transferInit = async () => {
    transferTxHash = "";

    transfering = S1_CONFIRM;
  };

  const transferConfirm = async () => {
    const transferTxRespYield = transferNft(chainId, address, tokenID, $metamaskSignerAddress, destinationAddress);

    transfering = S2_SIGN_TX;

    const transferTxResp = (await transferTxRespYield.next()).value;
    transferTxHash = transferTxResp?.hash || "";
    if (!transferTxHash)
      return _transferError(`ERROR while sending transaction... ${JSON.stringify(transferTxResp, null, 2)}`);

    explorerTxLog(chainId, transferTxResp);
    transfering = S3_WAIT_TX;

    const txReceipt = (await transferTxRespYield.next()).value;

    if (!txReceipt.status) return _transferError(`ERROR returned by transaction ${txReceipt}`);

    transfering = S4_TRANSFERED;

    nftStoreRefresh(chainId, address, tokenID);
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
        {#if transfering == S1_CONFIRM}
          <div class="section">To what address ?</div>
          <div class="section">
            <div class="form-field">
              <InputEthAddress bind:ethAddress={destinationAddress} placeholder={"destinator address"} />
            </div>
          </div>

          {#if nftRoyaltyMinimum($nft).gt(0)}
            <div class="section">
              <div class="form-field kre-warning-msg">
                <p>
                  <i class="fas fa-exclamation-triangle fa-left c-red" /> Be carefull, you're about to transfer this NFT
                  #{tokenID} which requires minimum royalty payment. That means you have, in any case, to pay the minimal
                  Royalty amount of {displayEther(chainId, nftRoyaltyMinimum($nft))} to transfer it.
                </p>
              </div>
            </div>
          {/if}

          <div class="txtright">
            <button class="btn btn-default btn-sell" type="submit" on:click={transferConfirm}>Transfer</button>
          </div>
        {:else if transfering == S2_SIGN_TX}
          <div class="section">Please, sign the transaction</div>
        {:else if transfering == S3_WAIT_TX}
          <div class="section">Wait till completed, it may take one minute or more.</div>
        {:else if transfering == S4_TRANSFERED}
          <div>
            <div class="titre">
              <i class="fas fa-check fa-left c-green" />
              NFT
              <a
                class="link"
                href="{explorerNftUrl(chainId, { chainId, address, tokenID })}}"
                target="_blank"
                rel="noreferrer">#{tokenID}</a
              >
              transfered!
            </div>
          </div>
        {/if}

        {#if transferTxHash}
          <div class="flex">
            <a class="link" href={explorerTxUrl(chainId, transferTxHash)} target="_blank" rel="noreferrer"
              >{textShort(transferTxHash)}</a
            >
          </div>
        {/if}
        {#if transferError}
          <div class="section">
            <div class="form-field kre-warning-msg">
              <p><i class="fas fa-exclamation-triangle fa-left c-red" />{transferError}</p>
            </div>
          </div>
        {/if}
      </div>
    </div>
  </div>
</div>
