<script lang="ts">
  import { getContext } from "svelte";
  import type { Writable } from "svelte/store";

  import { clickOutside } from "@helpers/clickOutside";
  import { fade } from "svelte/transition";

  import MediaDisplay from "./MediaDisplay.svelte";
  import { nftStore } from "@stores/nft/nft";
  import { nftMediaAnimationUrl, nftMediaContentType } from "@helpers/nft";

  /////////////////////////////////////////////////
  // <MediaPreview {chainId} {address} {tokenID} {displayMode}?  />
  // Display a clickable preview of media opening a zoom modal with full media
  // Modal closing by clickoutside
  /////////////////////////////////////////////////////////////////
  export let chainId: number;
  export let address: string;
  export let tokenID: string;
  /////////////////////////////////////////////////////////////////
  $: nft = nftStore.getOne(chainId, address, tokenID);
  /////////////////////////////////////////////////

  let open = false;

  const handleClose = () => (open = false);
  const handleMetadata = () => {
    if (nftMediaContentType($nft)) {
      $toPlayTokenID = $toPlayTokenID !== tokenID ? tokenID : "";
    } else {
      open = true;
    }
  };

  let toPlayTokenID: Writable<string> = getContext("toPlayTokenID");
</script>

<!-- <div class="grid-detail-krd"> -->
<div class="media-zoom">
  <div class="media">
    <span
      class="krd-pointer {nftMediaContentType($nft) === 'video' || nftMediaAnimationUrl($nft)
        ? 'no-zoom-hover'
        : 'zoom-hover'}"
      on:click={handleMetadata}
      on:keydown={handleMetadata}
    >
      <i class="fas fa-search" />
      <MediaDisplay {chainId} {address} {tokenID} displayMode="preview" />
    </span>
  </div>
</div>

<!-- Modal Zoom -->
{#if open}
  <div id="zoom" class="modal-window" transition:fade>
    <div
      use:clickOutside={() => {
        open = false;
      }}
    >
      <div class="modal-content">
        <span on:click={handleClose} on:keydown={handleClose} title="Close" class="modal-close krd-pointer">
          <i class="fa fa-times" /></span
        >
        <div class="modal-body">
          <MediaDisplay {chainId} {address} {tokenID} displayMode="preview" small={false} />
        </div>
      </div>
    </div>
  </div>
{/if}

<style>
  #zoom {
    visibility: visible;
    opacity: 1;
    pointer-events: auto;
  }

  .krd-pointer {
    cursor: pointer;
  }

  .no-zoom-hover {
    display: block;
    width: 100%;
    height: 100%;
  }

  .krd-pointer.no-zoom-hover i.fas {
    display: none;
  }

  .media {
    width: 100%;
  }

  .media-zoom .media {
    position: relative;
    max-height: calc(19vw - 40px);
  }

  .media-zoom .media .zoom-hover::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(30, 30, 67, 0.7);
    opacity: 0;
    transition: all 300ms ease-in-out;
  }

  .media-zoom .media .zoom-hover .fas {
    position: absolute;
    top: 50%;
    left: 50%;
    z-index: 1;
    color: white;
    font-size: 20px;
    transform: translate(-50%, -50%);
    opacity: 0;
    transition: all 300ms ease-in-out;
  }

  .media-zoom .media .zoom-hover:hover::after,
  .media-zoom .media .zoom-hover:hover .fas {
    opacity: 1;
  }
</style>
