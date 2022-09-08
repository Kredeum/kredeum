<script lang="ts">
  import { getContext, onMount } from "svelte";
  import { Writable } from "svelte/store";

  import { burnNft, AddressdEaD } from "@lib/nft/kburn";
  import { explorerNftUrl, explorerTxUrl, textShort } from "@lib/common/kconfig";
  import { collectionBurnable } from "@lib/collection/kcollection-get";
  import { transferNft } from "@lib/nft/ktransfer";

  import { metamaskChainId, metamaskSigner } from "@main/metamask";
  import { nftStore } from "@stores/nft/nft";

  /////////////////////////////////////////////////
  // <NftBurn {chainId} {address} {tokenID} />
  // Burn NFT
  /////////////////////////////////////////////////
  export let chainId: number;
  export let address: string;
  export let tokenID: string;
  /////////////////////////////////////////////////

  let burning: number = 0;
  let burnable: boolean;
  let burnTxHash: string;
  let error: string;

  // Context for refreshCollectionList
  let refreshCollectionList: Writable<number> = getContext("refreshCollectionList");

  const _error = (err: string): void => {
    error = err;
    console.error(error);
    burning = 0;
  };

  // BURNING STATES
  //
  //  STATE 0 Start
  //    |
  //  TEST burnable
  //    |         \
  //  STATE 1    STATE 2
  //  Confirm    Confirm
  //   Burn    Transfer2Dead
  //    |         /
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
  const S0_START = 0;
  const S1_CONFIRM_BURN = 1;
  const S2_CONFIRM_TRANSFER = 2;
  const S3_SIGN_TX = 3;
  const S4_SENT_TX = 4;
  const S5_WAIT_TX = 5;
  const S6_BURNED = 6;

  const burnInit = async () => {
    burnable = false;
    burnTxHash = null;

    burning = S0_START;

    burnable = Boolean(await collectionBurnable(chainId, address, $metamaskSigner));

    burning = burnable ? S1_CONFIRM_BURN : S2_CONFIRM_TRANSFER;
  };

  const burnConfirm = async () => {
    let txRespYield = burnable
      ? burnNft(chainId, address, tokenID, $metamaskSigner)
      : transferNft(chainId, address, tokenID, $metamaskSigner, AddressdEaD);

    burning = S3_SIGN_TX;

    const txResp = (await txRespYield.next()).value;

    burning = S4_SENT_TX;

    burnTxHash = txResp?.hash;
    if (!burnTxHash) return _error(`ERROR while sending transaction... ${JSON.stringify(txResp, null, 2)}`);

    burning = S5_WAIT_TX;

    const txReceipt = (await txRespYield.next()).value;

    if (!Boolean(txReceipt.status)) return _error(`ERROR returned by transaction ${txReceipt}`);

    burning = S6_BURNED;

    nftStore.nftRemoveOne(chainId, address, tokenID);
    $refreshCollectionList += 1;
  };

  onMount(() => {
    burnInit();
  });
</script>

<div id="kredeum-burn-nft">
  <div class="modal-content">
    <a href="./#" title="Close" on:click={() => (burning = S0_START)} class="modal-close"><i class="fa fa-times" /></a>

    <div class="modal-body">
      <div class="titre">
        <i class="fas fa-fire" /> Burn this NFT #{tokenID} Forever ?
      </div>
      <div>
        {#if burning == S0_START}
          <div class="section">Checking contract...</div>
        {:else if burning == S1_CONFIRM_BURN}
          <div class="section">
            <div class="form-field kre-burn-warning">
              <p>
                <i class="fas fa-exclamation-triangle fa-left c-red" /> Be carefull, you're about to burn this NFT #{tokenID}
              </p>
              <p>This operation is irreversible !!!</p>
            </div>
          </div>

          <div class="txtright">
            <button class="btn btn-default btn-sell" type="submit" on:click={burnConfirm}>Yes, I want to burn</button>
          </div>
        {:else if burning == S2_CONFIRM_TRANSFER}
          <div class="section">
            <div class="form-field kre-burn-warning">
              <p>
                <i class="fas fa-exclamation-triangle fa-left c-red" /> This NFT #{tokenID} can't be burned!
              </p>
              <p>But you can get rid of it anyway, by transfering it unusable "dEaD address"</p>
              <p>{AddressdEaD}</p>
              <p>This operation is irreversible !!!</p>
            </div>
          </div>

          <div class="txtright">
            <button class="btn btn-default btn-sell" type="submit" on:click={burnConfirm}
              >Yes, I want to transfer it</button
            >
          </div>
        {:else if burning == S3_SIGN_TX}
          <div class="section">Please, sign the transaction</div>
        {:else if burning == S4_SENT_TX}
          <div class="section">Sending transaction...</div>
        {:else if burning == S5_WAIT_TX}
          <div class="section">Wait till completed, it may take one minute or more.</div>
        {:else if burning == S6_BURNED}
          <div>
            <div class="titre">
              <i class="fas fa-check fa-left c-green" />
              NFT
              <a class="link" href="{explorerNftUrl(chainId, { chainId, address, tokenID })}}" target="_blank"
                >#{tokenID}</a
              >
              {burnable ? "burned" : "transfered"}!
            </div>
          </div>
        {/if}

        {#if burnTxHash}
          <div class="flex">
            <a class="link" href={explorerTxUrl($metamaskChainId, burnTxHash)} target="_blank"
              >{textShort(burnTxHash)}</a
            >
          </div>
        {/if}
        {#if error}
          <div class="section">{error}</div>
        {/if}
      </div>
    </div>
  </div>
</div>

<style>
  .kre-burn-warning {
    background-color: rgba(255, 0, 0, 0.07);
    border-radius: 6px;
    padding: 15px 30px;
  }
</style>
