<script lang="ts">
  import { nftStore } from "@stores/nft/nft";
  import { nftSubListRefresh } from "@stores/nft/nftSubList";
  import { explorerNftUrl, explorerTxUrl, sleep, textShort } from "@lib/kconfig";

  import { metamaskChainId, metamaskProvider, metamaskSigner, metamaskAccount } from "@main/metamask";

  import { getContext } from "svelte";
  import { Writable } from "svelte/store";
  import { fade } from "svelte/transition";
  import { clickOutside } from "@helpers/clickOutside";

  import { checkApprouved, setApproveToken, approveNftReceipt, setTokenPrice } from "@lib/kautomarket";

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

  let setPriceTxHash: string = null;
  let settingTokenPrice: boolean = false;
  let setted = false;
  let failSetPrice = false;

  let approveTxHash: string = null;
  let settingApprove = false;
  let approved = "";
  let failApprove = false;

  let setPriceInput: string;
  let newNftPrice: string;

  let open = false;

  $: chainId && address && tokenID && handleCheckApproved();
  const handleCheckApproved = async () => {
    approved = await checkApprouved(chainId, address, tokenID, $metamaskProvider);
    console.log("🚀 ~ file: NftSetPrice.svelte ~ line 43 ~ handleCheckApproved ~ approved", approved);
  };
  /////////////////////////////////////////////////

  const openSetPriceModal = () => {
    open = true;
  };

  const closePriceModal = () => {
    open = false;
  };

  /////////////////////////////////////////////////
  const cancelSetPrice = () => {
    setPriceInput = "";
  };

  $: setPriceInput && handlePrice();
  const handlePrice = () => {
    setPriceInput = setPriceInput.replace(/[^0-9.,]/g, "");
    let formatedInputPrice = setPriceInput.replace(/[,]/g, ".");
    const decimals = formatedInputPrice.split(".")[1];
    if (decimals?.length > 18) {
      setPriceInput = setPriceInput.slice(0, -1);
      formatedInputPrice = formatedInputPrice.slice(0, -1);
    }

    // const priceToConvert = inputPrice.replace(/[,]/g, ".").replace(/[^0-9.]/g, "");
    if (setPriceInput) newNftPrice = formatedInputPrice;

    console.log("nftPrice : ", newNftPrice, " Wei");
  };

  const displayPriceInput = () => {
    setPriceInput = nftPrice;
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
    settingTokenPrice = true;
    const txResp = await setTokenPrice(chainId, address, $metamaskSigner, tokenID, newNftPrice);

    if (txResp) {
      setPriceTxHash = txResp.hash;

      const txReceipt = await txResp.wait();
      const blockTx = txReceipt.blockNumber;
      do {
        await sleep(1000);
      } while ((await $metamaskProvider.getBlockNumber()) <= blockTx);

      setted = Boolean(txReceipt.status);
      // setted = true;
    } else {
      failSetPrice = true;
    }

    // nftStore.nftRemoveOne(chainId, address, tokenID, $metamaskAccount);
    await nftStore.refreshOne(chainId, address, tokenID).catch(console.error);
    await nftSubListRefresh(chainId, address, $metamaskAccount);

    // nft = nftStore.getOneStore(chainId, address, tokenID);

    // const { contract, supports } = await collectionGetContract(chainId, address, $metamaskProvider);
    // if (supports.IOpenMarketable) {
    //   const openNFTsV4 = contract as OpenNFTsV4;
    //   $nft.price = ethers.utils.formatEther(
    //     (await openNFTsV4.callStatic.tokenPrice(BigNumber.from(tokenID))).toString()
    //   );
    // }
    $refreshCollectionList += 1;

    settingTokenPrice = false;
    setPriceInput = null;
  };
  /////////////////////////////////////////////////
</script>

<!-- <span on:click={() => openBuyModal()} class="btn btn-small btn-outline" title="Buy this nft"
  ><i class="fa fa-shopping-cart" /> Buy</span
> -->

