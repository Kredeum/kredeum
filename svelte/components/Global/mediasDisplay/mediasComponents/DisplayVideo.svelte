<script lang="ts">
  export let mediaSrc: string;
  export let small: boolean = false;
</script>

{#if small}
  <!-- svelte-ignore a11y-media-has-caption -->
  <video autoplay={true} preload="metadata" loop playsinline muted style="border-radius: initial;">
    <source src={mediaSrc} type="video/mp4" /></video
  >
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
