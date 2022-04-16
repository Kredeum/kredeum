<script lang="ts">
  import type { Readable } from "svelte/store";

  import type { NftType } from "lib/ktypes";
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
    explorerAddressLink,
    kredeumNftUrl,
    getNetwork,
    nftKey
  } from "lib/kconfig";

  import { nftGetImageLink } from "lib/knft-get-metadata";
  import { onMount } from "svelte";

  import { nftStore } from "../../stores/nft/nft";
  // import TransferNft from "./NftTransfer.svelte";

  /////////////////////////////////////////////////
  //  <Nft {nft} {account}? {index}? {platform}? {more}? /> -->
  // Display NFT
  /////////////////////////////////////////////////
  export let chainId: number;
  export let address: string;
  export let tokenID: string;
  export let account: string = undefined;
  export let index = 0;
  export let more = 0;
  export let platform = "dapp";

  let nft: Readable<NftType>;
  let i = 1;

  // HANDLE CHANGE : on truthy chainId and address, and whatever account
  $: account, chainId && address && tokenID && handleChange();
  const handleChange = async (): Promise<void> => {
    console.log(`NFT CHANGE #${i++} ${nftKey(chainId, address, tokenID)}`);

    // STATE VIEW : sync get Nft
    nft = nftStore.getOneStore(chainId, address, tokenID);

    // ACTION : async refresh Nft
    await nftStore.refreshOne(chainId, address, tokenID);
  };

  const moreToggle = (): void => {
    more = more > 0 ? 0 : (document.getElementById(`more-detail-${index}`)?.offsetHeight || 0) + 70;
  };

  const shortcode = async (_nft: NftType) => {
    const data = `[kredeum_sell chain="${_nft.chainName}" collection="${_nft.address}" tokenid="${
      _nft.tokenID
    }" ipfs="${_nft.ipfs}"]${nftName(_nft)}[/kredeum_sell]`;

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
      video = "<video preload=\"metadata\" style=\"border-radius: initial;\">";
    } else {
      video =
        "<video autoplay=\"true\"  controls=\"\" controlslist=\"nodownload\" loop=\"\" playsinline=\"\" preload=\"metadata\" style=\"border-radius: initial;\">";
    }
    video += `<source src="${src}" type="video/mp4"></video>`;
    return video;
  };

  const divMedia = (_nft: NftType, index: number, small = false) => {
    const mediaContentType = _nft.contentType?.split("/");
    const mediaType = mediaContentType?.[0] || "image";

    const mediaSrc = nftGetImageLink(_nft);
    let div: string;
    if (small) {
      div = `<div id="media-small-${index}" class="media media-small media-${mediaType}">`;
    } else {
      div = `<div id="media-full-${index}" class="media media-${mediaType}">`;
    }
    if (mediaType == "video") {
      div += divMediaVideo(mediaSrc, small);
    } else if (mediaType == "image") {
      div += divMediaImage(mediaSrc);
    } else {
      div += "<div class=\"media-text\"></div>";
    }
    div += "</div>";

    // console.log("divMedia div", div);
    return div;
  };

  onMount(() => {
    console.log("NFT", $nft);
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
      {@html divMedia($nft, index, true)}

      <strong>{nftName($nft)}</strong>
      <span id="description-short-{index}" class:hidden={more}>{nftDescriptionShort($nft, 64)} </span>
      <a
        class="info-button"
        href={nftGetImageLink($nft)}
        title="&#009;{nftDescription($nft)} 
                NFT address (click to view in explorer)&#013.{nftUrl($nft)}"
        target="_blank"><i class="fas fa-info-circle" /></a
      >
    </div>
  </div>

  <div id="marketplace-{index}" class="table-col">
    <div class="table-col-content">
      {#if getNetwork($nft.chainId)?.openSea}
        {#if addressSame($nft.owner, account)}
          <a href={nftOpenSeaUrl($nft.chainId, $nft)} class="btn btn-small btn-sell" title="Sell" target="_blank">
            Sell
          </a>
        {:else}
          <a href={nftOpenSeaUrl($nft.chainId, $nft)} class="btn btn-small btn-buy" title="Buy" target="_blank">
            Buy
          </a>
        {/if}
      {:else}
        <a
          class="info-button"
          href={nftGetImageLink($nft)}
          title="&#009;{nftDescription($nft)} 
                  NFT address (click to view explorer)&#013.{nftUrl($nft)}"
          target="_blank"><i class="fas fa-info-circle" /></a
        >
      {/if}
      <span id="token-id-{index}" title="  #{$nft.tokenID}">
        &nbsp;&nbsp;<strong>#{textShort($nft.tokenID)}</strong>
      </span>
    </div>
  </div>

  <div id="more-{index}" class="table-col more" on:click={() => moreToggle()}>
    <div class="table-col-content txtright">
      <div class="more-button"><i class="fas fa-chevron-down" /></div>
    </div>
  </div>

  <div id="more-detail-{index}" class="detail">
    {#await divMedia($nft, index)}
      <div class="media media-full media-text" />
    {:then mediaDiv}
      {@html mediaDiv}
    {/await}
    <div id="description-{index}" class="description">
      <strong>Description</strong>

      <p>
        {nftDescription($nft)}
      </p>
      <ul class="steps">
        <li class="complete">
          <div class="flex"><span class="label">Owner</span></div>
          <div class="flex">
            {@html explorerAddressLink($nft.chainId, $nft.owner, 15)}
          </div>
        </li>
        <li class="complete">
          <div class="flex"><span class="label">Permanent Link</span></div>
          <div class="flex">
            <a class="link" href={kredeumNftUrl($nft.chainId, $nft)} target="_blank">
              {@html nftUrl($nft, 10)}
            </a>
          </div>
        </li>
        <li class="complete">
          <div class="flex"><span class="label">Collection @</span></div>
          <div class="flex">
            <a class="link" href={explorerCollectionUrl($nft.chainId, $nft?.address)} target="_blank"
              >{getShortAddress($nft.address, 15)}</a
            >
          </div>
        </li>

        <li class="complete">
          <div class="flex"><span class="label">Metadata IPFS</span></div>
          <div class="flex">
            <a class="link" href={$nft.tokenURI} target="_blank">{textShort($nft.ipfsJson)}</a>
          </div>
        </li>

        <li class="complete">
          <div class="flex"><span class="label">Image IPFS</span></div>
          <div class="flex">
            <a class="link" href={$nft.image} target="_blank">{textShort($nft.ipfs)}</a>
          </div>
        </li>
        <li class="complete">
          <div class="flex">
            <a href="#transfert-$nft-{$nft.tokenID}" class="btn btn-small btn-default" title="Transfer NFT">
              <i class="fas fa-gift" /> Transfer
            </a>
          </div>
          <!-- <div class="flex">
            <a href="#claim-$nft-{$nft.tokenID}" class="btn btn-small btn-default" title="Claim NFT on Kovan">
              <i class="fas fa-exclamation" /> Claim on Kovan
            </a>
          </div> -->
        </li>
        {#if platform === "wordpress"}
          <li class="complete">
            <div class="flex"><span class="label">Copy shortcode sell button</span></div>
            <div class="flex">
              <button on:click={() => shortcode($nft)} class="btn krd_shortcode_data">Shortcode</button>
            </div>
          </li>
        {/if}
      </ul>
    </div>
  </div>

  <!-- Modal transfer $nft -->
  <div id="transfert-$nft-{$nft.tokenID}" class="modal-window">
    <!-- <TransferNft bind:nft={$nft} /> -->
  </div>

  <!--  <div id="claim-$nft-{$nft.tokenID}" class="modal-window">
    <NftClaimView bind:$nft />
  </div>
   -->
</div>
