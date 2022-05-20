<script lang="ts">
  import { NftType } from "lib/ktypes";

  import { nftGetImageLink } from "lib/knft-get-metadata";

  import MediaPreview from "./mediasComponents/MediaPreview.svelte";
  import DisplayTypedMedia from "./mediasComponents/DisplayTypedMedia.svelte";

  /////////////////////////////////////////////////
  //  <MediasDisplayer {nft} {index} {displayMode}? />
  // Determin type of media and Display correct component according to the entering parameters of {displayMode}
  /////////////////////////////////////////////////
  export let nft: NftType;
  export let index: number;
  export let displayMode: { target: string; small: boolean } = { target: "preview", small: true };

  let mediaType: string = "image";
  // let mediaSubtype: string = "jpeg";

  let mediaSrc: string = "";
  let alt: string = nft?.name || mediaType;

  $: mediaContentType = nft.contentType?.split("/");
  $: mediaType = mediaContentType[0];
  // $: mediaSubtype = mediaContentType[1];
  $: mediaSrc = nftGetImageLink(nft);
</script>

{#if "preview" === displayMode.target}
  <MediaPreview {mediaSrc} {index} {mediaType} {displayMode} {alt} />
{:else}
  <DisplayTypedMedia {mediaSrc} {index} {mediaType} {displayMode} {alt} />
{/if}
