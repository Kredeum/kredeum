<script lang="ts">
  import type { Readable } from "svelte/store";
  import type { NftType } from "@lib/common/ktypes";

  import { BigNumber, utils } from "ethers";

  import { getCurrency, kredeumNftHttp } from "@lib/common/kconfig";

  import { metamaskAccount, metamaskSigner } from "@main/metamask";
  import { nftStore } from "@stores/nft/nft";

  import MediaPreview from "../Media/MediaPreview.svelte";
  import NftBuy from "../Nft/NftBuy.svelte";
  import NftSell from "../Nft/NftSell.svelte";

  /////////////////////////////////////////////////
  //  <NftWpBuy {chainId} {address} {tokenID} />
  // Display solo NFT buy card
  /////////////////////////////////////////////////
  export let chainId: number;
  export let address: string;
  export let tokenID: string;

  let account: string = undefined;

  let nft: Readable<NftType>;

  $: account = $metamaskAccount;
  // HANDLE CHANGE : on truthy chainId and address, and whatever account
  $: account, chainId && address && tokenID && handleChange();
  const handleChange = async (): Promise<void> => {
    // STATE VIEW : sync get Nft
    nft = nftStore.getOneStore(chainId, address, tokenID);

    // ACTION : async refresh Nft
    nftStore.refreshOne(chainId, address, tokenID).catch(console.error);
  };

  $: console.info("Nft", $nft);
</script>

{#if $metamaskSigner && $nft}
  <div class="kre-buy-krd">
    <div class="card-krd kre-media">
      <MediaPreview nft={$nft} />

      <div class="kre-buy-infos">
        <div class="overflow-ellipsis">
          <strong>
            <a href={kredeumNftHttp(chainId, $nft)} target="_blank" class="kre-blue-link">{$nft.name} #{tokenID}</a>
          </strong>
        </div>
        <div class="overflow-ellipsis kre-buy-price">
          <strong>{utils.formatEther($nft.price || 0)} {getCurrency(chainId)}</strong>
        </div>
      </div>
      <div class="kre-action-buttons">
        {#if $nft.collection?.supports?.IOpenMarketable}
          {#if $nft.owner === account}
            <NftSell {chainId} {address} {tokenID} platform={"shortcode"} />
          {:else if BigNumber.from($nft.price || 0)}
            <NftBuy
              {chainId}
              {address}
              {tokenID}
              nftPrice={$nft.price}
              nftOwner={$nft.owner}
              nftRoyalty={$nft.royalty}
              platform={"shortcode"}
            />
          {/if}
        {/if}
      </div>
    </div>
  </div>
{/if}

<style>
  .card-krd {
    box-shadow: 0 0 20px rgb(0 0 0 / 10%);
  }

  .kre-buy-infos {
    margin-top: 15px;
    color: #192247;
  }

  .kre-buy-infos a {
    text-decoration: none;
  }

  .kre-buy-price {
    font-size: 20px;
    margin-top: 5px;
  }

  :global(.kre-buy-section .media-zoom .media) {
    position: relative;
    height: 200px;
  }

  :global(.kre-buy-section .media:not(.full) img, .kre-buy-section .media:not(.full) video) {
    height: 200px;
  }

  .kre-action-buttons {
    width: 100%;
    margin-top: 13px;
  }

  :global(.kre-action-buttons button.btn-sell-modal, .kre-action-buttons a.btn-buy-modal) {
    width: 100%;
    border-radius: 6px;
    margin-bottom: 8px;
    border: 1px solid #e8e8e8;
    font-weight: 700;
    font-size: 16px;
    display: flex;
    align-items: baseline;
    justify-content: center;
    padding: 15px;
    cursor: pointer;
    text-decoration: none;
    height: 3.3em;
  }
</style>
