<script lang="ts">
  import { getContext } from "svelte";
  import { Writable } from "svelte/store";

  import MediaDisplayImage from "./MediaDisplayImage.svelte";
  /////////////////////////////////////////////////
  //  <DisplayAudio {mediaSrc} {animation_url} {displayMode} {alt} {index} {small} />
  // Display a player audio with its cover image according to its entering parameters
  /////////////////////////////////////////////////
  export let mediaSrc: string;
  export let animation_url: string;
  export let displayMode: string = "list";
  export let alt: string = "Cover image";
  export let index: number = -1;
  export let small: boolean = true;
  export let paused: boolean = true;
  //   export let deployed: boolean;
  //   export let height: number = undefined;

  let toPlayIndex: Writable<number> = getContext("toPlayIndex");

  $: $toPlayIndex >= 0 && handleChange();
  const handleChange = (): void => {
    paused = $toPlayIndex !== index;
  };

  const playAudio = () => {
    paused = !paused;
    if ($toPlayIndex !== index) {
      $toPlayIndex = Number(index);
    } else {
      $toPlayIndex = -1;
    }
  };
</script>

<div class="audio-cover-image {small ? '' : 'audioDeployed'}">
  <MediaDisplayImage {mediaSrc} {alt} />
  {#if small}
    {#if "list" !== displayMode}
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
  .audio-cover-image {
    position: initial;
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
    bottom: 2.6%;
    left: 2%;
    background-color: transparent;
    color: white;
    border: none;
    font-size: 3.5rem;
  }

  .krd-play-audio-button i {
    position: absolute;
    bottom: 0;
    left: 0;
    background-color: lightgray;
    border-radius: 50%;
  }
</style>
