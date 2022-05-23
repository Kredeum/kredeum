<script lang="ts">
  /////////////////////////////////////////////////
  //  <DisplayVideo {mediaSrc} {small}? />
  // Display a Video according to its entering parameters
  /////////////////////////////////////////////////
  export let mediaSrc: string;
  export let small: boolean = false;
  export let options: { mode: string; paused: boolean } = { mode: "", paused: true };

  let paused: boolean = true;

  $: paused = options.paused;

  const playVideo = () => {
    paused = !paused;
  };

  console.log("🚀 ~ file: DisplayVideo.svelte ~ line 11 ~ paused", paused);
</script>

{#if small}
  {#if "grid" === options.mode}
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
