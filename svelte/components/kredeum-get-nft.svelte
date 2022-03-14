<script lang="ts">
  import type { Nft } from "lib/ktypes";

  import {
    getShortAddress,
    nftUrl,
    explorerCollectionUrl,
    nftDescription,
    nftDescriptionShort,
    nftName,
    nftOpenSeaUrl,
    addressSame,
    textShort,
    explorerNftUrl,
    explorerAddressLink
  } from "lib/kconfig";
  import { chainId, network, owner, signer } from "main/network";
  import { nftGetImageLink } from "lib/knft-get";
  import { onMount } from "svelte";

  import TransferNft from "./kredeum-transfer-nft.svelte";

  export let nft: Nft;
  export let index: number;
  export let more: number;
  export let platform: string;

  const moreToggle = (): void => {
    more = more > 0 ? 0 : (document.getElementById(`more-detail-${index}`)?.offsetHeight || 0) + 70;
  };

  const shortcode = async (nft: Nft) => {
    const data = `[kredeum_sell chain="${nft.chainName}" collection="${nft.collection}" tokenid="${
      nft.tokenID
    }" ipfs="${nft.ipfs}"]${nftName(nft)}[/kredeum_sell]`;

    await navigator.clipboard.writeText(data).catch(() => console.log("Not copied"));
    console.log("Copied");
  };

  const divMediaImage = (src: string, height?: number) => {
    const heightString = height ? `height="${height}"` : "";
    return `<img alt="link" src=${src} ${heightString}/>`;
  };

  const divMediaVideo = (src: string, small = true) => {
    let video: string;
    if (small) {
      video = `<video preload="metadata" style="border-radius: initial;">`;
    } else {
      video = `<video autoplay="true"  controls="" controlslist="nodownload" loop="" playsinline="" preload="metadata" style="border-radius: initial;">`;
    }
    video += `<source src="${src}" type="video/mp4"></video>`;
    return video;
  };

  const divMedia = (nft: Nft, index: number, small = false) => {
    const mediaContentType = nft.contentType?.split("/");
    const mediaType = mediaContentType[0] || "image";

    const mediaSrc = nftGetImageLink(nft);
    let div: string = "";
    if (small) {
      div += `<div id="media-small-${index}" class="media media-${mediaType}">`;
    } else {
      div += `<div id="media-full-${index}" class="media media-${mediaType}">`;
    }
    div += `<a href=".">`;
    if (mediaType == "video") {
      div += divMediaVideo(mediaSrc, small);
    } else if (mediaType == "image") {
      div += divMediaImage(mediaSrc);
    } else {
      div += "</a></div>";
      div += `<div class="media-text"></div>`;
    }
    div += "</div>";

    // console.log("divMedia div", div);
    return div;
  };

  onMount(async () => {
    console.log("NFT", nft);
    if (more == -1) moreToggle();
  });
</script>

<div class="grid-card-krd">
  {@html divMedia(nft, index, true)}

  <div class="caption">
    <h3>{nftName(nft)}</h3>
    {#if addressSame(nft.owner, $owner)}
      <a href={nftOpenSeaUrl($chainId, nft)} class="btn btn-small btn-sell" title="Sell" target="_blank"> Sell </a>
    {:else}
      <a href={nftOpenSeaUrl($chainId, nft)} class="btn btn-small btn-buy" title="Buy" target="_blank"> Buy </a>
    {/if}
  </div>
</div>

{#if platform === "wordpress"}
  <div>WordPress</div>
{/if}
