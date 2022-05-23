<script lang="ts">
  import DisplayImage from "./DisplayImage.svelte";
  import DisplayVideo from "./DisplayVideo.svelte";

  /////////////////////////////////////////////////
  //  <DisplayTypedMedia {mediaSrc} {index} {mediaType} {displayMode}? {small}? {alt}? />
  // Display a media according to its type and entering parameters
  /////////////////////////////////////////////////
  export let mediaSrc: string;
  export let index: number;
  export let mediaType: string;
  export let displayMode: string = "list";
  export let small: boolean = true;
  export let alt: string = mediaType;

  let cssSmall: string = small ? "small" : "full";
  let cssMedia: string = "list" === displayMode ? "media-small" : "media-grid";
  let gridScale: string = "grid" === displayMode ? " a-simul-cursor" : "";
</script>

<div id="media-{cssSmall}-{index}" class="media {cssMedia} media-{mediaType}{gridScale}">
  {#if "image" === mediaType}
    <DisplayImage {mediaSrc} {alt} />
  {:else if "video" === mediaType}
    <DisplayVideo {mediaSrc} {displayMode} {index} {small} />
  {/if}
</div>
