<script lang="ts">
  import MediaImage from "./MediaImage.svelte";
  import MediaVideo from "./MediaVideo.svelte";
  import MediaAudio from "./MediaAudio.svelte";
  import { nftMediaAlt, nftMediaAnimationUrl, nftMediaContentType, nftMediaSrc } from "@lib/nft/nft";
  import { nftStore } from "@stores/nft/nft";

  /////////////////////////////////////////////////
  //  <Media {chainId} {address} {tokenID} {mode}? {small}? {alt}? />
  // Display a media according to its type and entering parameters
  /////////////////////////////////////////////////
  export let chainId: number;
  export let address: string;
  export let tokenID: string;
  export let mode: string = undefined;
  /////////////////////////////////////////////////
  $: nft = nftStore(chainId, address, tokenID);
  /////////////////////////////////////////////////

  let cssMedia = mode === "line" ? "media-small" : mode === "zoom" ? "" : "media-grid";
  let gridScale = mode.startsWith("grid") ? " a-simul-cursor" : "";
</script>

<div id="media-{mode}-{tokenID}" class="media {cssMedia} media-{nftMediaContentType($nft)}{gridScale}">
  {#if nftMediaAnimationUrl($nft)}
    <MediaAudio
      animation_url={nftMediaAnimationUrl($nft)}
      src={nftMediaSrc($nft)}
      alt={nftMediaAlt($nft)}
      {mode}
      {tokenID}
    />
  {:else if nftMediaContentType($nft) === "image"}
    <MediaImage src={nftMediaSrc($nft)} alt={nftMediaAlt($nft)} />
  {:else if nftMediaContentType($nft) === "video"}
    <MediaVideo src={nftMediaSrc($nft)} {mode} {tokenID} />
  {/if}
</div>

<style>
  .media {
    width: 100%;
  }

  .media-grid {
    aspect-ratio: 1;
  }

  /* :global(.media:not(.full) img, .media:not(.full) video) {
    max-height: calc(33vh - 40px);
  } */
</style>
