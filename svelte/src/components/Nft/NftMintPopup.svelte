<script lang="ts">
  import type { NftType, Properties } from "@kredeum/common/src/common/types";
  import type { Mediatype } from "../../helpers/mediaTypes";

  import { BigNumber } from "ethers";
  import { onMount } from "svelte";
  import { fade } from "svelte/transition";

  import type { CollectionType } from "@kredeum/common/src/common/types";
  import { collectionGet } from "@kredeum/common/src/collection/collection-get";
  import { getMax } from "@kredeum/common/src/nft/nft-automarket-get";
  import {
    textShort,
    explorerTxUrl,
    displayEther,
    treasuryFee,
    getDappUrl,
    isAddress
  } from "@kredeum/common/src/common/config";
  import { getSupportedImage, getMediaSelection } from "../../helpers/mediaTypes";
  import { defaultAudioCoverImg } from "../../helpers/defaultCoverImage";

  import CollectionSelect from "../Collection/CollectionSelect.svelte";
  import InputPrice from "../Input/InputPrice.svelte";
  import InputAudioMint from "../Input/InputAudioMint.svelte";
  import InputVideoMint from "../Input/InputVideoMint.svelte";
  // import InputPdfMint from "../Input/InputPdfMint.svelte";
  import MediaVideo from "../Media/MediaVideo.svelte";
  import NftProperties from "./NftProperties.svelte";
  import {
    collectionIsAutoMarket,
    collectionOpenOrOwner,
    collectionPrice,
    collectionPriceValid,
    collectionRoyaltyAndFeeAmount,
    collectionRoyaltyAndFeeMinimum,
    collectionRoyaltyEnforcement,
    collectionRoyaltyFee,
    collectionRoyaltyMinimum
  } from "@kredeum/common/src/collection/collection";

  import {
    S0_START,
    S1_STORE_IMAGE,
    S2_STORE_METADATA,
    S4_WAIT_TX,
    S5_MINTED,
    nftMintTexts
  } from "../../helpers/nftMint";
  import NftMint from "./NftMint.svelte";
  import { storageLinkToUrlHttp } from "@kredeum/common/src/storage/storage";

  // import { pdfjsGetPage, pdfjsCrop } from "@kredeum/common/src/common/pdfjs"; // TODO PDFJS

  ////////////////////////////////////////////////////////////////
  //  <NftMintPopup {chainId} {signer} />
  // Mint NFT popup: choose network and collection, upload image,
  //   set price, set properties and mint
  ////////////////////////////////////////////////////////////////
  export let chainId: number;
  export let signer: string;
  export let nft: NftType | undefined = undefined;
  export let toggle: (() => boolean) | undefined = undefined;
  export let src: string | undefined = undefined;
  export let name: string | undefined = undefined;
  export let description: string | undefined = undefined;
  export const metadata: string | undefined = undefined;
  export let content_type: string | undefined = undefined;
  export const external_url: string | undefined = undefined;
  ////////////////////////////////////////////////////////////////

  let account: string;

  let address: string;
  let price: BigNumber;

  let files: FileList | undefined;
  let file: File | undefined;

  let audioFile: File | undefined;
  let audio: string | undefined;

  // let pdfFile: File | undefined; // TODO PDFJS
  // let pdf: string | undefined;

  let inputMediaType: Mediatype = "image";
  let acceptedImgTypes = "";

  /////////////////////////////////////////////////
  let mintingError: string;

  /////////////////////////////////////////////////
  let properties: Properties;
  /////////////////////////////////////////////////
  let mint: () => Promise<void>;
  let minting: number = S0_START;
  let imageUri: string;
  let tokenUri: string;
  let audioUri: string;
  let pdfUri: string;
  let txHash: string;
  /////////////////////////////////////////////////

  let inputPrice: BigNumber;
  let inputPriceError = "";

  $: inputPrice && minimalPriceHandler();
  const minimalPriceHandler = () => {
    if (!(chainId && address)) return;

    if (!collectionPriceValid(collection, inputPrice)) {
      const minPrice = collectionRoyaltyAndFeeMinimum(collection);
      inputPriceError = `Price too low, should be above ${displayEther(
        chainId,
        minPrice
      )} (mimimal royalty + protocol fees)`;
    } else {
      price = inputPrice;
      inputPriceError = "";
    }
  };

  let collection: CollectionType;
  $: chainId && address && handleDefaultAutomarketValues();
  const handleDefaultAutomarketValues = async () => {
    console.log("handleDefaultAutomarketValues", chainId, address);
    collection = await collectionGet(chainId, address);
    inputPrice = collectionPrice(collection);
    console.log("handleDefaultAutomarketValues", String(inputPrice));
  };

  // const pdfToCoverImg = async () => {  // TODO PDFJS
  //   if (!pdf) return;
  //   const page = await pdfjsGetPage(storageLinkToUrlHttp(pdf), 1);
  //   if (!page) return;
  //   src = await pdfjsCrop(page, 437, 437, -89, -179);
  // };

  const setDefaultAudioCover = () => {
    src = defaultAudioCoverImg;
  };

  $: content_type && handleWpMediatype();
  const handleWpMediatype = async () => {
    if (!(content_type && src)) return;

    inputMediaType = getMediaSelection(content_type);
    if (inputMediaType === "audio" || inputMediaType === "pdf") {
      if (inputMediaType === "audio") {
        audio = src;
        setDefaultAudioCover();
      }

      // if (inputMediaType === "pdf") { // TODO PDFJS
      //   pdf = src;
      //   pdfToCoverImg();
      // }
    }
  };

  /////////////////////////////////////////////////
  // Set supported input field for image file
  $: !content_type && inputMediaType && handleMediaTypes();
  const handleMediaTypes = async () => {
    deleteFileImg();
    resetFileAudio();
    // resetFilePdf(); // TODO PDFJS
    // console.log("inputMediaType:", inputMediaType);
    acceptedImgTypes = getSupportedImage(inputMediaType);

    if (inputMediaType === "audio") {
      setDefaultAudioCover();
    }
    // if (inputMediaType === "pdf") { // TODO PDFJS
    // pdfToCoverImg();
    // }
  };

  /////////////////////////////////////////////////
  // Set name & description
  $: (file || audioFile) && handleFileName();
  const handleFileName = () => {
    let _name = "";

    if (inputMediaType === "audio" && audioFile?.name) {
      _name = subFileExtension(audioFile.name);
    } else if (file?.name) {
      _name = subFileExtension(file.name);
    }

    name ||= _name;
    description ||= _name;
  };

  const subFileExtension = (name: string) => name.replace(/.[^.]+$/, "");

  /////////////////////////////////////////////////
  // ON modal AFTER upload get file & image to DISPLAY {src}
  const fileload = () => {
    file = undefined;

    if (files) {
      let reader = new FileReader();
      reader.readAsDataURL(files[0]);

      reader.onload = (e) => {
        src = e.target?.result?.toString() || "";
      };

      file = files[0];
    }
  };

  const resetFileImg = () => {
    files = undefined;
    file = undefined;
  };
  const deleteFileImg = () => {
    resetFileImg();
    src = undefined;
  };

  const resetFileAudio = () => {
    audioFile = undefined;
    audio = "";
  };

  // const resetFilePdf = () => {// TODO PDFJS
  // pdfFile = undefined;
  // pdf = "";
  // };

  onMount(async () => {
    account = signer;
    // console.log("<NftMintPopup onmount src", src);
    if (src) src = storageLinkToUrlHttp(src);
  });
