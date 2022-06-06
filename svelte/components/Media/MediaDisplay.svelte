<script lang="ts">
  import { NftType } from "lib/ktypes";

  import MediaDisplayImage from "./MediaDisplayImage.svelte";
  import MediaDisplayVideo from "./MediaDisplayVideo.svelte";
  import MediaDisplayAudio from "./MediaDisplayAudio.svelte";

  /////////////////////////////////////////////////
  //  <MediaDisplay {nft} {index} {displayMode}? {small}? {alt}? />
  // Display a media according to its type and entering parameters
  /////////////////////////////////////////////////
  export let nft: NftType;

  // export let mediaSrc: string;
  export let index: number;
  // export let mediaType: string;
  export let displayMode: string = "list";
  export let small: boolean = true;
  export let alt: string = nft.name || "media";

  let cssSmall: string = small ? "small" : "full";
  let cssMedia: string = "list" === displayMode ? "media-small" : "media-grid";
  let gridScale: string = "grid" === displayMode ? " a-simul-cursor" : "";

  let mediaType: string = "image";
  // let mediaSubtype: string = "jpeg";
  let mediaSrc: string = "";

  $: nft && handleChange();
  const handleChange = (): void => {
    const mediaContentType = nft.contentType?.split("/");
    mediaType = mediaContentType[0];
    // mediaSubtype = mediaContentType[1];
    mediaSrc = nft.image;
    alt = mediaType;
  };
</script>

<div id="media-{cssSmall}-{index}" class="media {cssMedia} media-{mediaType}{gridScale}">
  {#if nft?.animation_url}
    <MediaDisplayAudio {mediaSrc} animation_url={nft?.animation_url} {displayMode} {alt} {index} {small} />
  {:else if "image" === mediaType}
    <MediaDisplayImage {mediaSrc} {alt} />
  {:else if "video" === mediaType}
    <MediaDisplayVideo {mediaSrc} {displayMode} {index} {small} />
  {/if}
</div>

<style>
  .media {
    width: 100%;
  }
</style>
