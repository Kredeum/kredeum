<script lang="ts">
  import type { NftType } from "lib/ktypes";

  import { nftName, nftOpenSeaUrl, addressSame, getNetwork } from "lib/kconfig";

  import { nftGetImageLink } from "lib/knft-get-metadata";

  /////////////////////////////////////////////////
  //  <NftGrid {chainId} {tokenID} {account} {nft} {platform}? />
  // Display NFT card for Grid mode
  /////////////////////////////////////////////////
  export let chainId: number;
  export let tokenID: string = "";
  export let account: string = undefined;

  export let nft: NftType;
  export let index: number;

  export let platform: string = "dapp";
  ///////////////////////////////////////////////////////////////////////////////
  const displayNftSolo = (evt: Event, clickedNftTokenID: string) => {
    if (!(evt.target as HTMLInputElement).classList.contains("btn")) {
      evt.preventDefault();
      tokenID = clickedNftTokenID;
    }
  };
  ///////////////////////////////////////////////////////////////////////////////
  const divMediaImage = (src: string, height?: number) => {
    const heightString = height ? `height="${height}"` : "";
    return `<img alt="link" src=${src} ${heightString}/>`;
  };

  const divMediaVideo = (src: string, small = true) => {
    let video: string;
    if (small) {
      video = '<video preload="metadata" style="border-radius: initial;">';
    } else {
      video =
        '<video autoplay="true"  controls="" controlslist="nodownload" loop="" playsinline="" preload="metadata" style="border-radius: initial;">';
    }
    video += `<source src="${src}" type="video/mp4"></video>`;
    return video;
  };

  const divMedia = (nft: NftType, index: number, small = false) => {
    const mediaContentType = nft.contentType?.split("/");
    const mediaType = mediaContentType[0] || "image";

    const mediaSrc = nftGetImageLink(nft);
    let div: string = "";
    if (small) {
      div += `<div id="media-small-${index}" class="media media-grid media-${mediaType}">`;
    } else {
      div += `<div id="media-full-${index}" class="media media-grid media-${mediaType}">`;
    }
    div += `<a href=".${/*normalizedSoloNftUrl(chainId, nft)*/ ""}">`;
    if (mediaType == "video") {
      div += divMediaVideo(mediaSrc, small);
    } else if (mediaType == "image") {
      div += divMediaImage(mediaSrc);
    } else {
      div += '<div class="media-text"></div>';
    }
    div += "</a></div>";

    // console.log("divMedia div", div);
    return div;
  };
  console.log("nft", nft);
</script>

<div class="col col-xs-12 col-sm-6 col-md-4 col-lg-3">
  <div class="grid-card-krd" on:click={(evt) => displayNftSolo(evt, nft.tokenID)}>
    {@html divMedia(nft, index, true)}

    <div class="caption">
      <h3>{nftName(nft)}</h3>
      {#if getNetwork(nft.chainId)?.openSea}
        {#if addressSame(nft.owner, account)}
          <a href={nftOpenSeaUrl(chainId, nft)} class="btn btn-small btn-sell" title="Sell" target="_blank"> Sell </a>
        {:else}
          <a href={nftOpenSeaUrl(chainId, nft)} class="btn btn-small btn-buy" title="Buy" target="_blank"> Buy </a>
        {/if}
      {/if}
    </div>
  </div>
</div>

<style>
  .grid-card-krd h3 {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    max-height: 20.8px;
  }
</style>
