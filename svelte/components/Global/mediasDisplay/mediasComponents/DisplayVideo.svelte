<script lang="ts">
  import { getContext } from "svelte";
  import { Writable } from "svelte/store";

  /////////////////////////////////////////////////
  //  <DisplayVideo {mediaSrc} {displayMode}? {index}? {paused}? {small}? />
  // Display a Video according to its entering parameters
  /////////////////////////////////////////////////
  export let mediaSrc: string;
  export let displayMode: string = "list";
  export let index: number = undefined;
  export let paused: boolean = true;
  export let small: boolean = false;

  let toPlayIndex: Writable<number> = getContext("toPlayIndex");

  $: $toPlayIndex && index && handleChange();

  const handleChange = async (): Promise<void> => {
    paused = $toPlayIndex !== index;
  };

  const playVideo = () => {
    paused = !paused;
    if ($toPlayIndex !== index) {
      $toPlayIndex = index;
    } else {
      $toPlayIndex = undefined;
    }
  };
</script>

{#if small}
  {#if "grid" === displayMode}
    <video
      autoplay={false}
      src={mediaSrc}
      preload="metadata"
      loop
      playsinline
      style="border-radius: initial;"
      bind:paused
    >
      <track kind="captions" />
    </video>
    <button on:click={playVideo} class="video-play-button">
      <i class="fa fa-play-circle video-play-icon {paused ? 'visible' : ''}" />
      <i class="fa fa-pause-circle video-play-icon {paused ? '' : 'visible'}" />
    </button>
  {:else if "list" === displayMode}
    <!-- svelte-ignore a11y-media-has-caption -->
    <video autoplay={false} playsinline style="border-radius: initial;">
      <source src={mediaSrc} type="video/mp4" /></video
    >
  {:else}
    <!-- svelte-ignore a11y-media-has-caption -->
    <video autoplay={true} preload="metadata" loop playsinline muted style="border-radius: initial;">
      <source src={mediaSrc} type="video/mp4" /></video
    >
  {/if}
{:else}
  <!-- svelte-ignore a11y-media-has-caption -->
  <video
    autoplay={true}
    controls
    controlslist="nodownload"
    loop
    playsinline
    preload="metadata"
    style="border-radius: initial;"
  >
    <source src={mediaSrc} type="video/mp4" /></video
  >
{/if}

<style lang="scss">
  video {
    & + .video-play-button {
      position: absolute;
      bottom: 2%;
      right: 1%;
      background-color: transparent;
      color: white;
      border: none;
      font-size: 4rem;

      i {
        position: absolute;
        bottom: 0;
        right: 1%;
        background-color: lightgray;
        border-radius: 50%;
        visibility: hidden;

        &.visible {
          visibility: visible;
        }
      }
    }
  }
</style>
