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
  import { chainId, network, owner, signer } from "./network";
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
    const mediaType = nft.contentType?.startsWith("video") ? "video" : "photo";
    const mediaSrc = nftGetImageLink(nft);
    let div: string;
    if (small) {
      div = `<div id="media-small-${index}" class="media media-small media-${mediaType}">`;
    } else {
      div = `<div id="media-full-${index}" class="media media-${mediaType}">`;
    }
    if (mediaType == "video") {
      div += divMediaVideo(mediaSrc, small);
    } else {
      div += divMediaImage(mediaSrc);
    }
    div += "</div>";

    console.log("divMedia div", div);
    return div;
  };

  onMount(async () => {
    console.log("NFT", nft);
    if (more == -1) moreToggle();
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
      {@html divMedia(nft, index, true)}
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
        <li class="complete">
          <div class="flex">
            <a href="#transfert-nft-{nft.tokenID}" class="btn btn-small btn-default" title="Transfer NFT">
              <i class="fas fa-gift" /> Transfer
            </a>
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

  <!-- Modal transfer nft -->
  <div id="transfert-nft-{nft.tokenID}" class="modal-window">
    <TransferNft bind:nft />
  </div>
</div>
