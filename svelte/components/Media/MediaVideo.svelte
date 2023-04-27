<script lang="ts">
  import { getContext } from "svelte";
  import type { Writable } from "svelte/store";

  /////////////////////////////////////////////////
  //  <MediaVideo {src} {tokenID}? {mode}? {paused}? />
  // Display a Video according to its entering parameters
  /////////////////////////////////////////////////
  export let src: string;
  export let tokenID: string = undefined;
  export let mode: string = undefined;
  export let paused: boolean = true;

  let toPlayTokenID: Writable<string> = getContext("toPlayTokenID");
  const togglePlayVideo = () => {
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

{#if mode == "zoom"}
  <!-- svelte-ignore a11y-media-has-caption -->
  <video autoplay={true} preload="metadata" controls loop playsinline style="border-radius: initial;">
    <source {src} type="video/mp4" /></video
  >
{:else}
  <video
    {src}
    autoplay={mode === "detail"}
    muted={mode === "detail"}
    preload="metadata"
    loop
    playsinline
    style="border-radius: initial;"
    bind:paused
  >
    <track kind="captions" />
  </video>
  <button
    on:click|stopPropagation={togglePlayVideo}
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
</style>
