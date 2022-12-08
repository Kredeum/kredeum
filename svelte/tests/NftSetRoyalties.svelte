<script lang="ts">
  import { onMount } from "svelte";
  import { fade } from "svelte/transition";
  import { clickOutside } from "@helpers/clickOutside";

  import { nftStore } from "@stores/nft/nft";
  import { explorerTxUrl, explorerTxLog, textShort } from "@lib/common/config";

  import { setTokenRoyaltyInfos } from "@lib/nft/nft-automarket-set";

  import { BigNumber } from "ethers";

  /////////////////////////////////////////////////
  //  <NftSetRoyalties {chainId} {address} {tokenID} {nftRoyaltiesAmount} receiver />
  // Display NFT
  /////////////////////////////////////////////////
  export let chainId: number;
  export let address: string;
  export let tokenID: string;
  export let nftRoyaltyFee: BigNumber;
  export let receiver: string;

  let setRoyaltyReceiverInput: string;
  let setRoyaltiesAmountInput: string;
  let newNftRoyaltiesAmount: string;

  let royaltyInfoSetting: number;
  let setRoyaltyInfoTxHash: string;
  let setRoyaltyInfoError: string;

  let open = false;

  const handleClose = () => (open = false);
  const handleOpen = () => (open = true);

  $: S4_ROYALTIES_SETTED && open === false && handleResetAfterSetRoyaltiesAmount();
  const handleResetAfterSetRoyaltiesAmount = () => {
    setRoyaltyInfoTxHash = null;
    setRoyaltyInfoError = null;
    setRoyaltiesAmountInput = null;
    setRoyaltyReceiverInput = null;
    newNftRoyaltiesAmount = null;
    royaltyInfoSetting = S1_CONFIRM;
  };

  /////////////////////////////////////////////////
  $: setRoyaltiesAmountInput && handleRoyaltiesAmount();
  const handleRoyaltiesAmount = () => {
    setRoyaltiesAmountInput = setRoyaltiesAmountInput.replace(/[^0-9.,]/g, "");
    let formatedInputRoyaltiesAmount = setRoyaltiesAmountInput.replace(/[,]/g, ".");

    if (setRoyaltiesAmountInput) newNftRoyaltiesAmount = (Number(formatedInputRoyaltiesAmount) * 100).toString();
  };

  /////////////////////////////////////////////////

  const _setRoyaltyInfoError = (err: string): void => {
    setRoyaltyInfoError = err;
    console.error(setRoyaltyInfoError);
    royaltyInfoSetting = 0;
  };

  // SETTING ROYALTY INFO STATES
  //
  //  STATE 0 Start
  //    |
  //  STATE 1
  //  Confirm Set royalty info
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
  const S4_ROYALTIES_SETTED = 4;

  const setRoyaltyInfoInit = async () => {
    setRoyaltyInfoTxHash = null;

    royaltyInfoSetting = S1_CONFIRM;
  };

  const setRoyaltyInfoConfirm = async () => {
    const setRoyaltyInfoTxRespYield = setTokenRoyaltyInfos(
      chainId,
      address,
      tokenID,
      newNftRoyaltiesAmount,
      setRoyaltyReceiverInput
    );

    royaltyInfoSetting = S2_SIGN_TX;

    const setRoyaltyInfoTxResp = (await setRoyaltyInfoTxRespYield.next()).value;
    setRoyaltyInfoTxHash = setRoyaltyInfoTxResp?.hash;
    if (!setRoyaltyInfoTxHash)
      return _setRoyaltyInfoError(
        `ERROR while sending transaction... ${JSON.stringify(setRoyaltyInfoTxResp, null, 2)}`
      );

    explorerTxLog(chainId, setRoyaltyInfoTxResp);
    royaltyInfoSetting = S3_WAIT_TX;

    const txReceipt = (await setRoyaltyInfoTxRespYield.next()).value;

    if (!Boolean(txReceipt.status)) return _setRoyaltyInfoError(`ERROR returned by transaction ${txReceipt}`);

    royaltyInfoSetting = S4_ROYALTIES_SETTED;

    await nftStore.refreshOne(chainId, address, tokenID).catch(console.error);
  };

  onMount(() => {
    setRoyaltyInfoInit();
  });
</script>

<span
  on:click={handleOpen}
  on:keydown={handleOpen}
  class="btn btn-small btn-outline"
  title="Set royalty infos for this NFT"
>
  Set royalties infos
</span>

{#if open}
  <div id="kre-royalty-nft" class="modal-window" transition:fade>
    <div use:clickOutside={() => (open = false)}>
      <div id="kredeum-set-royalty-nft">
        <div class="modal-content">
          <span on:click={handleClose} on:keydown={handleClose} title="Close" class="modal-close"
            ><i class="fa fa-times" /></span
          >

          <div class="modal-body">
            <div>
              {#if royaltyInfoSetting == S1_CONFIRM}
                <div class="titre">
                  <p><i class="fas fa-angle-right" /> Set this NFT #{tokenID} RoyaltiesAmount</p>
                </div>

                <div class="section">
                  From {receiver} address to :
                  <input type="text" bind:value={setRoyaltyReceiverInput} id="set-receiver-nft" />
                </div>

                <div class="section">
                  From {nftRoyaltyFee.div(100)} % to
                  <input type="text" bind:value={setRoyaltiesAmountInput} id="set-price-nft" />
                  %
                </div>
                <div class="txtright">
                  <button class="btn btn-default btn-sell" type="submit" on:click={() => setRoyaltyInfoConfirm()}
                    >Set Royalty infos</button
                  >
                </div>
              {/if}

              {#if royaltyInfoSetting >= S2_SIGN_TX && royaltyInfoSetting < S4_ROYALTIES_SETTED}
                <div class="titre">
                  <p><i class="fas fa-sync fa-left c-green" />Setting NFT RoyaltiesAmount to :</p>
                </div>
                <div class="section">
                  Fee : {Number(newNftRoyaltiesAmount) / 100} %<br />
                  Receiver : {setRoyaltyReceiverInput}
                </div>
              {/if}

              {#if royaltyInfoSetting == S2_SIGN_TX}
                <div class="section">Please, sign the transaction</div>
              {:else if royaltyInfoSetting == S3_WAIT_TX}
                <div class="section">Wait till completed, it may take one minute or more.</div>
              {/if}

              {#if royaltyInfoSetting == S4_ROYALTIES_SETTED}
                <div class="titre">
                  <p><i class="fas fa-check fa-left c-green" /> NFT #{tokenID} Royalty Info setted !</p>
                </div>
              {/if}

              {#if setRoyaltyInfoTxHash}
                <div class="flex">
                  <a class="link" href={explorerTxUrl(chainId, setRoyaltyInfoTxHash)} target="_blank" rel="noreferrer"
                    >{textShort(setRoyaltyInfoTxHash)}</a
                  >
                </div>
              {/if}

              {#if setRoyaltyInfoError}
                <div class="section">
                  <div class="form-field kre-warning-msg">
                    <p><i class="fas fa-exclamation-triangle fa-left c-red" />{setRoyaltyInfoError}</p>
                  </div>
                </div>
              {/if}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
{/if}

<style>
  .modal-window {
    visibility: visible;
    opacity: 1;
  }

  #kre-royalty-nft {
    z-index: 1000;
    pointer-events: auto;
    text-align: left;
  }
</style>
