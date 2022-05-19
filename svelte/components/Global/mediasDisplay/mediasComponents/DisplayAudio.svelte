<script lang="ts">
  import DisplayImage from "./DisplayImage.svelte";
  /////////////////////////////////////////////////
  //  <DisplayAudio {mediaSrc} {animation_url} {alt}? {height}? />
  // Display a Image according to its entering parameters
  /////////////////////////////////////////////////
  export let mediaSrc: string;
  export let animation_url: string;
  export let small: boolean;
  export let deployed: boolean;
  export let alt: string = "image";
  export let height: number = undefined;
</script>

<div class="audio-picture {deployed && small ? 'audioDeployed' : ''}">
  <img src={mediaSrc} {alt} height={height ? height : undefined} />
  <audio controls src={animation_url}>
    Your browser does not support the
    <code>audio</code> element.
  </audio>
</div>

<style lang="scss">
  .audio-picture {
    position: initial;
    width: 100%;
    height: 100%;

    audio {
      position: absolute;
      bottom: 0;
      left: 50%;
      transform: translateX(-50%);
    }

    &.audioDeployed {
      audio {
        transform: translate(-50%, 100%);
      }
    }
  }
</style>
