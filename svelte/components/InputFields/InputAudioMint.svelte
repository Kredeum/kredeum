<script lang="ts">
  import { SUPPORTED_MEDIATYPES } from "@helpers/mediaTypes";

  ////////////////////////////////////////////////////////////////
  //  <InputAudioMint {audioFile} {audio} />
  // Upload audi file for Mint audio
  ////////////////////////////////////////////////////////////////
  export let audioFile: File;
  export let audio: string;
  ////////////////////////////////////////////////////////////////

  let files: FileList;

  const fileload = () => {
    audioFile = null;

    if (files) {
      let reader = new FileReader();
      reader.readAsDataURL(files[0]);
      reader.onload = (e) => {
        audio = e.target.result.toString();
      };

      audioFile = files[0];
    }
  };

  const resetFileAudio = () => {
    files = null;
    audioFile = null;
    audio = "";
  };
</script>

<div class="section">
  <div class="titre">NFT audio file</div>
  <div class="box-file">
    {#if audio}
      <div class="media media-photo">
        <audio controls src={audio}>
          Your browser does not support the
          <code>audio</code> element.
        </audio>
        <span class="kre-delete-file" on:click={resetFileAudio} on:keydown={resetFileAudio}
          ><i class="fa fa-trash" aria-hidden="true" /></span
        >
      </div>
    {:else}
      <input
        type="file"
        id="file"
        name="file"
        bind:files
        on:change={fileload}
        accept={SUPPORTED_MEDIATYPES.audio.format}
      />
    {/if}
  </div>
  {#if !audio}
    <div class="kre-input-helper">{SUPPORTED_MEDIATYPES.audio.label}</div>
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
</style>
