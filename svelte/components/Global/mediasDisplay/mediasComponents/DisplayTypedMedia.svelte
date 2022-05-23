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
  export let displayMode: { target: string; small: boolean };
  export let alt: string = mediaType;
  export let paused: boolean = true;

  let small: string = displayMode.small ? "small" : "full";
  let media: string = "list" === displayMode.target ? "media-small" : "media-grid";
  let gridScale: string = "grid" === displayMode.target ? " a-simul-cursor" : "";
</script>

<div id="media-{small}-{index}" class="media {media} media-{mediaType}{gridScale}">
  {#if "image" === mediaType}
    <DisplayImage {mediaSrc} {alt} />
  {:else if "video" === mediaType}
    <DisplayVideo {mediaSrc} small={displayMode.small} options={{ mode: displayMode.target, paused }} />
  {/if}
</div>
