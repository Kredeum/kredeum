<script lang="ts">
  import DisplayImage from "./DisplayImage.svelte";
  import DisplayVideo from "./DisplayVideo.svelte";

  export let mediaSrc: string;
  export let index: number;
  export let mediaType: string;
  export let alt: string = mediaType;
  export let displayMode: string;

  let small: string = "preview" === displayMode ? "full" : "small";
  let media: string = "list" === displayMode ? "media-small" : "media-grid";
  let gridScale: string = "grid" === displayMode ? " a-simul-cursor" : "";
</script>

<div id="media-{small}-{index}" class="media {media} media-{mediaType}{gridScale}">
  {#if "image" === mediaType}
    <DisplayImage {mediaSrc} {alt} />
  {:else if "video" === mediaType}
    <DisplayVideo {mediaSrc} small={small === "small"} />
  {/if}
</div>
