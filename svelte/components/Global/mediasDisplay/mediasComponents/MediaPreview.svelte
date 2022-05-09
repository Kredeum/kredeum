<script lang="ts">
  import { clickOutside, clickToClose } from "helpers/clickTools";
  import { fade } from "svelte/transition";

  import DisplayTypedMedia from "./DisplayTypedMedia.svelte";

  export let mediaSrc: string;
  export let index: number;
  export let mediaType: string;
  export let alt: string;
  export let displayMode: string;

  let open = false;
</script>

<a href="#zoom" on:click={() => (open = true)}>
  <i class="fas fa-search" />
  <DisplayTypedMedia {mediaSrc} {index} {mediaType} {alt} {displayMode} />
</a>

<!-- Modal Zoom -->
{#if open}
  <div id="zoom" class="modal-window" transition:fade>
    <div
      use:clickOutside={() => {
        open = false;
        clickToClose();
      }}
    >
      <div class="modal-content">
        <a href="./#" title="Close" class="modal-close"><i class="fa fa-times" /></a>
        <div class="modal-body">
          <DisplayTypedMedia {mediaSrc} {index} {mediaType} {alt} {displayMode} />
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
</style>
