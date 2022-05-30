<script lang="ts">
  import { getContext } from "svelte";
  import { Writable } from "svelte/store";

  import MediaDisplayImage from "./MediaDisplayImage.svelte";
  /////////////////////////////////////////////////
  //  <DisplayAudio {mediaSrc} {animation_url} {displayMode}? {alt}? {index}? {small}? {paused}? />
  // Display a player audio with its cover image according to its entering parameters
  /////////////////////////////////////////////////
  export let mediaSrc: string;
  export let animation_url: string;
  export let displayMode: string = "list";
  export let alt: string = "Cover image";
  export let index: number = -1;
  export let small: boolean = true;
  export let paused: boolean = true;

  let toPlayIndex: Writable<number> = getContext("toPlayIndex");

  $: $toPlayIndex >= 0 && handleChange();
  const handleChange = (): void => {
    paused = $toPlayIndex !== index;
  };

  $: $toPlayIndex === -1 && handleStopChange();
  const handleStopChange = (): void => {
    paused = true;
  };

  const playAudio = () => {
    if ("preview" !== displayMode) {
      if ($toPlayIndex !== index) {
        $toPlayIndex = Number(index);
      } else {
        $toPlayIndex = -1;
      }
    }
  };
</script>

<div class="audio-cover-image {small ? '' : 'audioDeployed'}">
  <MediaDisplayImage {mediaSrc} {alt} />
  {#if small}
    {#if "list" === displayMode}
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
</div>

<style>
  /* audio::-webkit-media-controls-panel,
  audio::-webkit-media-controls-mute-button,
  audio::-webkit-media-controls-play-button,
  audio::-webkit-media-controls-timeline-container,
  audio::-webkit-media-controls-current-time-display,
  audio::-webkit-media-controls-time-remaining-display,
  audio::-webkit-media-controls-timeline,
  audio::-webkit-media-controls-volume-slider-container,
  audio::-webkit-media-controls-volume-slider,
  audio::-webkit-media-controls-seek-back-button,
  audio::-webkit-media-controls-seek-forward-button,
  audio::-webkit-media-controls-fullscreen-button,
  audio::-webkit-media-controls-rewind-button,
  audio::-webkit-media-controls-return-to-realtime-button,
  audio::-webkit-media-controls-toggle-closed-captions-button {
     color: white !important;
    filter: invert(100%);
    background-color: white;
  }  */

  audio::-webkit-media-controls-enclosure {
    border-radius: 6px;
    background-color: rgba(0, 0, 0, 0.5);
  }

  audio::-webkit-media-controls-panel {
    /* color: white !important; */
    filter: invert(100%);
  }

  /* audio::-webkit-media-controls-mute-button {
    color: white !important;
  } */

  /* audio::-webkit-media-controls-timeline {
    color: white;
  } */

  .audio-cover-image {
    /* position: inherit; */
    /* top: 0;
    left: 0; */
    width: 100%;
    height: 100%;
  }

  .audio-cover-image:not(.audioDeployed) audio {
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translate(-50%, 0%);
    width: 100%;
  }

  .audioDeployed audio {
    transform: translate(50%, 15%);
  }

  .krd-play-audio-button {
    position: absolute;
    bottom: 12px;
    left: 2%;
    background-color: transparent;
    color: white;
    border: none;
    font-size: 2.8rem;
  }

  .krd-play-audio-button i {
    position: absolute;
    bottom: 0;
    left: 0;
    background-color: lightgray;
    border-radius: 50%;
  }

  .krd-play-audio-list-button {
    bottom: 12px;
    left: 2%;
  }
</style>
