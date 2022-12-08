<script lang="ts">
  import type { NftType, Properties } from "@lib/common/types";
  import type { Mediatype } from "@helpers/mediaTypes";

  import type { TransactionResponse } from "@ethersproject/abstract-provider";
  import type { Writable } from "svelte/store";
  import { BigNumber, constants, utils } from "ethers";
  import { onMount, getContext } from "svelte";
  import { fade } from "svelte/transition";

  import { nftIpfsImage, nftIpfsJson, nftSwarmImage, nftSwarmJson, nftMint, nftMint4 } from "@lib/nft/nft-mint";
  import { collectionGet } from "@lib/collection/collection-get";
  import { CollectionType } from "@lib/common/types";
  import { getMax, getReceiverAmount, reduceDecimals } from "@lib/nft/nft-automarket-get";
  import {
    textShort,
    swarmGatewayUrl,
    explorerTxUrl,
    explorerTxLog,
    explorerNftUrl,
    nftUrl,
    storageLinkToUrlHttp,
    config,
    getCurrency
  } from "@lib/common/config";
  import { getSupportedImage } from "@helpers/mediaTypes";

  import { metamaskChainId, metamaskAccount, metamaskSigner, metamaskProvider } from "@main/metamask";
  import { clickOutside } from "@helpers/clickOutside";

  import CollectionList from "../Collection/CollectionList.svelte";
  import InputPrice from "../InputFields/InputPrice.svelte";
  import InputAudioMint from "../InputFields/InputAudioMint.svelte";
  import NftProperties from "./NftProperties.svelte";

  ////////////////////////////////////////////////////////////////
  //  <NftMint {storage} {gateway}? {key}? />
  // Mint NFT with defined storage type and optionnal gateway/key
  ////////////////////////////////////////////////////////////////
  export let storage: string;
  export let gateway: string = undefined;
  export let key: string = undefined;
  ////////////////////////////////////////////////////////////////

  // Context for refreshCollectionList & refreshNftsList
  let refreshCollectionList: Writable<number> = getContext("refreshCollectionList");
  let refreshNftsList: Writable<number> = getContext("refreshNftsList");
  /////////////////////////////////////////////////

  let address: string;

  let files: FileList;
  let file: File;
  let image: string;

  let audioFile: File;
  let audio: string;

  let nftTitle: string = "";
  let nftDescription: string = "";

  let defaultAudioCoverImg = "./assets/images/Cover.png";

  let inputMediaType: Mediatype = "image";
  let acceptedImgTypes = "";

  /////////////////////////////////////////////////
  let storageImg: string;
  let animation_url: string;
  let storageJson: string;

  let minting: number;
  let mintingTxResp: TransactionResponse;
  let mintedNft: NftType;
  let mintingError: string;

  /////////////////////////////////////////////////
  let properties: Properties;
  /////////////////////////////////////////////////

  let open = false;
  let price: BigNumber;
  let inputPriceError = "";

  let minRoyalty: BigNumber;

  $: chainId = $metamaskChainId;

  $: minRoyalty = getReceiverAmount(collection?.price, collection?.royalty?.fee);

  $: price && handlePriceError();
  const handlePriceError = () => {
    console.log("priceerror", typeof utils.formatEther(minRoyalty.mul(2)));

    collection?.minimal && constants.Zero.lt(price) && price?.lt(minRoyalty.mul(2))
      ? (inputPriceError = `Price too low, minimum price should be set above ${reduceDecimals(
          utils.formatEther(minRoyalty.mul(2))
        )} ${getCurrency(chainId)} 
            `)
      : (inputPriceError = "");
  };

  $: mintedNft && open === false && handleResetAfterMint();
  const handleResetAfterMint = () => {};

  let collection: CollectionType;
  $: chainId && address && $metamaskProvider && handleDefaultAutomarketValues();
  const handleDefaultAutomarketValues = async () => {
    collection = await collectionGet(chainId, address);
    price = BigNumber.from(collection?.price || 0);
  };

  // $: prefixPrice = collection?.owner == $metamaskAccount ? "Recommended" : "Mint";

  /////////////////////////////////////////////////
  // Set supported input field for image file
  $: inputMediaType && handleMediaTypes();
  const handleMediaTypes = async () => {
    resetFileImg();
    resetFileAudio();
    acceptedImgTypes = getSupportedImage(inputMediaType);

    if (inputMediaType === "audio") {
      const resp = await fetch(defaultAudioCoverImg);
      const blob = await resp.blob();
      let reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onload = (e) => {
        image = e.target.result.toString();
      };

      file = new File([blob], "audio cover", { lastModified: new Date().getTime(), type: blob.type });
    }
  };

  /////////////////////////////////////////////////
  $: audioFile && handleAudioFileName();
  const handleAudioFileName = () => {
    nftTitle = nftTitle || subFileExtension(audioFile.name);
    nftDescription = nftDescription || subFileExtension(audioFile.name);
  };

  /////////////////////////////////////////////////
  // ON modal AFTER upload get file & nftTitle & image to DISPLAY {image}
  const fileload = () => {
    file = null;

    if (files) {
      let reader = new FileReader();
      reader.readAsDataURL(files[0]);

      if (inputMediaType === "image" || "gif") {
        nftTitle = nftTitle || subFileExtension(files[0].name);
        nftDescription = nftDescription || subFileExtension(files[0].name);
      }
      reader.onload = (e) => {
        image = e.target.result.toString();
      };

      file = files[0];
    }
  };

  const subFileExtension = (name: string) => name.replace(/.[^.]+$/, "");

  const resetFileImg = () => {
    files = null;
    image = "";
    file = null;
  };

  const resetFileAudio = () => {
    audioFile = null;
    audio = "";
  };

  const _mintingError = (err: string): void => {
    mintingError = err;
    console.error(mintingError);
    minting = 0;
  };

  // MINTING STATES
  //
  //  STATE 0 Start
  //    |
  //  STATE 1 Confirm MINT
  //    |
  //  STATE 2 Store Image
  //    |
  //  STATE 3 Store Metadata
  //    |
  //  STATE 4
  // Ask for signature
  //    |
  //  TEST TxResp --> ERROR sending TX
  //    |
  //  STATE 5 Display TX Hash
  //    |
  //  TEST TxReceipt --> ERROR inside TX
  //    |
  //  STATE 6 End TX & Refresh
  //    |
  //  CLICK Close
  //    |
  //  STATE 0 popup closed

  // STATES : S1-S6
  const S1_CONFIRM = 1;
  const S2_STORE_IMAGE = 2;
  const S3_STORE_METADATA = 3;
  const S4_SIGN_TX = 4;
  const S5_WAIT_TX = 5;
  const S6_MINTED = 6;

  const nftMintTexts = [
    "Start",
    "Mint",
    "Wait till media(s) stored on decentralized storage",
    "Wait till Metadata stored on decentralized storage",
    "Please, sign the transaction",
    "Wait till transaction completed, it may take one minute or more...",
    "Minted"
  ];

  const mintInit = () => {
    minting = S1_CONFIRM;
  };

  const mintConfirm = async () => {
    if (!image) return _mintingError("ERROR no image");
    if (!audio && inputMediaType === "audio") return _mintingError("ERROR no audio file");

    minting = S2_STORE_IMAGE;

    storageImg =
      "ipfs" === storage
        ? await nftIpfsImage(image)
        : "swarm" === storage
        ? await nftSwarmImage(file, nftTitle, file.type, gateway, key, file.size)
        : "";

    if (!storageImg) return _mintingError("ERROR image not stored");

    if (inputMediaType === "audio")
      animation_url =
        "ipfs" === storage
          ? await nftIpfsImage(audio)
          : "swarm" === storage
          ? await nftSwarmImage(audioFile, nftTitle, audioFile.type, gateway, key, audioFile.size)
          : "";

    if (!animation_url && inputMediaType === "audio") return _mintingError("ERROR audio file not stored");

    minting = S3_STORE_METADATA;

    storageJson =
      "ipfs" === storage
        ? await nftIpfsJson(
            nftTitle,
            nftDescription,
            storageImg,
            $metamaskAccount,
            image,
            "",
            properties,
            animation_url
          )
        : "swarm" === storage
        ? swarmGatewayUrl(
            await nftSwarmJson(
              nftTitle,
              nftDescription,
              storageImg,
              $metamaskAccount,
              image,
              "",
              properties,
              animation_url,
              gateway,
              key
            )
          )
        : "";

    if (!storageJson) return _mintingError("ERROR metadata not stored");

    minting = S4_SIGN_TX;

    mintingTxResp = await nftMint(chainId, address, storageJson, $metamaskSigner, price);
    if (!mintingTxResp)
      return _mintingError(`ERROR while sending transaction... ${JSON.stringify(mintingTxResp, null, 2)}`);

    explorerTxLog(chainId, mintingTxResp);
    minting = S5_WAIT_TX;

    mintedNft = await nftMint4(chainId, address, mintingTxResp, storageJson, $metamaskAccount);
    // console.log("mintedNft", mintedNft);

    if (!mintedNft) return _mintingError(`ERROR returned by transaction ${mintedNft}`);

    minting = S6_MINTED;

    $refreshCollectionList += 1;
    $refreshNftsList += 1;
  };

  onMount(() => {
    mintInit();
  });

  const handleOpen = () => (open = true);
