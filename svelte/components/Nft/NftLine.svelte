<script lang="ts">
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
    getNetwork
  } from "lib/kconfig";
  // import { nftKey } from "lib/kconfig";
  import { nftGetImageLink } from "lib/knft-get-metadata";
  import { divMedia } from "helpers/mediasDisplay";

  import { onMount } from "svelte";

  import { shortcode } from "helpers/shortcodes";
  import NftTransfer from "./NftTransfer.svelte";

  /////////////////////////////////////////////////
  //  <NftLine {nft} {account}? {index}? {more}? {platform}? />
  // Display NFT
  /////////////////////////////////////////////////
  export let nft: NftType;
  export let account: string = undefined;
  export let index = 0;
  export let more = 0;
  export let platform: string = "dapp";

  // let i = 1;
  const moreToggle = (): void => {
    more = more > 0 ? 0 : (document.getElementById(`more-detail-${index}`)?.offsetHeight || 0) + 70;
  };

  onMount(() => {
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
      {@html divMedia(nft, index, true, "list")}

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
      {#if getNetwork(nft.chainId)?.openSea}
        {#if addressSame(nft.owner, account)}
          <a href={nftOpenSeaUrl(nft.chainId, nft)} class="btn btn-small btn-sell" title="Sell" target="_blank">
            Sell
          </a>
        {:else}
          <a href={nftOpenSeaUrl(nft.chainId, nft)} class="btn btn-small btn-buy" title="Buy" target="_blank"> Buy </a>
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
    {#await divMedia(nft, index, false, "list")}
      <div class="media media-full media-text" />
    {:then mediaDiv}
      {@html mediaDiv}
    {/await}
    <div id="description-{index}" class="description">
      <strong>Description</strong>

      <p>
        {nftDescription(nft)}
      </p>
      <ul class="steps">
        <li class="complete">
          <div class="flex"><span class="label">Owner</span></div>
          <div class="flex">
            {@html explorerAddressLink(nft.chainId, nft.owner, 15)}
          </div>
        </li>
        <li class="complete">
          <div class="flex"><span class="label">Permanent Link</span></div>
          <div class="flex">
            <a class="link" href={kredeumNftUrl(nft.chainId, nft)} target="_blank">
              {@html nftUrl(nft, 10)}
            </a>
          </div>
        </li>
        <li class="complete">
          <div class="flex"><span class="label">Collection @</span></div>
          <div class="flex">
            <a class="link" href={explorerCollectionUrl(nft.chainId, nft?.address)} target="_blank"
              >{getShortAddress(nft.address, 15)}</a
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
            <a href="#transfert-$nft-{nft.tokenID}" class="btn btn-small btn-default" title="Transfer NFT">
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
              <button on:click={() => shortcode(nft)} class="btn krd_shortcode_data">Shortcode</button>
            </div>
          </li>
        {/if}
      </ul>
    </div>
  </div>

  <!-- Modal transfer $nft -->
  <div id="transfert-$nft-{nft.tokenID}" class="modal-window">
    <NftTransfer chainId={nft.chainId} address={nft.address} tokenID={nft.tokenID} />
  </div>

  <!--  <div id="claim-$nft-{$nft.tokenID}" class="modal-window">
    <NftClaimView bind:$nft />
  </div>
   -->
</div>
