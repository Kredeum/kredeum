<script lang="ts">
  import { NftType } from "lib/ktypes";

  import { nftGetImageLink } from "lib/knft-get-metadata";

  import MediaPreview from "./mediasComponents/MediaPreview.svelte";
  import DisplayTypedMedia from "./mediasComponents/DisplayTypedMedia.svelte";

  export let nft: NftType;
  export let index: number;
  export let displayMode: string = "preview";

  let mediaType: string = "image";
  // let mediaSubtype: string = "jpeg";

  let mediaSrc: string = "";
  let alt: string = nft?.name || mediaType;

  $: mediaContentType = nft.contentType?.split("/");
  $: mediaType = mediaContentType[0];
  // $: mediaSubtype = mediaContentType[1];
  $: mediaSrc = nftGetImageLink(nft);
</script>

{#if "preview" === displayMode}
  <MediaPreview {mediaSrc} {index} {mediaType} {alt} {displayMode} />
{:else}
  <DisplayTypedMedia {mediaSrc} {index} {mediaType} {alt} {displayMode} />
{/if}
