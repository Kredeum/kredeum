<script lang="ts">
  import { fade } from "svelte/transition";

  import Media from "./Media.svelte";
  import { clickOutside } from "@helpers/clickOutside";

  /////////////////////////////////////////////////
  // <MediaPreview {chainId} {address} {tokenID} />
  // Display a clickable preview of media opening a zoom modal with full media
  // Modal closing by clickoutside
  /////////////////////////////////////////////////////////////////
  export let chainId: number;
  export let address: string;
  export let tokenID: string;
  /////////////////////////////////////////////////////////////////


  let popupOpen = false;
  const popupToggle = () => (popupOpen = !popupOpen);
</script>

<div class="media-zoom">
  <div class="media">
    <span class="krd-pointer zoom-hover" on:click={popupToggle} on:keydown={popupToggle}>
      <i class="fas fa-search" />
      <Media {chainId} {address} {tokenID} mode="preview" />
    </span>
  </div>
</div>

<!-- Modal Zoom -->
{#if popupOpen}
  <div id="zoom" class="modal-window" transition:fade>
    <div use:clickOutside={popupToggle}>
      <div class="modal-content">
        <span on:click={popupToggle} on:keydown={popupToggle} title="Close" class="modal-close krd-pointer">
          <i class="fa fa-times" />
        </span>
        <div class="modal-body">
          <Media {chainId} {address} {tokenID} mode="preview" small={false} />
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

  .media {
    width: 100%;
  }

  .media-zoom .media {
    position: relative;
    max-height: calc(33vh - 40px);
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
