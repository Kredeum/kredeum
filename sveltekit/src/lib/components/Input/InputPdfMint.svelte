<script lang="ts">
  import { SUPPORTED_MEDIATYPES } from "@kredeum/sveltekit/src/lib/helpers/mediaTypes";

  ////////////////////////////////////////////////////////////////
  //  <InputPdfMint {pdfFile} {pdf} />
  // Upload pdf file for Mint PDF
  ////////////////////////////////////////////////////////////////
  export let pdfFile: File;
  export let pdf: string;
  ////////////////////////////////////////////////////////////////

  let files: FileList;

  const fileload = () => {
    pdfFile = null;

    if (files) {
      let reader = new FileReader();
      reader.readAsDataURL(files[0]);
      reader.onload = (e) => {
        pdf = e.target.result.toString();
      };

      pdfFile = files[0];
    }
  };

  const resetFilePdf = () => {
    files = null;
    pdfFile = null;
    pdf = "";
  };
</script>

<div class="section">
  <div class="titre">NFT PDF file</div>
  <div class="box-file">
    {#if pdf}
      <div class="media media-photo">
        TODO Display PDF Preview
        <span class="kre-delete-file" on:click={resetFilePdf} on:keydown={resetFilePdf}
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
        accept={SUPPORTED_MEDIATYPES.pdf.format}
      />
    {/if}
  </div>
  {#if !pdf}
    <div class="kre-input-helper">{SUPPORTED_MEDIATYPES.pdf.label}</div>
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
