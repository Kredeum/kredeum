<script lang="ts">
  import type { NftType } from "lib/ktypes";
  import { nftUrl, nftDescription, nftDescriptionShort, nftName, textShort } from "lib/kconfig";
  import { nftGetImageLink } from "lib/knft-get-metadata";

  import MediaDisplay from "../Media/MediaDisplay.svelte";

  import { onMount } from "svelte";

  import Nft from "./Nft.svelte";

  /////////////////////////////////////////////////
  //  <NftLine {nft} {account}? {index}? {more}? {platform}? />
  // Display NFT line
  /////////////////////////////////////////////////
  export let nft: NftType;
  export let account: string = undefined;
  export let index = 0;
  export let more = 0;
  export let platform: string = undefined;

  let displayMode: string = "list";

  // let i = 1;
  const moreToggle = (): void => {
    more = more > 0 ? 0 : (document.getElementById(`more-detail-${index}`)?.offsetHeight || 0) + 70;
  };

  $: console.log("NftLine", nft);

  onMount(() => more == -1 && moreToggle());
</script>

<div
  id="table-drop-{index}"
  class="table-row table-drop"
  class:closed={!more}
  style="height: {more ? `${more}px` : 'auto'};"
>
  <div id="media-{index}" class="table-col">
    <div class="table-col-content">
      <MediaDisplay {nft} {index} {displayMode} />

      <strong>{nftName(nft)}</strong>
      <span id="description-short-{index}" class:hidden={more}>{nftDescriptionShort(nft, 64)} </span>
      <a
        class="info-button"
        href={nftGetImageLink(nft)}
        title="&#009;{nftDescription(nft)} 
                NFT address (click to view in explorer)&#013.{nftUrl(nft)}"
        target="_blank"><i class="fas fa-info-circle" /></a
      >
    </div>
  </div>

  <div id="marketplace-{index}" class="table-col">
    <div class="table-col-content">
      <span id="token-id-{index}" title="  #{nft.tokenID}">
        &nbsp;&nbsp;<strong>#{textShort(nft.tokenID)}</strong>
      </span>
    </div>
  </div>

  <div id="more-{index}" class="table-col more" on:click={() => moreToggle()}>
    <div class="table-col-content txtright">
      <div class="more-button"><i class="fas fa-chevron-down" /></div>
    </div>
  </div>

  <div id="more-detail-{index}" class="detail">
    <Nft chainId={nft.chainId} address={nft.address} tokenID={nft.tokenID} {account} {platform} />
  </div>
</div>

<style>
  .detail {
    display: flex;
  }
</style>
