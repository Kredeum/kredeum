<script lang="ts">
  import { nftStore } from "@stores/nft/nft";
  import { nftSubListRefresh } from "@stores/nft/nftSubList";
  import { explorerTxUrl, explorerTxLog, sleep, textShort } from "@lib/common/kconfig";

  import { metamaskChainId, metamaskProvider, metamaskSigner, metamaskAccount } from "@main/metamask";

  import { getContext } from "svelte";
  import { Writable } from "svelte/store";
  import { fade } from "svelte/transition";
  import { clickOutside } from "@helpers/clickOutside";

  import { getApproved, setApproveToken, approveNftReceipt, setTokenPrice } from "@lib/nft/kautomarket";
  import { ethers } from "ethers";
  // import { formatEther } from "ethers/lib/utils";

  /////////////////////////////////////////////////
  //  <NftTransfer {chainId} {address} {tokenID} />
  // Display NFT
  /////////////////////////////////////////////////
  export let chainId: number;
  export let address: string;
  export let tokenID: string;
  export let nftPrice: string;

  // Context for refreshCollectionList
  ///////////////////////////////////////////////////////////
  let refreshCollectionList: Writable<number> = getContext("refreshCollectionList");
  ///////////////////////////////////////////////////////////

  let approveTxHash: string = null;
  let settingApprove = false;
  let approved = "";
  let failApprove = false;

  let setPriceTxHash: string = null;
  let settingTokenPrice: boolean = false;
  let setted = false;
  let failSetPrice = false;

  let inputError: string;
  let setPriceInput: string;
  let newNftPrice: string;

  let open = false;

  $: approved && open === false && handleResetAfterApprove();
  const handleResetAfterApprove = () => {
    approveTxHash = null;
    settingApprove = false;
    approved = "";
    failApprove = false;
  };

  $: setted && open === false && handleResetAfterSetPrice();
  const handleResetAfterSetPrice = () => {
    setPriceTxHash = null;
    settingTokenPrice = false;
    setted = false;
    failSetPrice = false;
    setPriceInput = null;
    newNftPrice = null;
  };

  $: open && chainId && address && tokenID && handleCheckApproved();
  const handleCheckApproved = async () => {
    approved = await getApproved(chainId, address, tokenID, $metamaskProvider);
  };
  /////////////////////////////////////////////////

  const openSetPriceModal = () => {
    open = true;
  };

  const closePriceModal = () => {
    open = false;
  };

  /////////////////////////////////////////////////
  $: setPriceInput && handlePrice();
  const handlePrice = () => {
    setPriceInput = setPriceInput.replace(/[^0-9.,]/g, "");
    let formatedInputPrice = setPriceInput.replace(/[,]/g, ".");
    const decimals = formatedInputPrice.split(".")[1];
    if (decimals?.length > 18) {
      setPriceInput = setPriceInput.slice(0, -1);
      formatedInputPrice = formatedInputPrice.slice(0, -1);
    }

    if (setPriceInput) newNftPrice = ethers.utils.parseEther(formatedInputPrice).toString();
  };

  const setApproved = async () => {
    settingApprove = true;
    const txResp = await setApproveToken(chainId, address, tokenID, $metamaskSigner);

    if (txResp) {
      approveTxHash = txResp.hash;

      const txReceipt = await approveNftReceipt(txResp);

      approved = Boolean(txReceipt.status) ? "approved" : "";
    } else {
      failApprove = true;
    }

    settingApprove = false;
  };

  const setNewTokenPrice = async () => {
    if (setPriceInput) {
      settingTokenPrice = true;
      const txResp = await setTokenPrice(chainId, address, tokenID, newNftPrice, $metamaskSigner);

      if (txResp) {
        setPriceTxHash = txResp.hash;

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
        failSetPrice = true;
      }
    } else {
      inputError = "Please enter a valid price";
    }

    settingTokenPrice = false;
    setPriceInput = null;
  };
  /////////////////////////////////////////////////
</script>

<span on:click={openSetPriceModal} class="btn btn-small btn-outline" title="Sell this NFT">
  <i class="fa fa-comment-dollar" /> Sell
</span>

{#if open}
  <div id="kre-price-nft" class="modal-window" transition:fade>
    <div
      use:clickOutside={() => {
        closePriceModal();
      }}
    >
      <div id="kredeum-buy-nft">
        <div class="modal-content">
          <span on:click={closePriceModal} title="Close" class="modal-close"><i class="fa fa-times" /></span>

          <div class="modal-body">
            <div>
              <div class="kre-modal-block">
                {#if !approved}
                  <div class="titre">
                    <i class="fas fa-angle-right" /> You have to approuve this NFT #{tokenID} to be sold
                  </div>
                  {#if failApprove}
                    <div class="section">
                      <div class="kre-warning-msg">
                        <i class="fas fa-exclamation-triangle fa-left c-red" />
                        Approve process failed !
                      </div>
                    </div>
                  {:else if settingApprove}
                    <div class="section">
                      {#if approveTxHash}
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
                    <div class="section">xoblo xoxo lbobloxo blobxoxo</div>
                    <div class="txtright">
                      <button class="btn btn-default btn-sell" type="submit" on:click={() => setApproved()}
                        >Approve</button
                      >
                    </div>
                  {/if}
                {:else}
                  <div class="titre">
                    <i class="fas fa-check fa-left c-green" />
                    NFT #{tokenID} is approved for selling
                  </div>
                {/if}
                {#if approveTxHash}
                  <div class="flex">
                    <a class="link" href={explorerTxUrl($metamaskChainId, approveTxHash)} target="_blank"
                      >{textShort(approveTxHash)}</a
                    >
                  </div>
                {/if}
              </div>
              <div class="kre-modal-block">
                {#if !setted}
                  <div class="titre">
                    <p><i class="fas fa-angle-right" /> Set this NFT #{tokenID} price</p>
                  </div>

                  {#if failSetPrice}
                    <div class="section">
                      <div class="kre-warning-msg">
                        <i class="fas fa-exclamation-triangle fa-left c-red" />
                        Setting price process failed !
                      </div>
                    </div>
                  {:else if settingTokenPrice}
                    <div class="section">
                      <i class="fas fa-sync fa-left c-green" />Setting NFT price to {ethers.utils.formatEther(
                        newNftPrice
                      )}
                      Eth...<br />

                      {#if setPriceTxHash}
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
                      From {ethers.utils.formatEther(nftPrice)} Eth to
                      <input type="text" bind:value={setPriceInput} disabled={settingTokenPrice} id="set-price-nft" />
                      Eth
                      {#if inputError}
                        <span class="c-red">Please enter a valid price</span>
                      {/if}
                    </div>
                    <div class="txtright">
                      <button class="btn btn-default btn-sell" type="submit" on:click={() => setNewTokenPrice()}
                        >Set price</button
                      >
                    </div>
                  {/if}
                {:else}
                  <div class="titre">
                    <p><i class="fas fa-check fa-left c-green" /> NFT #{tokenID} Price setted !</p>
                  </div>
                {/if}
                {#if setPriceTxHash}
                  <div class="flex">
                    <a class="link" href={explorerTxUrl($metamaskChainId, setPriceTxHash)} target="_blank"
                      >{textShort(setPriceTxHash)}</a
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
