<script lang="ts">
  import { buyNftResponse, buyNftReceipt } from "@lib/kbuy";
  import { explorerNftUrl, explorerTxUrl, textShort } from "@lib/kconfig";

  import { metamaskChainId, metamaskProvider, metamaskSigner } from "@main/metamask";

  import { getContext } from "svelte";
  import { Writable } from "svelte/store";
  import { fade } from "svelte/transition";
  import { clickOutside } from "@helpers/clickOutside";

  import { checkApprouved, setTokenPrice } from "@lib/kautomarket";

  /////////////////////////////////////////////////
  //  <NftTransfer {chainId} {address} {tokenID} />
  // Display NFT
  /////////////////////////////////////////////////
  export let chainId: number;
  export let address: string;
  export let tokenID: string;
  export let nftPrice: string;

  let buyTxHash: string = null;
  let buying = false;
  let buyed = false;
  let fail = false;

  // Context for refreshCollectionList
  ///////////////////////////////////////////////////////////
  let refreshCollectionList: Writable<number> = getContext("refreshCollectionList");
  ///////////////////////////////////////////////////////////

  let approved = "";
  let setPriceInput: string;
  let newNftPrice: string;
  let settingTokenPrice: boolean = false;

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

  const setNewTokenPrice = async () => {
    settingTokenPrice = true;
    const tansReceipt = await setTokenPrice(chainId, address, $metamaskSigner, tokenID, newNftPrice);

    const blockTx = tansReceipt.blockNumber;

    // do {
    //   await sleep(1000);
    // } while ((await $metamaskProvider.getBlockNumber()) <= blockTx);

    // await nftStore.refreshOne(chainId, address, tokenID).catch(console.error);
    // nft = nftStore.getOneStore(chainId, address, tokenID);

    // const { contract, supports } = await collectionGetContract(chainId, address, $metamaskProvider);
    // if (supports.IOpenMarketable) {
    //   const openNFTsV4 = contract as OpenNFTsV4;
    //   $nft.price = ethers.utils.formatEther(
    //     (await openNFTsV4.callStatic.tokenPrice(BigNumber.from(tokenID))).toString()
    //   );
    // }

    settingTokenPrice = false;
    setPriceInput = null;
  };
  /////////////////////////////////////////////////

  const buy = async () => {
    if ($metamaskSigner) {
      buyTxHash = null;
      buying = true;
      buyed = false;

      const txResp = await buyNftResponse(chainId, address, tokenID, $metamaskSigner, nftPrice);
      if (txResp) {
        buyTxHash = txResp.hash;

        const txReceipt = await buyNftReceipt(txResp);

        buyed = Boolean(txReceipt.status);
      } else {
        fail = true;
      }
      buying = false;

      $refreshCollectionList += 1;
    }
  };
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
        <span on:click={cancelSetPrice} class="btn btn-small btn-outline" title="Confirm token price">
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
              {#if buyed}
                <div>
                  <div class="titre">
                    <i class="fas fa-check fa-left c-green" />
                    NFT
                    <a class="link" href="{explorerNftUrl(chainId, { chainId, address, tokenID })}}" target="_blank"
                      >#{tokenID}</a
                    >
                    buyed!
                  </div>
                </div>
              {:else if fail}
                <div class="section">
                  <div class="kre-buy-warning">
                    <i class="fas fa-exclamation-triangle fa-left c-red" />
                    Buy process failed ! NFT sould not be on sale or there was an error during process
                  </div>
                </div>
              {:else if buying}
                <div class="titre">
                  <i class="fas fa-sync fa-left c-green" />buying NFT...
                </div>
                <div class="section">
                  {#if buyTxHash}
                    Wait till completed, it may take one minute or more.
                  {:else}
                    Sign the transaction
                  {/if}
                </div>
              {:else}
                {#if approved}
                  <div class="titre">
                    <i class="fas fa-circle-o" /> Set this NFT #{tokenID} price
                  </div>
                {:else}
                  <div class="titre">
                    <i class="fas fa-circle-o" /> You have to approuve this NFT #{tokenID} to be sell
                  </div>
                {/if}

                <div class="txtright">
                  <button class="btn btn-default btn-sell" type="submit" on:click={() => buy()}>Buy</button>
                </div>
              {/if}
              {#if buyTxHash}
                <div class="flex">
                  <a class="link" href={explorerTxUrl($metamaskChainId, buyTxHash)} target="_blank"
                    >{textShort(buyTxHash)}</a
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
</style>