</script>

{#if src}
  <NftMint
    {src}
    {chainId}
    {address}
    {signer}
    {price}
    {properties}
    {name}
    {description}
    {audio}
    bind:mint
    bind:minting
    bind:imageUri
    bind:tokenUri
    bind:audioUri
    bind:pdfUri
    bind:txHash
    bind:nft
  />
  <!-- {pdf}  TODO PDFJS -->
{/if}

<div id="kre-create-mint-nft" class="mint-modal-window" transition:fade>
  <div id="kredeum-create-nft">
    <div class="mint-modal-content">
      <span role="button" tabindex="0" on:click={toggle} on:keydown={toggle} title="Close" class="btn modal-close"
        ><i class="fa fa-times" /></span
      >

      <div class="mint-modal-body">
        <div class="titre">
          <i class="fas fa-plus fa-left c-green" />Mint NFT
        </div>
        {#if minting === S0_START}
          <div class="section">
            <div class="box-fields">
              <input
                bind:group={inputMediaType}
                class="box-field"
                id="create-type-picture"
                name="media-type"
                type="radio"
                value="image"
              />
              <label class="field" for="create-type-picture"><i class="fas fa-image" />Picture</label>

              <input
                bind:group={inputMediaType}
                class="box-field"
                id="create-type-gif"
                name="media-type"
                type="radio"
                value="gif"
              />
              <label class="field" for="create-type-gif"><i class="fas fa-map" />Gif</label>

              <input
                bind:group={inputMediaType}
                class="box-field"
                id="create-type-music"
                name="media-type"
                type="radio"
                value="audio"
              />
              <label class="field" for="create-type-music"><i class="fas fa-music" />Music</label>

              <input
                bind:group={inputMediaType}
                class="box-field"
                id="create-type-video"
                name="media-type"
                type="radio"
                value="video"
              />
              <label class="field" for="create-type-video"><i class="fas fa-play" />Video</label>

              <!-- <input
                bind:group={inputMediaType}
                class="box-field"
                id="create-type-pdf"
                name="media-type"
                type="radio"
                value="pdf"
              />
              <label class="field" for="create-type-pdf"><i class="fas fa-file-alt" />Pdf</label> TODO PDFJS -->

              <input class="box-field" id="create-type-web" name="media-type" type="checkbox" value="Web" disabled />
              <label class="field" for="create-type-web"><i class="fas fa-code" />Web</label>
            </div>
          </div>

          {#if inputMediaType === "audio"}
            <InputAudioMint bind:audioFile bind:audio />
          {/if}

          {#if inputMediaType === "video"}
            <InputVideoMint bind:videoFile={file} bind:video={src} />
          {/if}

          {#if inputMediaType !== "video"}
            <div class="section">
              <div class="titre">NFT image file</div>
              <div class="box-file">
                {#if src}
                  <div class="media media-photo">
                    <img {src} alt="nft" />
                    <span
                      role="button"
                      tabindex="0"
                      class="kre-delete-file"
                      on:click={deleteFileImg}
                      on:keydown={deleteFileImg}><i class="fa fa-trash" aria-hidden="true" /></span
                    >
                  </div>
                {:else}
                  <div class="kre-flex kre-baseline">
                    <input
                      type="file"
                      id="file"
                      name="file"
                      bind:files
                      on:change={fileload}
                      accept={acceptedImgTypes}
                    />
                  </div>
                {/if}
              </div>
            </div>
          {/if}

          <div class="section">
            <div class="titre">NFT title</div>
            <div class="form-field">
              <input
                type="text"
                class=" kre-field-outline"
                placeholder="add a title"
                bind:value={name}
                id="title-nft"
              />
            </div>
          </div>
          <div class="section">
            <div class="titre">NFT description</div>
            <div class="form-field">
              <input
                type="text"
                class=" kre-field-outline"
                placeholder="add a description"
                bind:value={description}
                id="description-nft"
              />
            </div>
          </div>
          <div class="section kre-mint-collection">
            <div class="titre">Add to existing Collection</div>
            <CollectionSelect {chainId} bind:address {account} mintable={true} label={false} />
          </div>

          {#if collectionPrice(collection).gt(0) || collectionRoyaltyFee(collection) > 0}
            <div class="section kre-mint-automarket">
              <div class="kre-flex">
                <div>
                  <span class="kre-market-info-title label-big">Royalty Fee</span>
                  <span class="kre-market-info-value label-big"
                    >{collectionRoyaltyFee(collection) / 100} %
                    {#if collectionRoyaltyMinimum(collection).gt(0)}
                      or a minimum of {displayEther(chainId, collectionRoyaltyMinimum(collection))}
                    {/if}
                  </span>
                </div>
                <div class="kre-treasury-fee">
                  <span class="kre-market-info-title label-big kre-no-wrap-title">Protocol Fee</span>
                  <span class="kre-market-info-value label-big overflow-ellipsis">{treasuryFee() / 100} %</span>
                </div>
              </div>
            </div>
          {/if}

          {#if collectionIsAutoMarket(collection) && collectionOpenOrOwner(collection, signer)}
            <div class="section">
              <div class="titre">NFT Sell Price</div>
              <InputPrice {chainId} bind:price={inputPrice} error={inputPriceError} />
            </div>

            <div class="section">
              <div class="titre">Royalty amount</div>
              {#if collectionRoyaltyEnforcement(collection)}
                {displayEther(
                  chainId,
                  getMax(
                    collectionRoyaltyAndFeeAmount(collection, inputPrice),
                    collectionRoyaltyAndFeeMinimum(collection)
                  )
                )}
              {:else}
                {displayEther(chainId, collectionRoyaltyAndFeeAmount(collection, inputPrice))}
              {/if}
            </div>
          {/if}

          <NftProperties bind:properties />

          <div class="txtright">
            <button
              class="btn btn-default btn-sell"
              on:click|preventDefault={mint}
              disabled={!isAddress(address)}
              id="mintNft"
            >
              Mint NFT
            </button>
          </div>
        {:else if S0_START < minting && minting <= S5_MINTED}
          <div class="media media-photo">
            {#if inputMediaType === "video" && src}
              <MediaVideo {src} mode="line" />
            {:else}
              <img {src} alt="nft" />
            {/if}
          </div>

          <ul class="steps process">
            <li>
              <div class="flex">
                <span class="titre">
                  {#if mintingError}
                    Minting Error
                    <i class="fa fa-times fa-left" />
                  {:else if minting == S5_MINTED && nft}
                    NFT Minted, congrats!
                    <i class="fas fa-check fa-left c-green" />
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
                  {:else}
                    {nftMintTexts[minting]}
                  {/if}
                </span>
              </div>
            </li>

            <li class={minting > S1_STORE_IMAGE ? "complete" : ""}>
              <div class="flex"><span class="label">Media link</span></div>
              <div class="flex">
                {#if imageUri}
                  <a class="link" href={storageLinkToUrlHttp(imageUri)} target="_blank" rel="noreferrer"
                    >{textShort(imageUri, 15)}</a
                  >
                {/if}
              </div>
            </li>

            {#if inputMediaType === "audio"}
              <li class={minting > S1_STORE_IMAGE ? "complete" : ""}>
                <div class="flex"><span class="label">Audio link</span></div>
                <div class="flex">
                  {#if audioUri}
                    <a class="link" href={storageLinkToUrlHttp(audioUri)} target="_blank" rel="noreferrer"
                      >{textShort(audioUri, 15)}</a
                    >
                  {/if}
                </div>
              </li>
            {/if}

            <!-- {#if inputMediaType === "pdf"}
              <li class={minting > S1_STORE_IMAGE ? "complete" : ""}>
                <div class="flex"><span class="label">Pdf link</span></div>
                <div class="flex">
                  {#if pdfUri}
                    <a class="link" href={storageLinkToUrlHttp(pdfUri)} target="_blank" rel="noreferrer"
                      >{textShort(pdfUri, 15)}</a
                    >
                  {/if}
                </div>
              </li>
             {/if} TODO PDFJS -->

            <li class={minting > S2_STORE_METADATA ? "complete" : ""}>
              <div class="flex"><span class="label">Metadata link</span></div>
              <div class="flex">
                {#if tokenUri}
                  <a class="link" href={storageLinkToUrlHttp(tokenUri)} target="_blank" rel="noreferrer"
                    >{textShort(tokenUri, 15)}</a
                  >
                {/if}
              </div>
            </li>

            <li class={minting >= S4_WAIT_TX ? "complete" : ""}>
              <div class="flex"><span class="label">Transaction link</span></div>
              <div class="flex">
                {#if minting >= S4_WAIT_TX}
                  <a class="link" href={explorerTxUrl(chainId, txHash)} target="_blank" rel="noreferrer"
                    >{textShort(txHash, 15)}</a
                  >
                {/if}
              </div>
            </li>

            <li class={minting == S5_MINTED ? "complete" : ""}>
              <div class="flex"><span class="label">Token ID</span></div>
              <div class="flex">
                {#if minting == S5_MINTED && nft}
                  <a class="link" href={getDappUrl(chainId, nft)}>
                    <strong>{nft.tokenID}</strong>
                  </a>
                {/if}
              </div>
            </li>
          </ul>
        {:else if mintingError}
          <div class="section">
            <div class="form-field kre-warning-msg">
              <p><i class="fas fa-exclamation-triangle fa-left c-red" />{mintingError}</p>
            </div>
          </div>
        {/if}
      </div>
    </div>
  </div>
</div>

<style>
  #kre-create-mint-nft {
    overflow: visible;
    opacity: 1;
    pointer-events: auto;
    z-index: 1000;
    text-align: left;
  }

  .mint-modal-body {
    overflow-y: auto;
  }

  .box-file {
    position: relative;
    border-radius: 34px;
  }

  input[type="file"]:disabled {
    opacity: 0.5;
  }

  input:disabled + label {
    cursor: not-allowed;
  }

  .media-photo {
    width: 33%;
    border-radius: 15px;
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

  .kre-mint-automarket {
    border: 1px solid #eaeff8;
    border-radius: 6px;
    width: 100%;
  }

  .kre-mint-automarket div.kre-flex div {
    padding: 20px;
    max-width: 50%;
    overflow: hidden;
    flex-grow: 1;
    border-left: 1px solid #eaeff8;
  }

  .kre-treasury-fee {
    min-width: 5em;
  }

  .kre-no-wrap-title {
    white-space: nowrap;
  }

  .kre-market-info-title {
    color: #5b5b5b;
    font-size: 11px;
    letter-spacing: 1px;
    margin-bottom: 2px;
  }

  .kre-market-info-value {
    color: #5b5b5b;
    display: block;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 1px;
  }

  :global(.modal-window .select-wrapper div.select-trigger) {
    border: 1px solid #eaeff8;
    border-radius: 6px;
  }

  :global(.kre-mint-collection div.col) {
    padding-left: 0;
    padding-right: 0;
  }

  /* WP Fix */
  :global(.admin-bar .modal-body .kre-no-cover label) {
    transform: translateY(-3px);
    display: inline-block;
  }
</style>
