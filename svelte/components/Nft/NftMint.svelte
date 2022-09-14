<script lang="ts">
  import type { TransactionResponse } from "@ethersproject/abstract-provider";
  import { onMount, getContext } from "svelte";
  import { Writable } from "svelte/store";
  import { fade } from "svelte/transition";
  import { utils } from "ethers";

  import type { NftType } from "@lib/common/ktypes";
  import {
    nftIpfsImage,
    nftIpfsJson,
    nftSwarmImage,
    nftSwarmJson,
    nftMint,
    nftMint4
  } from "@lib/nft/knft-mint";
  import {
    textShort,
    swarmGatewayUrl,
    explorerTxUrl,
    explorerTxLog,
    explorerNftUrl,
    nftUrl,
    storageLinkToUrlHttp
  } from "@lib/common/kconfig";
  import { collectionGet } from "@lib/collection/kcollection-get";

  import { metamaskChainId, metamaskAccount, metamaskSigner, metamaskProvider } from "@main/metamask";
  import { clickOutside } from "@helpers/clickOutside";

  import CollectionList from "../Collection/CollectionList.svelte";

  /////////////////////////////////////////////////
  //  <NftMint {storage} {gateway}? {key}? />
  // Mint NFT with defined storage type and optionnal gateway/key
  /////////////////////////////////////////////////
  export let storage: string;
  export let gateway: string = undefined;
  export let key: string = undefined;

  // Context for refreshCollectionList & refreshNftsList
  ///////////////////////////////////////////////////////////
  let refreshCollectionList: Writable<number> = getContext("refreshCollectionList");
  let refreshNftsList: Writable<number> = getContext("refreshNftsList");
  ///////////////////////////////////////////////////////////

  /////////////////////////////////////////////////
  $: chainId = $metamaskChainId;

  let address: string;

  let files: FileList;
  let file: File;
  let image: string;
  let nftTitle: string = "";
  let nftDescription: string = "";

  let nftMintingPrice: string;
  let nftDefaultRoyaltiesAmount: string;
  let nftDefaultRoyaltyReceiver: string;
  /////////////////////////////////////////////////
  let storageImg: string;
  let storageJson: string;

  let minting: number;
  let mintingTxResp: TransactionResponse;
  let mintedNft: NftType;
  let mintingError: string;
  /////////////////////////////////////////////////
  let open = false;

  $: mintedNft && open === false && handleResetAfterMint();
  const handleResetAfterMint = () => {};

  $: chainId && address && $metamaskProvider && handleDefaultAutomarketValues();
  const handleDefaultAutomarketValues = async () => {
    const collection = await collectionGet(chainId, address, $metamaskProvider);
    console.log("handleDefaultAutomarketValues", collection);

    nftMintingPrice = utils.formatEther(collection.price);
    nftDefaultRoyaltiesAmount = collection.fee.toString();
    nftDefaultRoyaltyReceiver = collection.receiver;
  };

  /////////////////////////////////////////////////
  // ON modal AFTER upload get file & nftTitle & image to DISPLAY {image}
  const fileload = () => {
    file = null;

    if (files) {
      let reader = new FileReader();
      reader.readAsDataURL(files[0]);
      nftTitle = nftTitle || files[0].name;
      nftDescription = nftDescription || files[0].name;
      reader.onload = (e) => {
        image = e.target.result.toString();
      };

      file = files[0];
    }
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
    "Wait till Image stored on decentralized storage",
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

    minting = S2_STORE_IMAGE;

    storageImg =
      "ipfs" === storage
        ? await nftIpfsImage(image)
        : "swarm" === storage
        ? await nftSwarmImage(file, nftTitle, file.type, gateway, key, file.size)
        : "";

    if (!storageImg) return _mintingError("ERROR image not stored");

    minting = S3_STORE_METADATA;

    storageJson =
      "ipfs" === storage
        ? await nftIpfsJson(nftTitle, nftDescription, storageImg, $metamaskAccount, image)
        : "swarm" === storage
        ? swarmGatewayUrl(
            await nftSwarmJson(nftTitle, nftDescription, storageImg, $metamaskAccount, image, gateway, key)
          )
        : "";

    if (!storageJson) return _mintingError("ERROR metadata not stored");

    minting = S4_SIGN_TX;

    mintingTxResp = await nftMint(chainId, address, storageJson, $metamaskSigner);
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
</script>

<span on:click={() => (open = true)} class="btn btn-default" title="Mint NFT">Mint NFT</span>

{#if open}
  <div id="kre-create-mint-nft" class="mint-modal-window" transition:fade>
    <div use:clickOutside={() => (open = false)}>
      <div id="kredeum-create-nft">
        <div class="mint-modal-content">
          <a href="./#" on:click={() => (open = false)} title="Close" class="modal-close"><i class="fa fa-times" /></a>

          <div class="mint-modal-body">
            <div class="titre">
              <i class="fas fa-plus fa-left c-green" />Mint NFT
            </div>

            {#if minting == S1_CONFIRM}
              <div class="section">
                <span class="label label-big">NFT file</span>
                <div class="box-file">
                  {#if image}
                    <div class="media media-photo mt-20">
                      <img src={image} alt="nft" />
                    </div>
                  {:else}
                    <input type="file" id="file" name="file" bind:files on:change={fileload} />
                  {/if}
                </div>
              </div>
              <div class="section">
                <span class="label label-big">NFT title</span>
                <div class="form-field">
                  <input type="text" placeholder="My NFT title" bind:value={nftTitle} id="title-nft" />
                </div>
              </div>
              <div class="section">
                <span class="label label-big">NFT description</span>
                <div class="form-field">
                  <input
                    type="text"
                    placeholder="My NFT description"
                    bind:value={nftDescription}
                    id="description-nft"
                  />
                </div>
              </div>
              {#if nftMintingPrice}
                <div class="section">
                  <span class="label label-big">NFT minting price : {nftMintingPrice} (Eth)</span>
                </div>
              {/if}
              {#if nftDefaultRoyaltiesAmount}
                <div class="section">
                  <span class="label label-big"
                    >Collection default royalty percentage : {parseInt(nftDefaultRoyaltiesAmount) / 100} %</span
                  >
                </div>
              {/if}
              {#if nftDefaultRoyaltyReceiver}
                <div class="section">
                  <span class="label label-big"
                    >Collection default royalty receiver address : {nftDefaultRoyaltyReceiver}</span
                  >
                </div>
              {/if}

              <div class="section">
                <span class="label label-big">Media type</span>
                <div class="box-fields">
                  <input
                    class="box-field"
                    id="create-type-video"
                    name="media-type"
                    type="checkbox"
                    value="Video"
                    disabled
                  />
                  <label class="field" for="create-type-video"><i class="fas fa-play" />Video</label>

                  <input
                    class="box-field"
                    id="create-type-picture"
                    name="media-type"
                    type="checkbox"
                    value="Picture"
                    checked
                  />
                  <label class="field" for="create-type-picture"><i class="fas fa-image" />Picture</label>

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
                    id="create-type-music"
                    name="media-type"
                    type="checkbox"
                    value="Music"
                    disabled
                  />
                  <label class="field" for="create-type-music"><i class="fas fa-music" />Music</label>

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

              <div class="section">
                <span class="label label-big">Add to an existing address ?</span>
                <CollectionList {chainId} bind:address account={$metamaskAccount} mintable={true} label={false} />
              </div>
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
                      <a class="link" href={storageLinkToUrlHttp(storageImg)} target="_blank"
                        >{textShort(storageImg, 15)}</a
                      >
                    {/if}
                  </div>
                </li>
                <li class={minting > S3_STORE_METADATA ? "complete" : ""}>
                  <div class="flex"><span class="label">Metadata link</span></div>
                  <div class="flex">
                    {#if minting > S3_STORE_METADATA}
                      <a class="link" href={storageLinkToUrlHttp(storageJson)} target="_blank"
                        >{textShort(storageJson, 15)}</a
                      >
                    {/if}
                  </div>
                </li>
                <li class={minting >= S5_WAIT_TX ? "complete" : ""}>
                  <div class="flex"><span class="label">Transaction</span></div>
                  <div class="flex">
                    {#if minting >= S5_WAIT_TX}
                      <a class="link" href={explorerTxUrl(chainId, mintingTxResp.hash)} target="_blank"
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
                  <a class="link" href={explorerNftUrl(chainId, mintedNft)} target="_blank">{nftUrl(mintedNft, 6)}</a>
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
</style>
