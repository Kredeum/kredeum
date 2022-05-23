<script lang="ts">
  import DisplayImage from "./DisplayImage.svelte";
  import DisplayVideo from "./DisplayVideo.svelte";

  /////////////////////////////////////////////////
  //  <DisplayTypedMedia {mediaSrc} {index} {mediaType} {displayMode} {alt}? />
  // Display a media according to its type and entering parameters
  /////////////////////////////////////////////////
  export let mediaSrc: string;
  export let index: number;
  export let mediaType: string;
  export let displayMode: { target: string; small: boolean } = { target: "list", small: false };
  export let alt: string = mediaType;

  let cssSmall: string = displayMode.small ? "small" : "full";
  let cssMedia: string = "list" === displayMode.target ? "media-small" : "media-grid";
  let gridScale: string = "grid" === displayMode.target ? " a-simul-cursor" : "";
</script>

<div id="media-{cssSmall}-{index}" class="media {cssMedia} media-{mediaType}{gridScale}">
  {#if "image" === mediaType}
    <DisplayImage {mediaSrc} {alt} />
  {:else if "video" === mediaType}
    <DisplayVideo {mediaSrc} mode={displayMode.target} small={displayMode.small} {index} />
  {/if}
</div>
