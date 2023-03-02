<script lang="ts">
  import { getContext } from "svelte";
  import type { Writable } from "svelte/store";

  import MediaDisplayImage from "./MediaDisplayImage.svelte";
  /////////////////////////////////////////////////
  //  <DisplayAudio {src} {animation_url} {mode}? {alt}? {index}? {small}? {paused}? />
  // Display a player audio with its cover image according to its entering parameters
  /////////////////////////////////////////////////
  export let src: string;
  export let tokenID: string = undefined;
  export let animation_url: string;
  export let mode: string = "list";
  export let alt: string = "Cover image";
  export let small: boolean = true;
  export let paused: boolean = true;

  let toPlayTokenID: Writable<string> = getContext("toPlayTokenID");
  $: paused = $toPlayTokenID !== tokenID;
  const playAudio = () => {
    if ("preview" !== mode) {
      $toPlayTokenID = $toPlayTokenID !== tokenID ? tokenID : "";
    }
  };
</script>

<div class="audio-cover-image {small ? '' : 'audioDeployed'}">
  <MediaDisplayImage {src} {alt} />
</div>
{#if small}
  {#if "list" === mode}
    <audio preload="none" bind:paused src={animation_url}>
      <track kind="captions" />
      Your browser does not support the
      <code>audio</code> element.
    </audio>
    <button on:click={playAudio} class="krd-play-audio-button krd-play-audio-list-button">
      <i class="fa {paused ? 'fa-play-circle' : 'fa-pause-circle'} video-play-icon" />
    </button>
  {:else}
    <!-- <audio controls preload="none" bind:this={player} src={animation_url}> -->
    <audio controls preload="none" bind:paused src={animation_url}>
      <!-- <audio controls preload="none" src={animation_url}> -->
      <track kind="captions" />
      Your browser does not support the
      <code>audio</code> element.
    </audio>
    <button on:click={playAudio} class="krd-play-audio-button">
      <i class="fa {paused ? 'fa-play-circle' : 'fa-pause-circle'} video-play-icon" />
    </button>
  {/if}
{:else}
  <audio controls autoplay src={animation_url}>
    Your browser does not support the
    <code>audio</code> element.
  </audio>
{/if}

<style>
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

  .audio-cover-image:not(.audioDeployed) + audio {
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translate(-50%, 0%);
    width: 100%;
    height: 54px;
  }

  @supports (-moz-appearance: none) {
    .audio-cover-image:not(.audioDeployed) + audio {
      padding: 0px 0 7px 0;
      background-color: rgba(0, 0, 0, 1);
    }
  }

  .audioDeployed + audio {
    transform: translate(50%, 15%);
  }

  .krd-play-audio-button {
    position: absolute;
    bottom: 9px;
    left: 0;
    background-color: transparent;
    color: white;
    border: none;
    font-size: 3.5rem;
  }

  .krd-play-audio-button i {
    position: absolute;
    bottom: 0;
    background-color: lightgray;
    border-radius: 50%;
    cursor: pointer;
  }

  .krd-play-audio-list-button {
    top: 65px;
    left: 35px;
    bottom: unset;
  }

  .krd-play-audio-list-button i {
    border: 1px solid lightgray;
  }
</style>
