<script lang="ts">
  import type { TransactionResponse } from "@ethersproject/abstract-provider";

  import type { NftType } from "lib/ktypes";
  import { nftMintTexts, nftMint1IpfsImage, nftMint2IpfsJson, nftMint3TxResponse, nftMint4 } from "lib/knft-mint";
  import { textShort, ipfsGatewayUrl, explorerTxUrl, explorerNftUrl, nftUrl } from "lib/kconfig";

  import { metamaskSigner } from "main/metamask";

  import CollectionList from "../Collection/CollectionList.svelte";

  /////////////////////////////////////////////////
  //  <NftMint {chainId} />
  // Display NFT
  /////////////////////////////////////////////////
  export let chainId: number;
  /////////////////////////////////////////////////

  let account: string;
  $: $metamaskSigner && handleSigner().catch(console.error);
  const handleSigner = async (): Promise<void> => {
    account = await $metamaskSigner.getAddress();
  };

  let address: string;

  $: $metamaskSigner && chainId && handleChange();
  const handleChange = async () => {
    // Get signer account
    account = await $metamaskSigner.getAddress();
  };

  let nftTitle: string = "";
  let nftDescription: string;

  let files: FileList;
  let image: string;

  let ipfsAudio: string;
  let audioImageFiles: FileList;
  let audioCover: string;
  let audioCoverMediatypes: Array<string>;

  let uploadedMediatypes: Array<string>;
  let selectedMediaType: string;

  let ipfsImage: string;
  let ipfsJson: string;
  let minting: number;
  let mintingTxResp: TransactionResponse;
  let mintedNft: NftType;
  let mintingError: string;

  const mintReset = (): void => {
    ipfsImage = null;
    ipfsJson = null;
    minting = 0;
    mintingTxResp = null;
    mintedNft = null;
    mintingError = null;
  };

  // let collectionObject: CollectionType;
  // $: {
  //   // collectionObject = collectionGetFromCache(chainId, address);
  //   // console.log("collectionObject", collectionObject);
  // }

  $: handleMediaType(uploadedMediatypes);

  // DISPLAY image AFTER upload
  const fileload = () => {
    mintReset();

    if (files) {
      let reader = new FileReader();
      reader.readAsDataURL(files[0]);
      nftTitle = nftTitle || files[0].name;
      nftDescription = nftDescription || nftTitle;
      console.log("fileType", files[0].type);
      uploadedMediatypes = files[0].type.split("/");
      reader.onload = (e) => {
        image = e.target.result.toString();
      };
    }
  };

  // DISPLAY image of audio nft AFTER upload
  const audioImgfileload = () => {
    mintReset();

    if (audioImageFiles) {
      let reader = new FileReader();
      reader.readAsDataURL(audioImageFiles[0]);
      audioCoverMediatypes = audioImageFiles[0].type.split("/");
      reader.onload = (e) => {
        audioCover = e.target.result.toString();
      };
    }
  };

  const handleMediaType = (uploadedMediatypes) => {
    if (uploadedMediatypes) {
      switch (uploadedMediatypes[0]) {
        case "video":
          selectedMediaType = "Video";
          break;
        case "image":
          if (uploadedMediatypes[1] === "gif") {
            selectedMediaType = "Gif";
          } else {
            selectedMediaType = "Picture";
          }
          break;
        case "text":
          if (uploadedMediatypes[1] === "html") {
            selectedMediaType = "Web";
          } else {
            selectedMediaType = "Text";
          }
          break;
        case "application":
          if (uploadedMediatypes[1] === "pdf") {
            selectedMediaType = "Text";
          } else {
            selectedMediaType = "Text";
          }
          break;
        case "audio":
          selectedMediaType = "Music";
          break;
        default:
      }
    }
  };

  const selectMediaType = (choosenMediatype) => {
    selectedMediaType = choosenMediatype;
  };

  const fileReset = () => {
    mintReset();
    files = undefined;
    image = undefined;
    nftTitle = "";
    nftDescription = "";
  };

  const mint = async (): Promise<NftType> => {
    mintReset();

    if (image) {
      minting = 1;

      if (uploadedMediatypes[0] && "audio" === uploadedMediatypes[0]) {
        ipfsAudio = ipfsGatewayUrl(await nftMint1IpfsImage(image));
        ipfsImage = await nftMint1IpfsImage(audioCover);
        console.log("🚀 ~ file: NftMint.svelte ~ line 157 ~ mint ~ ipfsAudio", `{"animation_url": "${ipfsAudio}"}`);
      } else {
        ipfsImage = await nftMint1IpfsImage(image);
        // console.log("ipfsImage", ipfsImage);
      }

      if (ipfsImage) {
        minting = 2;

        if (uploadedMediatypes[0] && "audio" === uploadedMediatypes[0]) {
          if (ipfsAudio && audioCover) {
            ipfsJson = await nftMint2IpfsJson(nftTitle, nftDescription, ipfsImage, account, audioCover, ipfsAudio);
          }
        } else {
          ipfsJson = await nftMint2IpfsJson(nftTitle, nftDescription, ipfsImage, account, image);
          // console.log("json", ipfsJson);
        }

        if (ipfsJson) {
          minting = 3;

          mintingTxResp = await nftMint3TxResponse(chainId, address, ipfsJson, $metamaskSigner);
          // console.log("txResp", txResp);

          if (mintingTxResp) {
            minting = 4;

            mintedNft = await nftMint4(chainId, address, mintingTxResp, ipfsJson, account);
            // console.log("mintedNft", mintedNft);

            if (mintedNft) {
              minting = 5;
            } else {
              mintingError = "Problem with sent transaction.";
            }
          } else {
            mintingError = "Problem while sending transaction.";
          }
        } else {
          mintingError = "Problem while archiving metadata on IPFS.";
        }
      } else {
        mintingError = "Problem while archiving image on IPFS.";
      }
    } else {
      mintingError = "Missing NFT file. Sorry can't mint.";
    }
    if (mintingError) {
      console.error("ERROR", mintingError);
    }

    return mintedNft;
  };