</script>

<span on:click={handleOpen} on:keydown={handleOpen} class="btn btn-default" title="Mint NFT">Mint NFT</span>

{#if open}
  <div id="kre-create-mint-nft" class="mint-modal-window" transition:fade>
    <div use:clickOutside={() => (open = false)}>
      <div id="kredeum-create-nft">
        <div class="mint-modal-content">
          <a href="./#" on:click={() => (open = false)} title="Close" class="modal-close"><i class="fa fa-times" /></a>

          <div class="mint-modal-body">
            <div class="titre">
              <i class="fas fa-plus fa-left c-green" />Mint NFT ({minting})
            </div>

            {#if minting == S1_CONFIRM}
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
                    class="box-field"
                    id="create-type-video"
                    name="media-type"
                    type="radio"
                    value="video"
                    disabled
                  />
                  <label class="field" for="create-type-video"><i class="fas fa-play" />Video</label>

                  <input
                    class="box-field"
                    id="create-type-texte"
                    name="media-type"
                    type="checkbox"
                    value="Text"
                    disabled
                  />
                  <label class="field" for="create-type-texte"><i class="fas fa-file-alt" />Text</label>

                  <input
                    class="box-field"
                    id="create-type-web"
                    name="media-type"
                    type="checkbox"
                    value="Web"
                    disabled
                  />
                  <label class="field" for="create-type-web"><i class="fas fa-code" />Web</label>
                </div>
              </div>

              {#if inputMediaType === "audio"}
                <InputAudioMint bind:audioFile bind:audio />
              {/if}

              <div class="section">
                <div class="titre">NFT image file</div>
                <div class="box-file">
                  {#if image}
                    <div class="media media-photo">
                      <img src={image} alt="nft" />
                      <span class="kre-delete-file" on:click={resetFileImg} on:keydown={resetFileImg}
                        ><i class="fa fa-trash" aria-hidden="true" /></span
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

              <div class="section">
                <div class="titre">NFT title</div>
                <div class="form-field">
                  <input
                    type="text"
                    class=" kre-field-outline"
                    placeholder="add a title"
                    bind:value={nftTitle}
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
                    bind:value={nftDescription}
                    id="description-nft"
                  />
                </div>
              </div>
              <div class="section kre-mint-collection">
                <div class="titre">Add to an existing Collection</div>
                <CollectionList {chainId} bind:address account={$metamaskAccount} mintable={true} label={false} />
              </div>

              {#if constants.Zero.lt(collection?.price || 0) || constants.Zero.lt(collection?.royalty?.fee || 0)}
                <div class="section kre-mint-automarket">
                  <div class="kre-flex">
                    <div>
                      <span class="kre-market-info-title label-big">Royalty Fee</span>
                      <span class="kre-market-info-value label-big"
                        >{collection.royalty?.fee / 100} %
                        {#if collection.royalty?.minimum?.gt(0)}
                          or a minimum of {utils.formatEther(collection.royalty?.minimum)} {getCurrency(chainId)}
                        {/if}
                      </span>
                    </div>
                    <div class="kre-treasury-fee">
                      <span class="kre-market-info-title label-big kre-no-wrap-title">Protocol Fee</span>
                      <span class="kre-market-info-value label-big overflow-ellipsis"
                        >{config.treasury.fee / 100} %</span
                      >
                    </div>
                  </div>
                </div>
              {/if}

              {#if collection?.supports?.IOpenAutoMarket && !collection?.open && collection?.owner === $metamaskAccount}
                <div class="section">
                  <div class="titre">NFT Sell Price</div>
                  <InputPrice {chainId} bind:price inputError={inputPriceError} />
                </div>

                <div class="section">
                  <div class="titre">Royalty amount</div>
                  {#if collection.minimal}
                    {utils.formatEther(getMax(getReceiverAmount(price, collection.royalty?.fee), minRoyalty))}
                  {:else}
                    {utils.formatEther(getReceiverAmount(price, collection.royalty?.fee))}
                  {/if}
                  {getCurrency(chainId)}
                </div>
              {/if}

              <NftProperties bind:properties />

              <div class="txtright">
                <button class="btn btn-default btn-sell" on:click={mintConfirm}>Mint NFT</button>
              </div>
            {:else if minting >= S2_STORE_IMAGE && minting <= S6_MINTED}
              <div class="media media-photo">
                <img src={image} alt="nft" />
              </div>

              <ul class="steps process">
                {#if !mintedNft}
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
                        {:else}
                          {nftMintTexts[minting]}
                        {/if}
                      </span>
                    </div>
                  </li>
                {/if}

                <li class={minting > S2_STORE_IMAGE ? "complete" : ""}>
                  <div class="flex"><span class="label">Image link</span></div>
                  <div class="flex">
                    {#if minting > S2_STORE_IMAGE}
                      <a class="link" href={storageLinkToUrlHttp(storageImg)} target="_blank" rel="noreferrer"
                        >{textShort(storageImg, 15)}</a
                      >
                    {/if}
                  </div>
                </li>
                {#if inputMediaType === "audio"}
                  <li class={minting > S2_STORE_IMAGE ? "complete" : ""}>
                    <div class="flex"><span class="label">Audio link</span></div>
                    <div class="flex">
                      {#if minting > S2_STORE_IMAGE}
                        <a class="link" href={storageLinkToUrlHttp(animation_url)} target="_blank" rel="noreferrer"
                          >{textShort(animation_url, 15)}</a
                        >
                      {/if}
                    </div>
                  </li>
                {/if}
                <li class={minting > S3_STORE_METADATA ? "complete" : ""}>
                  <div class="flex"><span class="label">Metadata link</span></div>
                  <div class="flex">
                    {#if minting > S3_STORE_METADATA}
                      <a class="link" href={storageLinkToUrlHttp(storageJson)} target="_blank" rel="noreferrer"
                        >{textShort(storageJson, 15)}</a
                      >
                    {/if}
                  </div>
                </li>
                <li class={minting >= S5_WAIT_TX ? "complete" : ""}>
                  <div class="flex"><span class="label">Transaction link</span></div>
                  <div class="flex">
                    {#if minting >= S5_WAIT_TX}
                      <a class="link" href={explorerTxUrl(chainId, mintingTxResp.hash)} target="_blank" rel="noreferrer"
                        >{textShort(mintingTxResp.hash, 15)}</a
                      >
                    {/if}
                  </div>
                </li>
                <li class={minting == S6_MINTED ? "complete" : ""}>
                  <div class="flex"><span class="label">Token ID</span></div>
                  <div class="flex">
                    {#if minting == S6_MINTED}
                      <strong>{mintedNft?.tokenID}</strong>
                    {/if}
                  </div>
                </li>
              </ul>
            {:else if minting == S6_MINTED}
              <li class="complete">
                <div class="flex">
                  <span class="titre"
                    >NFT Minted, congrats!
                    <i class="fas fa-check fa-left c-green" />
                  </span>
                </div>
                <div class="flex">
                  <a class="link" href={explorerNftUrl(chainId, mintedNft)} target="_blank" rel="noreferrer"
                    >{nftUrl(mintedNft, 6)}</a
                  >
                </div>
              </li>
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
  </div>
{/if}

<style>
  #kre-create-mint-nft {
    visibility: visible;
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

  .media-photo img {
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
