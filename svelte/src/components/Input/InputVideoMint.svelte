<script lang="ts">
  import { SUPPORTED_MEDIATYPES } from "@kredeum/svelte/src/helpers/mediaTypes";

  import MediaVideo from "../Media/MediaVideo.svelte";

  ////////////////////////////////////////////////////////////////
  //  <InputVideoMint {videoFile} {video} />
  // Upload video file for Mint video
  ////////////////////////////////////////////////////////////////
  export let videoFile: File | undefined = undefined;
  export let video: string;
  ////////////////////////////////////////////////////////////////

  let files: FileList | undefined = undefined;

  const fileload = () => {
    videoFile = undefined;

    if (files) {
      let reader = new FileReader();
      reader.readAsDataURL(files[0]);
      reader.onload = (e) => {
        video = e.target?.result?.toString() || "";
      };

      videoFile = files[0];
    }
  };

  const resetFileVideo = () => {
    files = undefined;
    videoFile = undefined;
    video = "";
  };
</script>

<div class="section">
  <div class="titre">NFT video file</div>
  <div class="box-file">
    {#if video}
      <div class="kre-video-mint">
        <MediaVideo src={video} mode="line" />

        <span role="button" tabindex="0" class="kre-delete-file" on:click={resetFileVideo} on:keydown={resetFileVideo}
          ><i class="fa fa-trash" aria-hidden="true" /></span
        >
      </div>
    {:else}
      <input
        type="file"
        id="videoFile"
        name="videoFile"
        bind:files
        on:change={fileload}
        accept={SUPPORTED_MEDIATYPES.video.format}
      />
    {/if}
  </div>
  {#if !video}
    <div class="kre-input-helper">{SUPPORTED_MEDIATYPES.video.label}</div>
  {/if}
</div>

<style>
  .box-file {
    position: relative;
    border-radius: 34px;
  }

  .kre-delete-file {
    background-color: #192146;
    border-radius: 50%;
    position: absolute;
    right: 25px;
    top: 50%;
    transform: translateY(-50%);
    width: 35px;
    height: 35px;
    display: flex;
    cursor: pointer;
  }

  .kre-delete-file i {
    color: white;
    margin: auto;
  }

  .kre-video-mint {
    width: 33%;
    overflow: hidden;
    height: fit-content;
  }

  :global(.kre-video-mint video) {
    border-radius: 15px !important;
  }
</style>