<div class="flex"><span class="label">Nft Price</span></div>
<div class="flex">
  <span class="link overflow-ellipsis" title={nftPrice} target="_blank">
    {#if setPriceInput}
      <input type="text" bind:value={setPriceInput} disabled={settingTokenPrice} id="set-price-nft" />

      {#if settingTokenPrice}
        <i class="fas fa-spinner fa-left c-green refresh" /> wait
      {:else}
        <span on:click={cancelSetPrice} class="btn btn-small btn-outline kre-outline-red" title="Confirm token price">
          <i class="fa fa-undo c-red" /> Cancel
        </span>
        <span on:click={openSetPriceModal} class="btn btn-small btn-outline" title="Confirm token price">
          <i class="fa fa-check" /> Confirm
        </span>
      {/if}
    {:else}
      {nftPrice || "0"} Eth
      <span on:click={displayPriceInput} class="btn btn-small btn-outline" title="Set price"
        ><i class="fa fa-usd" /> Set price</span
      >
    {/if}
  </span>
</div>

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
              {#if !approved}
                <div class="titre">
                  <i class="fas fa-circle" /> You have to approuve this NFT #{tokenID} to be sold
                </div>
                <div class="txtright">
                  {#if failApprove}
                    <div class="section">
                      <div class="kre-buy-warning">
                        <i class="fas fa-exclamation-triangle fa-left c-red" />
                        Approve process failed !
                      </div>
                    </div>
                  {:else if settingApprove}
                    {#if approveTxHash}
                      Wait till completed, it may take one minute or more.
                    {:else}
                      Sign the transaction
                    {/if}
                    <span class="btn btn-small btn-outline" title="wait until the end of transaction">
                      <i class="fas fa-spinner fa-left c-green refresh" /> wait</span
                    >
                  {:else}
                    <button class="btn btn-default btn-sell" type="submit" on:click={() => setApproved()}
                      >Approve</button
                    >
                  {/if}
                </div>
              {:else}
                <div class="titre">
                  <i class="fas fa-check fa-left c-green" />
                  NFT #{tokenID} is approved
                </div>
              {/if}
              {#if approveTxHash}
                <div class="flex">
                  <a class="link" href={explorerTxUrl($metamaskChainId, approveTxHash)} target="_blank"
                    >{textShort(approveTxHash)}</a
                  >
                </div>
              {/if}
              {#if !setted}
                <div class="titre">
                  <i class="fas fa-circle" /> Set this NFT #{tokenID} price
                </div>

                {#if failSetPrice}
                  <div class="section">
                    <div class="kre-buy-warning">
                      <i class="fas fa-exclamation-triangle fa-left c-red" />
                      Setting price process failed !
                    </div>
                  </div>
                {:else if settingTokenPrice}
                  <div class="titre">
                    <i class="fas fa-sync fa-left c-green" />Setting NFT price...
                  </div>
                  <div class="section">
                    {#if setPriceTxHash}
                      Wait till completed, it may take one minute or more.
                    {:else}
                      Sign the transaction
                    {/if}
                  </div>
                  <span class="btn btn-small btn-outline" title="wait until the end of transaction">
                    <i class="fas fa-spinner fa-left c-green refresh" /> wait</span
                  >
                {:else}
                  <button class="btn btn-default btn-sell" type="submit" on:click={() => setNewTokenPrice()}
                    >Set Nft price</button
                  >
                {/if}
              {:else}
                <div class="titre">
                  <i class="fas fa-check fa-left c-green" />
                  NFT
                  <a class="link" href="{explorerNftUrl(chainId, { chainId, address, tokenID })}}" target="_blank"
                    >#{tokenID}</a
                  >
                  Price setted !
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
{/if}

<style>
  .modal-window {
    visibility: visible;
    opacity: 1;
  }

  #kre-price-nft {
    z-index: 1000;
    pointer-events: auto;
  }

  .kre-buy-warning {
    background-color: rgba(255, 0, 0, 0.07);
    border-radius: 6px;
    padding: 15px 30px;
  }

  .kre-outline-red {
    border-color: red;
    color: red;
  }
</style>