</script>

<div id="kredeum-create-nft">
  <div class="modal-content">
    <a href="./#" title="Close" class="modal-close"><i class="fa fa-times" /></a>

    <div class="modal-body">
      <div class="titre">
        <i class="fas fa-plus fa-left c-green" />Mint NFT
      </div>

      {#if minting}
        <div class="media media-photo">
          <img src={image} alt="nft" />
        </div>

        <ul class="steps process">
          {#if mintedNft}
            <li class="complete">
              <div class="flex">
                <span class="titre"
                  >NFT Minted, congrats!
                  <i class="fas fa-check fa-left c-green" />
                </span>
              </div>
              <div class="flex">
                <a class="link" href={explorerNftUrl(chainId, mintedNft)} target="_blank">{nftUrl(mintedNft, 6)}</a>
              </div>
            </li>
          {:else}
            <li>
              <div class="flex">
                <span class="titre">
                  {#if mintingError}
                    Minting Error
                    <i class="fa fa-times fa-left" />
                  {:else}
                    Minting NFT
                    <i class="fas fa-spinner fa-left c-green refresh" />
                  {/if}
                </span>
              </div>
              <div class="flex">
                <span class="t-light">
                  {#if mintingError}
                    {mintingError}
                  {:else if 1 <= minting && minting <= 5}
                    {nftMintTexts[minting]}
                  {/if}
                </span>
              </div>
            </li>
          {/if}

          <li class={minting >= 2 ? "complete" : ""}>
            <div class="flex"><span class="label">Image ipfs link</span></div>
            <div class="flex">
              {#if ipfsImage}
                <a class="link" href={ipfsGatewayUrl(ipfsImage)} target="_blank">{textShort(ipfsImage, 15)}</a>
              {/if}
            </div>
          </li>
          <li class={minting >= 3 ? "complete" : ""}>
            <div class="flex"><span class="label">Metadata ipfs link</span></div>
            <div class="flex">
              {#if ipfsJson}
                <a class="link" href={ipfsGatewayUrl(ipfsJson)} target="_blank">{textShort(ipfsJson, 15)}</a>
              {/if}
            </div>
          </li>
          <li class={minting >= 4 ? "complete" : ""}>
            <div class="flex"><span class="label">Transaction</span></div>
            <div class="flex">
              {#if mintingTxResp}
                <a class="link" href={explorerTxUrl(chainId, mintingTxResp.hash)} target="_blank"
                  >{textShort(mintingTxResp.hash, 15)}</a
                >
              {/if}
            </div>
          </li>
          <li class={minting >= 5 ? "complete" : ""}>
            <div class="flex"><span class="label">Token ID</span></div>
            <div class="flex">
              {#if mintedNft}
                <strong>{mintedNft?.tokenID}</strong>
              {/if}
            </div>
          </li>
        </ul>
      {:else}
        <!-- AVANT -->
        <!-- <div class="section">
          <span class="label label-big">NFT file</span>
          <div class="box-file">
            {#if image && files[0] && selectedMediaType === "Picture"}
              <div class="media media-photo mt-20">
                {#if files[0].type.includes("image")}
                  <img src={image} alt="nft" />
                {:else}
                  <p>Please select a image type file</p>
                  <button on:click={fileReset}>Reset</button>
                {/if}
              </div>
            {:else if image && files[0] && selectedMediaType === "Video"}
              <div class="media media-photo mt-20">
                {#if files[0].type.includes("video")} -->
        <!-- svelte-ignore a11y-media-has-caption -->
        <!-- <video preload="metadata" style="border-radius: initial;">
                    <source src={image} type="video/mp4" />
                  </video>
                {:else}
                  <p>Please select a video file</p>
                {/if}
              </div>
            {:else}
              <input type="file" id="file" name="file" bind:files on:change={fileload} />
            {/if}
          </div>
        </div> -->

        <!-- APRES -->
        <div class="section">
          <span class="label label-big">NFT file</span>
          <div class="box-file">
            {#if image && files[0] && selectedMediaType === "Picture"}
              <div class="media media-photo mt-20">
                {#if uploadedMediatypes[0] === "image" && uploadedMediatypes[1] !== "gif"}
                  <img src={image} alt="nft" />
                {:else}
                  <p>Are you sure you want to Mint an image ? :)</p>
                  <button
                    on:click={() => {
                      selectMediaType("Picture");
                      fileReset();
                    }}>Yes</button
                  >
                  <!-- <button on:click={fileReset}>Re-Upload</button> -->
                {/if}
              </div>
            {:else if image && files[0] && selectedMediaType === "Gif"}
              <div class="media media-photo mt-20">
                {#if uploadedMediatypes[0] === "image" && uploadedMediatypes[1] === "gif"}
                  <img src={image} alt="nft" />
                {:else}
                  <p>Are you sure you want to Mint an Gif ? :)</p>
                  <button
                    on:click={() => {
                      selectMediaType("Gif");
                      fileReset();
                    }}>Yes</button
                  >
                  <!-- <button on:click={fileReset}>Re-Upload</button> -->
                {/if}
              </div>
            {:else if image && files[0] && selectedMediaType === "Video"}
              <div class="media media-photo mt-20">
                {#if uploadedMediatypes[0] === "video"}
                  <!-- svelte-ignore a11y-media-has-caption -->
                  <video preload="metadata" style="border-radius: initial;">
                    <source src={image} type="video/mp4" />
                  </video>
                {:else}
                  <p>Are you sure you want to Mint an Gif ? :)</p>
                  <button
                    on:click={() => {
                      selectMediaType("Gif");
                      fileReset();
                    }}>Yes</button
                  >
                {/if}
              </div>
            {:else if image && files[0] && selectedMediaType === "Text"}
              <div class="media media-photo mt-20">
                {#if uploadedMediatypes[0] === "application"}
                  <pre>{image}</pre>
                {:else if uploadedMediatypes[0] === "text" && uploadedMediatypes[1] !== "html"}
                  <pre>{image}</pre>
                {:else}
                  <p>Are you sure you want to Mint text ? :)</p>
                  <button
                    on:click={() => {
                      selectMediaType("Text");
                      fileReset();
                    }}>Yes</button
                  >
                  <!-- <button on:click={fileReset}>Re-Upload</button> -->
                {/if}
              </div>
            {:else if image && files[0] && selectedMediaType === "Web"}
              <div class="media media-photo mt-20">
                {#if uploadedMediatypes[0] === "text" && uploadedMediatypes[1] === "html"}
                  <pre>{image}</pre>
                {:else}
                  <p>Are you sure you want to Mint a web page ? :)</p>
                  <button
                    on:click={() => {
                      selectMediaType("Web");
                      fileReset();
                    }}>Yes</button
                  >
                  <!-- <button on:click={fileReset}>Re-Upload</button> -->
                {/if}
              </div>
            {:else if image && files[0] && selectedMediaType === "Music"}
              <div class="media media-photo mt-20">
                {#if uploadedMediatypes[0] === "audio"}
                  <audio controls src={image}>
                    Your browser does not support the
                    <code>audio</code> element.
                  </audio>
                  {#if audioCover && audioImageFiles[0] && audioCoverMediatypes[0] === "image"}
                    <img src={audioCover} alt="audio file cover" />
                  {:else}
                    <p>Add a cover image for your audio file</p>
                    <input
                      type="file"
                      id="audioImageFile"
                      name="audioImageFile"
                      bind:files={audioImageFiles}
                      on:change={audioImgfileload}
                    />
                  {/if}
                {:else}
                  <p>Are you sure you want to Mint an audio file ? :)</p>
                  <button
                    on:click={() => {
                      selectMediaType("Music");
                      fileReset();
                    }}>Yes</button
                  >
                {/if}
              </div>
            {:else}
              <input type="file" id="file" name="file" bind:files on:change={fileload} />
            {/if}
          </div>
        </div>

        <!------------------------------------------------------------------------------>

        <div class="section">
          <span class="label label-big">NFT title</span>
          <div class="form-field">
            <input type="text" placeholder="My NFT title" bind:value={nftTitle} id="title-nft" />
          </div>
        </div>

        <div class="section">
          <span class="label label-big">NFT description</span>
          <div class="form-field">
            <input type="text" placeholder="My NFT description" bind:value={nftDescription} id="description-nft" />
          </div>
        </div>

        <div class="section">
          <span class="label label-big">Media type</span>
          <div class="box-fields">
            <input
              bind:group={selectedMediaType}
              class="box-field"
              id="create-type-video"
              name="media-type"
              type="radio"
              value="Video"
            />
            <label class="field" for="create-type-video"><i class="fas fa-play" />Video</label>

            <input
              bind:group={selectedMediaType}
              class="box-field"
              id="create-type-picture"
              name="media-type"
              type="radio"
              value="Picture"
            />
            <label class="field" for="create-type-picture"><i class="fas fa-image" />Picture</label>

            <input
              bind:group={selectedMediaType}
              class="box-field"
              id="create-type-gif"
              name="media-type"
              type="radio"
              value="Gif"
            />
            <label class="field" for="create-type-gif"><i class="fas fa-map" />Gif</label>

            <input
              bind:group={selectedMediaType}
              class="box-field"
              id="create-type-texte"
              name="media-type"
              type="radio"
              value="Text"
            />
            <label class="field" for="create-type-texte"><i class="fas fa-file-alt" />Text</label>

            <input
              bind:group={selectedMediaType}
              class="box-field"
              id="create-type-music"
              name="media-type"
              type="radio"
              value="Music"
            />
            <label class="field" for="create-type-music"><i class="fas fa-music" />Music</label>

            <input
              bind:group={selectedMediaType}
              class="box-field"
              id="create-type-web"
              name="media-type"
              type="radio"
              value="Web"
            />
            <label class="field" for="create-type-web"><i class="fas fa-code" />Web</label>
          </div>
        </div>

        <div class="section">
          <span class="label label-big">Add to an existing address ?</span>
          <CollectionList {chainId} bind:address {account} mintable={true} label={false} />
        </div>
        <div class="txtright">
          <button class="btn btn-default btn-sell" on:click={mint}>Mint NFT</button>
        </div>
        {#if mintingError}
          <div class="section">
            <p class="txtright errormsg">
              {mintingError}
            </p>
          </div>
        {/if}
      {/if}
    </div>
  </div>
</div>
