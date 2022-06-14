<script lang="ts">
  import { NftType } from "lib/ktypes";
  import { nftGetImageLink } from "lib/knft-get-metadata";

  import MediaDisplayImage from "./MediaDisplayImage.svelte";
  import MediaDisplayVideo from "./MediaDisplayVideo.svelte";
  import MediaDisplayAudio from "./MediaDisplayAudio.svelte";

  /////////////////////////////////////////////////
  //  <MediaDisplay {nft} {displayMode}? {small}? {alt}? />
  // Display a media according to its type and entering parameters
  /////////////////////////////////////////////////
  export let nft: NftType;
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
    mediaType = mediaContentType?.[0];
    if (mediaType === "text") mediaType = "image";
    // mediaSubtype = mediaContentType[1];
    mediaSrc = nftGetImageLink(nft);
    alt = mediaType;
  };
</script>

<div id="media-{cssSmall}-{nft?.tokenID}" class="media {cssMedia} media-{mediaType}{gridScale}">
  {#if nft?.animation_url}
    <MediaDisplayAudio
      {mediaSrc}
      animation_url={nft?.animation_url}
      {displayMode}
      {alt}
      tokenID={nft.tokenID}
      {small}
    />
  {:else if "image" === mediaType}
    <MediaDisplayImage {mediaSrc} {alt} />
  {:else if "video" === mediaType}
    <MediaDisplayVideo {mediaSrc} {displayMode} tokenID={nft.tokenID} {small} />
  {/if}
</div>

<style>
  .media {
    width: 100%;
  }
</style>
