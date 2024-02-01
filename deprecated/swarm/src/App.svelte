<script lang="ts">
  import type { Data, FileData } from "@ethersphere/bee-js";

  import { onMount } from "svelte";

  import { uploadFile, downloadFile } from "./testbeejs";

  export let name: string;

  let uploadedFileReference: string =
    // "74e785efff856afe89911cae8cbc51125d30c00e1a06396fbfb235d0b3d84433";
    // "36899577edc82833b0b90a5fc9f58607e466a76a0ce86746ce8d2f71f5b484a7";
    // "0e6e400b44e75bfcf8053df1788b56023abe03063f321c64ce9d39f0228673fb";
    // "c89f75b1de77d004ebd31a9b5bdf142462a6bfd8a5c10ade73513d03b9bb77c8";
    "d3c1e2faf179138a3ccabec3d162d4a6e436106b08bda282fb4acb57a3454277";
  // "3ad6588e0d1bdf183f65ca1cbd0b3e587e778162b05d4632a4cbdcd1285b55cf";
  // "64a85b2b6f8b03a56ccb2027bd06b3c7b06fe7ebb6057e23913fb7361b85e920";
  // "64a85b2b6f8b03a56ccb2027bd06b3c7b06fe7ebb6057e23913fb7361b85e920";
  // "bbf7b592eb7e54c52d35666456abfcbb8d50a71d1107258f38b1d0678027d551";
  // "515cdb766f1c135eaacbf3a5f974412eae41445ae38e99e4733fa288b6360c34";
  // "dcb36325019f86ffaffb35ce681f58f01fee1086bcabecc6968c6b00231a7bb4";

  let swarmData: FileData<Data>;

  let files: FileList;
  let imagePath;
  let fileName;
  let fileSize;
  let contentType;

  let imageContainer;
  let image = new Image(300, 200);

  let uploadedRef;

  onMount(async () => {
    swarmData = await downloadFile(uploadedFileReference);
  });

  $: resetDownloadedFile(uploadedFileReference);

  const resetDownloadedFile = async (uploadedFileReference) => {
    swarmData = await downloadFile(uploadedFileReference);
    files = undefined;
    imagePath = "";
    fileName = undefined;
    contentType = undefined;
    fileSize = undefined;
  };

  $: if (swarmData)
    console.log(
      "🚀 ~ file: App.svelte ~ line 21 ~ onMount ~ swarmData",
      swarmData
    );

  $: if (swarmData?.data.buffer) {
    image.src = URL.createObjectURL(
      new Blob([swarmData.data.buffer], { type: swarmData.contentType })
    );

    imageContainer.appendChild(image);

    console.log("🚀 ~ file: App.svelte ~ line 33 ~ image", image);
  }

  //////////////////////////////////////////////

  const fileload = () => {
    if (files) {
      let reader = new FileReader();
      reader.readAsDataURL(files[0]);
      reader.onload = (e) => {
        imagePath = e.target.result.toString();
        contentType = files[0].type;
        fileSize = files[0].size;
        console.log(
          "🚀 ~ file: App.svelte ~ line 77 ~ fileload ~ files[0]",
          files[0]
        );
      };
    }
  };

  $: if (files) console.log("files[0].type", files[0].type);

  const fileupload = async () => {
    if (files && contentType && fileSize) {
      uploadedRef = await uploadFile(
        files[0],
        fileName || files[0].name,
        contentType,
        fileSize
      );
      uploadedFileReference = uploadedRef;
    }
    console.log(
      "🚀 ~ file: App.svelte ~ line 85 ~ fileupload ~ contentType",
      contentType
    );
  };

  $: console.log("uploadedRef :", uploadedRef);

  ///////////////////////////////////////////////
</script>

<main>
  <header>
    <h1>Hello {name}!</h1>
  </header>
  <section>
    <div>
      {#if imagePath}
        <img src={imagePath} alt="" />
      {/if}
    </div>

    <input
      type="text"
      placeholder="File name"
      bind:value={fileName}
      id="fileName"
    /><br />

    <input type="file" id="file" name="file" bind:files on:change={fileload} />
    <br />

    <button on:click={fileupload}>Upload</button>
  </section>
  <section>
    {#if image}
      <div bind:this={imageContainer} />
    {/if}
  </section>
</main>

<style>
  main {
    text-align: center;
    padding: 1em;
    max-width: 240px;
    margin: 0 auto;
  }

  section {
    max-height: 300px;
  }

  section div {
    max-height: inherit;
  }

  section img {
    max-height: 220px;
  }

  h1 {
    color: #ff3e00;
    text-transform: uppercase;
    font-size: 4em;
    font-weight: 100;
  }

  @media (min-width: 640px) {
    main {
      max-width: none;
    }
  }
</style>
