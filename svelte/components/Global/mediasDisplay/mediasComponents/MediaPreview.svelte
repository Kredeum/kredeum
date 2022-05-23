<script lang="ts">
  import { clickOutside, clickToClose } from "helpers/clickTools";
  import { fade } from "svelte/transition";

  import DisplayTypedMedia from "./DisplayTypedMedia.svelte";

  /////////////////////////////////////////////////
  //  <MediaPreview {mediaSrc} {index} {mediaType} {displayMode}? {alt}? />
  // Display a clickable preview of media opening a zoom modal with full media
  // Modal closing by clickoutside
  /////////////////////////////////////////////////
  export let mediaSrc: string;
  export let index: number;
  export let mediaType: string;
  export let displayMode: string = "preview";
  export let alt: string = mediaType;

  let open = false;
</script>

<!-- <div class="grid-detail-krd"> -->
<div class="media-zoom">
  <div class="media">
    <span class="krd-pointer" on:click={() => (open = true)}>
      <i class="fas fa-search" />
      <DisplayTypedMedia {mediaSrc} {index} {mediaType} {displayMode} {alt} />
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
        <span on:click={() => (open = false)} title="Close" class="modal-close krd-pointer"
          ><i class="fa fa-times" /></span
        >
        <div class="modal-body">
          <DisplayTypedMedia {mediaSrc} {index} {mediaType} {displayMode} small={false} {alt} />
        </div>
      </div>
    </div>
  </div>
{/if}

<style lang="scss">
  #zoom {
    visibility: visible;
    opacity: 1;
    pointer-events: auto;
  }

  .krd-pointer {
    cursor: pointer;
  }

  // .media-video {
  //   width: 100%;
  //   height: 100%;
  // }

  .media-zoom {
    .media {
      position: relative;
    }
  }

  .media-zoom .media span::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(#1e1e43, 0.7);
    opacity: 0;
    transition: all 300ms ease-in-out;
  }

  .media-zoom .media span .fas {
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

  .media-zoom .media span:hover::after,
  .media-zoom .media span:hover .fas {
    opacity: 1;
  }
</style>
