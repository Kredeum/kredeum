<script lang="ts">
  import { nftStore } from "@stores/nft/nft";
  import { nftSubListRefresh } from "@stores/nft/nftSubList";
  import { explorerTxUrl, explorerTxLog, sleep, textShort } from "@lib/common/kconfig";

  import { metamaskChainId, metamaskProvider, metamaskSigner, metamaskAccount } from "@main/metamask";

  import { getContext } from "svelte";
  import { Writable } from "svelte/store";
  import { fade } from "svelte/transition";
  import { clickOutside } from "@helpers/clickOutside";

  import { setTokenRoyaltyInfos } from "@lib/nft/kautomarket";
  import { ethers } from "ethers";

  /////////////////////////////////////////////////
  //  <NftTransfer {chainId} {address} {tokenID} />
  // Display NFT
  /////////////////////////////////////////////////
  export let chainId: number;
  export let address: string;
  export let tokenID: string;
  export let nftRoyaltiesAmount: string;
  export let receiver: string;

  // Context for refreshCollectionList
  ///////////////////////////////////////////////////////////
  let refreshCollectionList: Writable<number> = getContext("refreshCollectionList");
  ///////////////////////////////////////////////////////////

  let setRoyaltyReceiverInput: string;
  let settingTokenRoyaltyReceiver: boolean = false;

  let inputReceiverError: string;

  let setRoyaltiesAmountTxHash: string = null;
  let settingTokenRoyaltiesAmount: boolean = false;
  let failSetRoyaltiesAmount = false;
  let setted = false;

  let inputError: string;
  let setRoyaltiesAmountInput: string;
  let newNftRoyaltiesAmount: string;

  let open = false;

  $: setted && open === false && handleResetAfterSetRoyaltiesAmount();
  const handleResetAfterSetRoyaltiesAmount = () => {
    setRoyaltiesAmountTxHash = null;
    settingTokenRoyaltiesAmount = false;
    setted = false;
    failSetRoyaltiesAmount = false;
    setRoyaltiesAmountInput = null;
    newNftRoyaltiesAmount = null;
  };

  /////////////////////////////////////////////////

  const openSetRoyaltiesModal = () => {
    open = true;
  };

  const closeSetRoyaltiesModal = () => {
    open = false;
  };

  /////////////////////////////////////////////////
  $: setRoyaltiesAmountInput && handleRoyaltiesAmount();
  const handleRoyaltiesAmount = () => {
    setRoyaltiesAmountInput = setRoyaltiesAmountInput.replace(/[^0-9.,]/g, "");
    let formatedInputRoyaltiesAmount = setRoyaltiesAmountInput.replace(/[,]/g, ".");
    // const decimals = formatedInputRoyaltiesAmount.split(".")[1];
    // if (decimals?.length > 18) {
    //   setRoyaltiesAmountInput = setRoyaltiesAmountInput.slice(0, -1);
    //   formatedInputRoyaltiesAmount = formatedInputRoyaltiesAmount.slice(0, -1);
    // }

    if (setRoyaltiesAmountInput) newNftRoyaltiesAmount = (Number(formatedInputRoyaltiesAmount) * 100).toString();
  };

  const setNewTokenRoyaltyInfos = async () => {
    if (setRoyaltiesAmountInput) {
      settingTokenRoyaltiesAmount = true;
      const txResp = await setTokenRoyaltyInfos(
        chainId,
        address,
        tokenID,
        Number(newNftRoyaltiesAmount),
        $metamaskAccount,
        $metamaskSigner
      );

      if (txResp) {
        setRoyaltiesAmountTxHash = txResp.hash;

        const txReceipt = await txResp.wait();
        explorerTxLog(chainId, txResp);

        const blockTx = txReceipt.blockNumber;
        do {
          await sleep(1000);
        } while ((await $metamaskProvider.getBlockNumber()) <= blockTx);

        setted = Boolean(txReceipt.status);
        await nftStore.refreshOne(chainId, address, tokenID).catch(console.error);
        await nftSubListRefresh(chainId, address, $metamaskAccount);

        $refreshCollectionList += 1;
      } else {
        failSetRoyaltiesAmount = true;
      }
    } else {
      inputError = "Please enter a valid RoyaltiesAmount";
    }

    settingTokenRoyaltiesAmount = false;
    setRoyaltiesAmountInput = null;
  };
  /////////////////////////////////////////////////
