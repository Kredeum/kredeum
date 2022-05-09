<script lang="ts">
  import { clickOutside, clickToClose } from "helpers/clickTools";

  import DisplayTypedMedia from "./DisplayTypedMedia.svelte";

  export let mediaSrc: string;
  export let index: number;
  export let mediaType: string;
  export let alt: string;
  export let displayMode: string;
</script>

<a href="#zoom">
  <i class="fas fa-search" />
  <!-- <div id="media-full-{index}" class="media media-grid media-{mediaType}"> -->
  <DisplayTypedMedia {mediaSrc} {index} {mediaType} {alt} {displayMode} />
  <!-- </div> -->
</a>

<!-- Modal Zoom -->
<div id="zoom" class="modal-window">
  <div use:clickOutside={clickToClose}>
    <div class="modal-content">
      <a href="./#" title="Close" class="modal-close"><i class="fa fa-times" /></a>
      <div class="modal-body">
        <!-- <div id="media-full-{index}" class="media media-grid media-{mediaType}"> -->
        <DisplayTypedMedia {mediaSrc} {index} {mediaType} {alt} {displayMode} />
        <!-- </div> -->
      </div>
    </div>
  </div>
</div>
