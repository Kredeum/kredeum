<script lang="ts">
  import type { NftType } from "@lib/common/types";
  import { nftUrl, nftDescription, nftDescriptionShort, nftName, textShort } from "@lib/common/config";
  import { nftGetImageLink } from "@lib/nft/nft-get-metadata";

  import MediaDisplay from "../Media/MediaDisplay.svelte";

  import { onMount } from "svelte";

  import Nft from "./Nft.svelte";
  import NftData from "./NftData.svelte";

  /////////////////////////////////////////////////
  //  <NftLine {nft} {account}? {more}? {platform}? />
  // Display NFT line
  /////////////////////////////////////////////////
  export let chainId: number;
  export let address: string;
  export let tokenID: string;

  export let account: string = undefined;
  export let platform: string = undefined;
  export let more = 0;

  let displayMode: string = "list";

  // let i = 1;
  const moreToggle = (id: string): void => {
    more = more > 0 ? 0 : (document.getElementById(`more-detail-${id || ""}`)?.offsetHeight || 0) + 70;
  };

  // $: console.info("NftLine", nft);

  onMount(() => more == -1 && moreToggle("-1"));
</script>

<NftData {chainId} {address} {tokenID} let:nft>
  {#if nft}
    <div
      id="table-drop-{nft.tokenID || ''}"
      class="table-row table-drop"
      class:closed={!more}
      style="height: {more ? `${more}px` : 'auto'};"
    >
      <div id="media-{nft.tokenID || ''}" class="table-col">
        <div class="table-col-content">
          <MediaDisplay {nft} {displayMode} />

          <strong>{nftName(nft)}</strong>
          <span id="description-short-{nft.tokenID || ''}" class:hidden={more}>{nftDescriptionShort(nft, 64)} </span>
          <a
            class="info-button"
            href={nftGetImageLink(nft)}
            title="&#009;{nftDescription(nft)}
                NFT address (click to view in explorer)&#013.{nftUrl(nft)}"
            target="_blank"
            rel="noreferrer"><i class="fas fa-info-circle" /></a
          >
        </div>
      </div>

      <div id="marketplace-{nft.tokenID || ''}" class="table-col">
        <div class="table-col-content">
          <span id="token-id-{nft.tokenID || ''}" title="  #{nft.tokenID}">
            &nbsp;&nbsp;<strong>#{textShort(nft.tokenID)}</strong>
          </span>
        </div>
      </div>

      <div
        id="more-{nft.tokenID || ''}"
        class="table-col more"
        on:click={() => moreToggle(nft.tokenID)}
        on:keydown={() => moreToggle(nft.tokenID)}
      >
        <div class="table-col-content txtright">
          <div class="more-button"><i class="fas fa-chevron-down" /></div>
        </div>
      </div>

      <div id="more-detail-{nft.tokenID || ''}" class="detail">
        <Nft chainId={nft.chainId} address={nft.address} tokenID={nft.tokenID} {account} {platform} />
      </div>
    </div>
  {/if}
</NftData>

<style>
  .detail {
    display: flex;
  }
</style>
