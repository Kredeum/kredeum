<script lang="ts">
  import type { NftType } from "lib/ktypes";
  import { nftUrl, nftDescription, nftDescriptionShort, nftName, textShort } from "lib/kconfig";
  import { nftGetImageLink } from "lib/knft-get-metadata";

  import MediaDisplay from "../Media/MediaDisplay.svelte";

  import { onMount } from "svelte";

  import Nft from "./Nft.svelte";

  import CopyLinkItem from "../Global/CopyLinkItem.svelte";

  /////////////////////////////////////////////////
  //  <NftLine {nft} {account}? {more}? {platform}? />
  // Display NFT line
  /////////////////////////////////////////////////
  export let nft: NftType;
  export let account: string = undefined;
  export let more = 0;
  export let platform: string = undefined;

  let displayMode: string = "list";

  // let i = 1;
  const moreToggle = (): void => {
    more = more > 0 ? 0 : (document.getElementById(`more-detail-${nft?.tokenID || ""}`)?.offsetHeight || 0) + 70;
  };

  $: console.log("NftLine", nft);

  onMount(() => more == -1 && moreToggle());
</script>

<div
  id="table-drop-{nft?.tokenID || ''}"
  class="table-row table-drop"
  class:closed={!more}
  style="height: {more ? `${more}px` : 'auto'};"
>
  <div id="media-{nft?.tokenID || ''}" class="table-col">
    <div class="table-col-content">
      <MediaDisplay {nft} {displayMode} />
      <div class="kre-line-text">
        <strong>{nftName(nft)}</strong>
        <span id="description-short-{nft?.tokenID || ''}" class:hidden={more}>{nftDescriptionShort(nft, 64)} </span>
      </div>
      <a
        class="info-button"
        href={nftGetImageLink(nft)}
        title="&#009;{nftDescription(nft)} 
                NFT address (click to view in explorer)&#013.{nftUrl(nft)}"
        target="_blank"><i class="fas fa-info-circle" /></a
      >
      <CopyLinkItem copyData={nftUrl(nft).replace(".", "https://beta.kredeum.com")} position={"100%, -100%"} />
    </div>
  </div>

  <div id="marketplace-{nft?.tokenID || ''}" class="table-col">
    <div class="table-col-content">
      <span id="token-id-{nft?.tokenID || ''}" title="  #{nft.tokenID}">
        &nbsp;&nbsp;<strong>#{textShort(nft.tokenID)}</strong>
      </span>
    </div>
  </div>

  <div id="more-{nft?.tokenID || ''}" class="table-col more" on:click={() => moreToggle()}>
    <div class="table-col-content txtright">
      <div class="more-button"><i class="fas fa-chevron-down" /></div>
    </div>
  </div>

  <div id="more-detail-{nft?.tokenID || ''}" class="detail">
    <Nft chainId={nft.chainId} address={nft.address} tokenID={nft.tokenID} {account} {platform} />
  </div>
</div>

<style>
  .detail {
    display: flex;
  }

  .table-col-content {
    display: flex;
    align-items: center;
    gap: 5px;
  }

  .kre-line-text {
    overflow: hidden;
    text-overflow: ellipsis;
  }
</style>
