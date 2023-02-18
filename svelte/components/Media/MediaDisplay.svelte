<script lang="ts">

  import MediaDisplayImage from "./MediaDisplayImage.svelte";
  import MediaDisplayVideo from "./MediaDisplayVideo.svelte";
  import MediaDisplayAudio from "./MediaDisplayAudio.svelte";
  import { nftMediaAlt, nftMediaAnimationUrl, nftMediaContentType, nftMediaSrc } from "@helpers/nft";
  import { nftStore } from "@stores/nft/nft";

  /////////////////////////////////////////////////
  //  <MediaDisplay {chainId} {address} {tokenID} {displayMode}? {small}? {alt}? />
  // Display a media according to its type and entering parameters
  /////////////////////////////////////////////////
  export let chainId: number;
  export let address: string;
  export let tokenID: string;
  /////////////////////////////////////////////////
  export let displayMode: string = "list";
  export let small: boolean = true;
  /////////////////////////////////////////////////
  $: nft = nftStore.getOne(chainId, address, tokenID);
  /////////////////////////////////////////////////

  let cssSmall = small ? "small" : "full";
  let cssMedia = "list" === displayMode ? "media-small" : "media-grid";
  let gridScale = "grid" === displayMode ? " a-simul-cursor" : "";
</script>

<div id="media-{cssSmall}-{tokenID}" class="media {cssSmall} {cssMedia} media-{nftMediaContentType($nft)}{gridScale}">
  {#if nftMediaAnimationUrl($nft)}
    <MediaDisplayAudio
      animation_url={nftMediaAnimationUrl($nft)}
      mediaSrc={nftMediaSrc($nft)}
      alt={nftMediaAlt($nft)}
      {displayMode}
      {tokenID}
      {small}
    />
  {:else if nftMediaContentType($nft) === "image"}
    <MediaDisplayImage mediaSrc={nftMediaSrc($nft)} alt={nftMediaAlt($nft)} />
  {:else if nftMediaContentType($nft) === "video"}
    <MediaDisplayVideo mediaSrc={nftMediaSrc($nft)} {displayMode} {tokenID} {small} />
  {/if}
</div>

<style>
  .media {
    width: 100%;
  }

  :global(.media:not(.full) img, .media:not(.full) video) {
    max-height: calc(19vw - 40px);
  }
</style>
