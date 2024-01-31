<script lang="ts">
  import { getContext } from "svelte";
  import type { Writable } from "svelte/store";

  import MediaImage from "./MediaImage.svelte";
  /////////////////////////////////////////////////
  //  <DisplayAudio {src} {tokenID} {animation_url} {mode}? {alt}? {paused}? />
  // Display a player audio with its cover image according to its entering parameters
  /////////////////////////////////////////////////
  export let src: string;
  export let tokenID: string | undefined = undefined;
  export let animation_url: string;
  export let mode: string = "line";
  export let alt: string = "Cover image";
  export let paused: boolean = true;

  let toPlayTokenID: Writable<string> = getContext("toPlayTokenID");

  const togglePlayAudio = () => {
    paused = !paused;
    if (toPlayTokenID) {
      $toPlayTokenID = $toPlayTokenID !== tokenID ? tokenID : "";
    }
  };

  $: if (toPlayTokenID && $toPlayTokenID !== tokenID) paused = true;
  $: mode && resetToPlayTokenID();
  const resetToPlayTokenID = () => {
    if (toPlayTokenID) $toPlayTokenID = "";
  };
</script>

<div class="audio-cover-image">
  <MediaImage {src} {alt} />
</div>

{#if mode == "zoom"}
  <audio class="kre-zoom-audio" controls autoplay src={animation_url}>
    Your browser does not support the
    <code>audio</code> element.
  </audio>
{:else}
  <!-- <audio controls preload="none" bind:this={player} src={animation_url}> -->
  <audio preload="none" bind:paused src={animation_url}>
    <!-- <audio controls preload="none" src={animation_url}> -->
    <track kind="captions" />
    Your browser does not support the
    <code>audio</code> element.
  </audio>
  <button
    on:click|stopPropagation={togglePlayAudio}
    class="kre-play-media-button {mode === 'line' && 'kre-play-media-line-button'}"
  >
    <i class="fa {paused ? 'fa-play-circle' : 'fa-pause-circle'} video-play-icon" />
  </button>
{/if}

<style>
  .kre-play-media-button {
    position: absolute;
    bottom: 2%;
    right: 2%;
    background-color: transparent;
    color: white;
    border: none;
    font-size: 2.7rem;
  }

  .kre-play-media-button i {
    position: absolute;
    bottom: 0;
    right: 0;
    background-color: lightgray;
    border-radius: 50%;
    cursor: pointer;
  }

  .kre-play-media-line-button {
    top: 65px;
    left: 35px;
    bottom: unset;
    width: 2.3rem;
    font-size: 2.3rem;
  }

  .kre-play-media-line-button i {
    border: 1px solid lightgray;
  }

  /* Specific for audio */
  audio::-webkit-media-controls-enclosure {
    border-radius: 6px;
    background-color: rgba(0, 0, 0, 0.5);
  }

  audio::-webkit-media-controls-panel {
    filter: invert(100%);
  }

  .audio-cover-image {
    width: 100%;
    height: 100%;
  }

  .kre-zoom-audio {
    width: 50%;
    position: absolute;
    bottom: 60px;
    left: 50%;
    transform: translate(-50%, 0);
  }

  /* @supports (-moz-appearance: none) {
    .audio-cover-image:not(.audioDeployed) + audio {
      padding: 0px 0 7px 0;
      background-color: rgba(0, 0, 0, 1);
    }
  } */
</style>
