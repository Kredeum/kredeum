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

  //   let toPlayIndex: Writable<number> = getContext("toPlayIndex");

  //   let player: HTMLAudioElement;
  //   $: player?.played &&
  //     console.log("🚀 ~ file: MediaDisplayAudio.svelte ~ line 26 ~ handleChange ~ paused", player?.played);

  //   $: player?.played && paused && handleChange();
  //   const handleChange = (): void => {
  //     if ($toPlayIndex !== index) {
  //       paused = true;
  //     } else {
  //       paused = false;
  //     }
  //   };

  //   const playAudio = () => {
  //     paused = !paused;
  //     if ($toPlayIndex !== index) {
  //       $toPlayIndex = Number(index);
  //     } else {
  //       $toPlayIndex = -1;
  //     }
  //   };
</script>

<div class="audio-cover-image {small ? '' : 'audioDeployed'}">
  <MediaDisplayImage {mediaSrc} {alt} />
  {#if small}
    {#if "list" !== displayMode}
      <!-- <audio controls preload="none" bind:this={player} src={animation_url}> -->
      <audio controls preload="none" src={animation_url}>
        Your browser does not support the
        <code>audio</code> element.
        <track kind="captions" />
      </audio>
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
  }

  .audioDeployed audio {
    transform: translate(50%, 15%);
  }
</style>
