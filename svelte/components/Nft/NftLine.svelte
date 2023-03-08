<script lang="ts">
  import { nftUrl, nftDescription, nftDescriptionShort, nftName, textShort } from "@lib/common/config";
  import { nftGetImageLink } from "@lib/nft/nft-get-metadata";

  import Media from "../Media/Media.svelte";

  import { onMount } from "svelte";

  import Nft from "./Nft.svelte";
  import { nftStore } from "@stores/nft/nft";

  /////////////////////////////////////////////////
  //  <NftLine {nft} {owner}? {more}? {platform}? />
  // Display NFT line
  /////////////////////////////////////////////////
  export let chainId: number;
  export let address: string;
  export let tokenID: string;
  export let owner: string = undefined;
  export let platform: string = undefined;
  export let more = 0;
  ///////////////////////////////////////////////////////////
  $: nft = nftStore.getOne(chainId, address, tokenID);
  ///////////////////////////////////////////////////////////

  let mode: string = "list";

  // let i = 1;
  const moreToggle = (id: string): void => {
    more = more > 0 ? 0 : (document.getElementById(`more-detail-${id || ""}`)?.offsetHeight || 0) + 70;
  };

  // $: console.info("NftLine", nft);

  onMount(() => more == -1 && moreToggle("-1"));
</script>

{#if $nft}
  <div
    id="table-drop-{tokenID || ''}"
    class="table-row table-drop"
    class:closed={!more}
    style="height: {more ? `${more}px` : 'auto'};"
  >
    <div id="media-{tokenID || ''}" class="table-col">
      <div class="table-col-content">
        <Media {chainId} {address} {tokenID} {mode} />

        <strong>{nftName($nft)}</strong>
        <span id="description-short-{tokenID || ''}" class:hidden={more}>{nftDescriptionShort($nft, 64)} </span>
        <a
          class="info-button"
          href={nftGetImageLink($nft)}
          title="&#009;{nftDescription($nft)}
                NFT address (click to view in explorer)&#013.{nftUrl($nft)}"
          target="_blank"
          rel="noreferrer"><i class="fas fa-info-circle" /></a
        >
      </div>
    </div>

    <div id="marketplace-{tokenID || ''}" class="table-col">
      <div class="table-col-content">
        <span id="token-id-{tokenID || ''}" title="  #{tokenID}">
          &nbsp;&nbsp;<strong>#{textShort(tokenID)}</strong>
        </span>
      </div>
    </div>

    <div
      id="more-{tokenID || ''}"
      class="table-col more"
      on:click={() => moreToggle(tokenID)}
      on:keydown={() => moreToggle(tokenID)}
    >
      <div class="table-col-content txtright">
        <div class="more-button"><i class="fas fa-chevron-down" /></div>
      </div>
    </div>

    <div id="more-detail-{tokenID || ''}" class="detail">
      <Nft {chainId} {address} {tokenID} {owner} {platform} />
    </div>
  </div>
{/if}

<style>
  .detail {
    display: flex;
  }
</style>
