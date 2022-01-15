<script lang="ts">
  import type { Nft } from "lib/ktypes";

  import {
    getShortAddress,
    nftUrl,
    sleep,
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
  import { chainId, network, owner } from "./network";
  import { nftGetImageLink } from "../lib/knft-get";
  import { onMount } from "svelte";

  export let nft: Nft;
  export let index: number;
  export let more: number;
  export let platform: string;

  const moreToggle = (): void => {
    more = more ? 0 : (document.getElementById(`more-detail-${index}`)?.offsetHeight || 0) + 70;
  };

  const shortcode = async (nft: Nft) => {
    const data = `[kredeum_sell chain="${nft.chainName}" collection="${nft.collection}" tokenid="${
      nft.tokenID
    }" ipfs="${nft.ipfs}"]${nftName(nft)}[/kredeum_sell]`;

    await navigator.clipboard.writeText(data).catch(() => console.log("Not copied"));
    console.log("Copied");
  };

  const divMediaImage = (nft: Nft) => `<img alt="link" src=${nftGetImageLink(nft)} />`;

  const divMediaVideo = (nft: Nft) =>
    `<video autoplay=""  controls="" controlslist="nodownload" loop="" playsinline="" preload="metadata" style="border-radius: initial;">
      <source src="${nftGetImageLink(nft)}" type="video/mp4">
     </video>`;

  const divMedia = (nft: Nft, index: number) => {
    const mediaType = nft.contentType?.startsWith("video") ? "video" : "photo";

    let div = `<div id="media-full-${index}" class="media media-${mediaType}">`;

    div += mediaType === "video" ? divMediaVideo(nft) : divMediaImage(nft);

    div += "</div>";
    return div;
  };

  onMount(async () => {
    console.log("NFT", nft);
  });
</script>

<div
  id="table-drop-{index}"
  class="table-row table-drop"
  class:closed={!more}
  style="height: {more ? `${more}px` : 'auto'};"
>
  <div id="media-{index}" class="table-col">
    <div class="table-col-content">
      <div class="media media-small media-photo">
        <img alt="link" src={nftGetImageLink(nft)} height="100" />
      </div>
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
      {#if $network?.openSea}
        {#if addressSame(nft.owner, $owner)}
          <a href={nftOpenSeaUrl($chainId, nft)} class="btn btn-small btn-sell" title="Sell" target="_blank"> Sell </a>
        {:else}
          <a href={nftOpenSeaUrl($chainId, nft)} class="btn btn-small btn-buy" title="Buy" target="_blank"> Buy </a>
        {/if}
      {:else}
        <a
          class="info-button"
          href={nftGetImageLink(nft)}
          title="&#009;{nftDescription(nft)} 
                  NFT address (click to view explorer)&#013.{nftUrl(nft)}"
          target="_blank"><i class="fas fa-info-circle" /></a
        >
      {/if}
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
    {@html divMedia(nft, index)}
    <div id="description-{index}" class="description">
      <strong>Description</strong>
      <p>
        {nftDescription(nft)}
      </p>
      <ul class="steps">
        <li class="complete">
          <div class="flex"><span class="label">Owner</span></div>
          <div class="flex">
            {@html explorerAddressLink($chainId, nft.owner, 15)}
          </div>
        </li>
        <li class="complete">
          <div class="flex"><span class="label">Token REF</span></div>
          <div class="flex">
            <a class="link" href={explorerNftUrl($chainId, nft)} target="_blank">
              {@html nftUrl(nft, 10)}
            </a>
          </div>
        </li>
        <li class="complete">
          <div class="flex"><span class="label">Collection @</span></div>
          <div class="flex">
            <a class="link" href={explorerCollectionUrl($chainId, nft?.collection)} target="_blank"
              >{getShortAddress(nft.collection, 15)}</a
            >
          </div>
        </li>

        <li class="complete">
          <div class="flex"><span class="label">Metadata IPFS</span></div>
          <div class="flex">
            <a class="link" href={nft.tokenURI} target="_blank">{textShort(nft.ipfsJson)}</a>
          </div>
        </li>
        <li class="complete">
          <div class="flex"><span class="label">Image IPFS</span></div>
          <div class="flex">
            <a class="link" href={nft.image} target="_blank">{textShort(nft.ipfs)}</a>
          </div>
        </li>
        {#if platform === "wordpress"}
          <li class="complete">
            <div class="flex"><span class="label">Copy shortcode sell button</span></div>
            <div class="flex">
              <button on:click={() => shortcode(nft)} class="btn krd_shortcode_data">Shortcode</button>
            </div>
          </li>
        {/if}
      </ul>
    </div>
  </div>
</div>
