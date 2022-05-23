<script lang="ts">
  import { NftType } from "lib/ktypes";

  import { nftGetImageLink } from "lib/knft-get-metadata";

  import MediaPreview from "./mediasComponents/MediaPreview.svelte";
  import DisplayTypedMedia from "./mediasComponents/DisplayTypedMedia.svelte";

  /////////////////////////////////////////////////
  //  <MediasDisplayer {nft} {index} {displayMode}? {alt}? />
  // Determin type of media and Display correct component according to the entering parameters of {displayMode}
  /////////////////////////////////////////////////
  export let nft: NftType;
  export let index: number;
  export let displayMode: string = "list";
  export let alt: string = nft?.name;

  let mediaType: string = "image";
  // let mediaSubtype: string = "jpeg";
  let mediaSrc: string = "";

  $: nft && handleChange();
  const handleChange = async (): Promise<void> => {
    const mediaContentType = nft.contentType?.split("/");
    mediaType = mediaContentType[0];
    // mediaSubtype = mediaContentType[1];
    mediaSrc = nftGetImageLink(nft);
  };
</script>

{#if "preview" === displayMode}
  <MediaPreview {mediaSrc} {index} {mediaType} {alt} />
{:else}
  <DisplayTypedMedia {mediaSrc} {index} {mediaType} {displayMode} {alt} />
{/if}
