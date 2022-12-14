<script lang="ts">
  import { getContext } from "svelte";
  import { Writable } from "svelte/store";

  /////////////////////////////////////////////////
  //  <MediaDisplayVideo {mediaSrc} {tokenID}? {displayMode}? {paused}? {small}? {controls}? {muted}? />
  // Display a Video according to its entering parameters
  /////////////////////////////////////////////////
  export let mediaSrc: string;
  export let tokenID: string = undefined;
  export let displayMode: string = "list";
  export let paused: boolean = true;
  export let small: boolean = false;
  export let controls: boolean = false;
  export let muted: boolean = false;

  let toPlayTokenID: Writable<string> = getContext("toPlayTokenID");
  $: paused = $toPlayTokenID !== tokenID;
  const playVideo = () => {
    paused = !paused;
    $toPlayTokenID = $toPlayTokenID !== tokenID ? tokenID : "";
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
      <i class="fa {paused ? 'fa-play-circle' : 'fa-pause-circle'} video-play-icon" />
    </button>
  {:else if "list" === displayMode}
    <!-- svelte-ignore a11y-media-has-caption -->
    <video autoplay={false} playsinline style="border-radius: initial;" {controls} {muted}>
      <source src={mediaSrc} type="video/mp4" /></video
    >
  {:else}
    <!-- svelte-ignore a11y-media-has-caption -->
    <video autoplay={true} preload="metadata" controls loop playsinline muted style="border-radius: initial;">
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

<style>
  .video-play-button {
    position: absolute;
    bottom: 2%;
    right: 2%;
    background-color: transparent;
    color: white;
    border: none;
    font-size: 4rem;
  }

  .video-play-button i {
    position: absolute;
    bottom: 0;
    right: 0;
    background-color: lightgray;
    border-radius: 50%;
  }
</style>
