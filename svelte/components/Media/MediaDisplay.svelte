<script lang="ts">
  import MediaDisplayImage from "./MediaDisplayImage.svelte";
  import MediaDisplayVideo from "./MediaDisplayVideo.svelte";
  import MediaDisplayAudio from "./MediaDisplayAudio.svelte";
  import { nftMediaAlt, nftMediaAnimationUrl, nftMediaContentType, nftMediaSrc } from "@helpers/nft";
  import { nftStore } from "@stores/nft/nft";

  /////////////////////////////////////////////////
  //  <MediaDisplay {chainId} {address} {tokenID} {mode}? {small}? {alt}? />
  // Display a media according to its type and entering parameters
  /////////////////////////////////////////////////
  export let chainId: number;
  export let address: string;
  export let tokenID: string;
  /////////////////////////////////////////////////
  export let mode: string = "list";
  export let small: boolean = true;
  /////////////////////////////////////////////////
  $: nft = nftStore.getOne(chainId, address, tokenID);
  /////////////////////////////////////////////////

  let cssSmall = small ? "small" : "full";
  let cssMedia = "list" === mode ? "media-small" : "media-grid";
  let gridScale = "grid" === mode ? " a-simul-cursor" : "";
</script>

<div id="media-{cssSmall}-{tokenID}" class="media {cssSmall} {cssMedia} media-{nftMediaContentType($nft)}{gridScale}">
  {#if nftMediaAnimationUrl($nft)}
    <MediaDisplayAudio
      animation_url={nftMediaAnimationUrl($nft)}
      src={nftMediaSrc($nft)}
      alt={nftMediaAlt($nft)}
      {mode}
      {tokenID}
      {small}
    />
  {:else if nftMediaContentType($nft) === "image"}
    <MediaDisplayImage src={nftMediaSrc($nft)} alt={nftMediaAlt($nft)} />
  {:else if nftMediaContentType($nft) === "video"}
    <MediaDisplayVideo src={nftMediaSrc($nft)} {mode} {tokenID} {small} />
  {/if}
</div>

<style>
  .media {
    width: 100%;
  }

  :global(.media:not(.full) img, .media:not(.full) video) {
    max-height: calc(33vh - 40px);
  }
</style>