</script>

<span on:click={openSetRoyaltiesModal} class="btn btn-small btn-outline" title="Sell this NFT">
  <!-- <i class="fa fa-comment-dollar" />  -->
  Set royalties infos
</span>

{#if open}
  <div id="kre-price-nft" class="modal-window" transition:fade>
    <div
      use:clickOutside={() => {
        closeSetRoyaltiesModal();
      }}
    >
      <div id="kredeum-buy-nft">
        <div class="modal-content">
          <span on:click={closeSetRoyaltiesModal} title="Close" class="modal-close"><i class="fa fa-times" /></span>

          <div class="modal-body">
            <div>
              <div class="kre-modal-block">
                {#if !setted}
                  <div class="titre">
                    <p><i class="fas fa-angle-right" /> Set this NFT #{tokenID} RoyaltiesAmount</p>
                  </div>

                  {#if failSetRoyaltiesAmount}
                    <div class="section">
                      <div class="kre-warning-msg">
                        <i class="fas fa-exclamation-triangle fa-left c-red" />
                        Setting RoyaltiesAmount process failed !
                      </div>
                    </div>
                  {:else if settingTokenRoyaltiesAmount}
                    <div class="section">
                      <i class="fas fa-sync fa-left c-green" />Setting NFT RoyaltiesAmount to {ethers.utils.formatEther(
                        newNftRoyaltiesAmount
                      )}
                      Eth...<br />

                      {#if setRoyaltiesAmountTxHash}
                        Wait till completed, it may take one minute or more.
                      {:else}
                        Sign the transaction
                      {/if}
                    </div>
                    <div class="txtright">
                      <span class="btn btn-small btn-outline" title="wait until the end of transaction">
                        <i class="fas fa-spinner fa-left c-green refresh" /> wait</span
                      >
                    </div>
                  {:else}
                    <div class="section">
                      From {receiver} address to :
                      <input
                        type="text"
                        bind:value={setRoyaltyReceiverInput}
                        disabled={settingTokenRoyaltyReceiver}
                        id="set-receiver-nft"
                      />
                      Eth
                      {#if inputReceiverError}
                        <span class="c-red">Please enter a valid Ethereum address</span>
                      {/if}
                    </div>

                    <div class="section">
                      From {Number(nftRoyaltiesAmount) / 100} % to
                      <input
                        type="text"
                        bind:value={setRoyaltiesAmountInput}
                        disabled={settingTokenRoyaltiesAmount}
                        id="set-price-nft"
                      />
                      Eth
                      {#if inputError}
                        <span class="c-red">Please enter a valid royalties amount</span>
                      {/if}
                    </div>
                    <div class="txtright">
                      <button class="btn btn-default btn-sell" type="submit" on:click={() => setNewTokenRoyaltyInfos()}
                        >Set Royalty infos</button
                      >
                    </div>
                  {/if}
                {:else}
                  <div class="titre">
                    <p><i class="fas fa-check fa-left c-green" /> NFT #{tokenID} RoyaltiesAmount setted !</p>
                  </div>
                {/if}
                {#if setRoyaltiesAmountTxHash}
                  <div class="flex">
                    <a class="link" href={explorerTxUrl($metamaskChainId, setRoyaltiesAmountTxHash)} target="_blank"
                      >{textShort(setRoyaltiesAmountTxHash)}</a
                    >
                  </div>
                {/if}
              </div>
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

  .kre-modal-block {
    border-bottom: 1px solid lightgray;
    padding-bottom: 30px;
  }

  #kre-price-nft {
    z-index: 1000;
    pointer-events: auto;
  }

  .kre-warning-msg {
    background-color: rgba(255, 0, 0, 0.07);
    border-radius: 6px;
    padding: 15px 30px;
  }
</style>
