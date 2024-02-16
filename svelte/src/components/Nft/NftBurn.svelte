<script lang="ts">
  import { onMount } from "svelte";

  import { burnNft } from "@common/nft/nft-burn";
  import { ADDRESS_DEAD, explorerNftUrl, explorerTxUrl, textShort } from "@common/common/config";
  import { collectionBurnable } from "@common/collection/collection-get";
  import { transferNft } from "@common/nft/nft-transfer";
  import { metamaskSignerAddress } from "@svelte/stores/metamask";

  import { nftStoreRemove } from "@svelte/stores/nft/nft";

  /////////////////////////////////////////////////
  // <NftBurn {chainId} {address} {tokenID} />
  // Burn NFT
  /////////////////////////////////////////////////
  export let chainId: number;
  export let address: string;
  export let tokenID: string;
  /////////////////////////////////////////////////

  let burning: number;
  let burnable: boolean;
  let burnTxHash: string = "";
  let burnError: string;

  const _burnError = (err: string): void => {
    burnError = err;
    console.error(burnError);
    burning = S1_CONFIRM_BURN;
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
  const S4_WAIT_TX = 4;
  const S5_BURNED = 5;

  const burnInit = async () => {
    burnable = false;
    burnTxHash = "";

    burning = S0_START;

    burnable = Boolean(await collectionBurnable(chainId, address));

    burning = burnable ? S1_CONFIRM_BURN : S2_CONFIRM_TRANSFER;
  };

  const burnConfirm = async () => {
    const txRespYield = burnable
      ? burnNft(chainId, address, tokenID)
      : transferNft(chainId, address, tokenID, $metamaskSignerAddress, ADDRESS_DEAD);

    burning = S3_SIGN_TX;

    const txResp = (await txRespYield.next()).value;
    burnTxHash = txResp?.hash || "";
    if (!burnTxHash) return _burnError(`ERROR while sending transaction... ${JSON.stringify(txResp, null, 2)}`);

    burning = S4_WAIT_TX;

    const txReceipt = (await txRespYield.next()).value;

    if (!txReceipt.status) return _burnError(`ERROR returned by transaction ${txReceipt}`);

    burning = S5_BURNED;

    nftStoreRemove(chainId, address, tokenID);
  };

  onMount(() => {
    burnInit();
  });
</script>

<div id="kredeum-burn-nft">
  <div class="modal-content">
    <a href="./#" title="Close" on:click={() => (burning = S1_CONFIRM_BURN)} class="modal-close"
      ><i class="fa fa-times" /></a
    >

    <div class="modal-body">
      <div class="titre">
        <i class="fas fa-fire" /> Burn this NFT #{tokenID} Forever
        {burning <= S3_SIGN_TX ? " ?" : ""}
      </div>
      <div>
        {#if burning == S0_START}
          <div class="section">Checking contract...</div>
        {:else if burning == S1_CONFIRM_BURN}
          <div class="section">
            <div class="form-field kre-warning-msg">
              <p>
                <i class="fas fa-exclamation-triangle fa-left c-red" /> Be carefull, you're about to burn this NFT #{tokenID}
              </p>
              <p>This operation is irreversible !!!</p>
            </div>
          </div>

          <div class="txtright">
            <button class="btn btn-default btn-burn" type="submit" on:click={burnConfirm}>Yes, I want to burn</button>
          </div>
        {:else if burning == S2_CONFIRM_TRANSFER}
          <div class="section">
            <div class="form-field kre-warning-msg">
              <p>
                <i class="fas fa-exclamation-triangle fa-left c-red" /> This NFT #{tokenID} can't be burned!
              </p>
              <p>But you can get rid of it anyway, by transfering it to an unusable "dEaD address"</p>
              <p>{ADDRESS_DEAD}</p>
              <p>This operation is irreversible !!!</p>
            </div>
          </div>

          <div class="txtright">
            <button class="btn btn-default btn-burn" type="submit" on:click={burnConfirm}
              >Yes, I want to transfer it</button
            >
          </div>
        {:else if burning == S3_SIGN_TX}
          <div class="section">Please, sign the transaction</div>
        {:else if burning == S4_WAIT_TX}
          <div class="section">Wait till completed, it may take one minute or more.</div>
        {:else if burning == S5_BURNED}
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
              {burnable ? "burned" : "transfered"}!
            </div>
          </div>
        {/if}

        {#if burnTxHash}
          <div class="flex">
            <a class="link" href={explorerTxUrl(chainId, burnTxHash)} target="_blank" rel="noreferrer"
              >{textShort(burnTxHash)}</a
            >
          </div>
        {/if}
        {#if burnError}
          <div class="section">
            <div class="form-field kre-warning-msg">
              <p><i class="fas fa-exclamation-triangle fa-left c-red" />{burnError}</p>
            </div>
          </div>
        {/if}
      </div>
    </div>
  </div>
</div>

<style>
  .btn-burn {
    background-color: red;
    font-weight: 900;
  }
</style>
