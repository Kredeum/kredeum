<script lang="ts">
  import { fade } from "svelte/transition";
  import { clickOutside } from "helpers/clickOutside";

  import type { TransactionResponse } from "@ethersproject/abstract-provider";
  import type { NftType } from "lib/ktypes";
  import {
    nftSwarmMintTexts,
    nftMint1SwarmImage,
    nftMint2SwarmJson,
    nftMint3SwarmTxResponse,
    nftMint4Swarm
  } from "lib/knft-mint";
  import { textShort, swarmGatewayUrl, explorerTxUrl, explorerNftUrl, nftUrl } from "lib/kconfig";

  // import { metamaskSigner } from "main/metamask";

  import CollectionList from "../Collection/CollectionList.svelte";

  /////////////////////////////////////////////////
  import type { Readable } from "svelte/store";
  import { collectionStore } from "stores/collection/collection";
  import { metamaskChainId, metamaskSigner } from "main/metamask";
  import AccountConnect from "../Account/AccountConnect.svelte";
  import { urlToLink, nftOpenSeaUrl, getNetwork } from "lib/kconfig";
  import { nftGetImageLink } from "lib/knft-get-metadata";

  /////////////////////////////////////////////////

  /////////////////////////////////////////////////
  //  <NftMintSwarm {chainId} />
  // Mint NFT with Swarm storage
  /////////////////////////////////////////////////
  // export let chainId: number = undefined;
  /////////////////////////////////////////////////
  export let src: string = "";
  export let alt: string = undefined;
  export let pid: string = undefined;
  export let metadata: string = "{}";
  export let width = 100;
  export let display = false;
  /////////////////////////////////////////////////
  // let account: string;
  // $: $metamaskSigner && handleSigner().catch(console.error);
  // const handleSigner = async (): Promise<void> => {
  //   account = await $metamaskSigner.getAddress();
  // };

  // let address: string;

  // $: $metamaskSigner && chainId && handleChange();
  // const handleChange = async () => {
  //   // Get signer account
  //   account = await $metamaskSigner.getAddress();
  // };
  /////////////////////////////////////////////////
  let chainId: number;
  let account: string;
  let address: string;
  let readableAddress: Readable<string>;

  // ON network or account change
  $: $metamaskChainId && $metamaskSigner && handleChange().catch(console.error);
  const handleChange = async () => {
    chainId = $metamaskChainId;

    account = await $metamaskSigner.getAddress();
    console.log("handleChange", $metamaskChainId, account);

    if (src) {
      readableAddress = collectionStore.getDefaultSubStore($metamaskChainId, true, account);
      address = $readableAddress;
      console.log("handleChange ~ address", $readableAddress);
    }
  };
  /////////////////////////////////////////////////
  let file;

  $: src !== "" && handleWpFile().catch(console.error);
  const handleWpFile = async (): Promise<void> => {
    const blob = await fetch(src).then((r) => r.blob());
    file = new File([blob], alt, { type: blob.type });

    if (file) {
      let reader = new FileReader();
      reader.readAsDataURL(file);
      nftTitle = file.name;
      reader.onload = (e) => {
        image = e.target.result.toString();
      };
    }
  };
  /////////////////////////////////////////////////

  let nftTitle: string = "";

  let files: FileList;
  let image: string;

  // let ipfsImage: string;
  // let ipfsJson: string;
  let minting: number;
  let mintingTxResp: TransactionResponse;
  let mintedNft: NftType;
  let mintingError: string;

  /////////////////////////////////////////////////
  let swarmUploadedRef: string;
  let swarmJson: string;
  /////////////////////////////////////////////////
  let open = false;

  const openSwarmMintModal = () => {
    open = true;
  };

  /////////////////////////////////////////////////
  const sell = (e: Event): void => {
    e.preventDefault();
    location.href = nftOpenSeaUrl($metamaskChainId, mintedNft);
  };

  const view = (e: Event): void => {
    e.preventDefault();
    location.href = nftGetImageLink(mintedNft);
  };
  /////////////////////////////////////////////////

  const mintReset = (): void => {
    swarmUploadedRef = null;
    swarmJson = null;
    // ipfsImage = null;
    // ipfsJson = null;
    minting = 0;
    mintingTxResp = null;
    mintedNft = null;
    mintingError = null;
  };

  // DISPLAY image AFTER upload
  const fileload = () => {
    mintReset();
    file = null;

    if (files) {
      let reader = new FileReader();
      reader.readAsDataURL(files[0]);
      nftTitle = nftTitle || files[0].name;
      reader.onload = (e) => {
        image = e.target.result.toString();
      };

      file = files[0];
    }
  };

  const mint = async (): Promise<NftType> => {
    mintReset();

    if (image) {
      minting = 1;

      swarmUploadedRef = await nftMint1SwarmImage(file, nftTitle, file.type, file.size);
      // console.log("swarmUploadedRef", swarmUploadedRef);

      if (swarmUploadedRef) {
        minting = 2;

        swarmJson = await nftMint2SwarmJson(nftTitle, swarmUploadedRef, account, image, metadata);
        // console.log("json", swarmJson);

        if (swarmJson) {
          minting = 3;

          mintingTxResp = await nftMint3SwarmTxResponse(chainId, address, swarmJson, $metamaskSigner);
          // console.log("txResp", txResp);

          if (mintingTxResp) {
            minting = 4;

            mintedNft = await nftMint4Swarm(chainId, address, mintingTxResp, swarmJson, account);
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
          mintingError = "Problem while archiving metadata on Swarm.";
        }
      } else {
        mintingError = "Problem while archiving image on Swarm.";
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

{#if !src}
  <span on:click={() => openSwarmMintModal()} class="btn btn-default" title="Mint NFT">Mint Swarm NFT</span>

  {#if open}
    <div id="create-swarm-nft" class="modal-window" transition:fade>
      <div
        use:clickOutside={() => {
          open = false;
        }}
      >
        <div id="kredeum-create-nft">
          <div class="modal-content">
            <a href="./#" title="Close" class="modal-close"><i class="fa fa-times" /></a>

            <div class="modal-body">
              <div class="titre">
                <i class="fas fa-plus fa-left c-green" />Mint Swarm NFT
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
                        <a class="link" href={explorerNftUrl(chainId, mintedNft)} target="_blank"
                          >{nftUrl(mintedNft, 6)}</a
                        >
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
                            {nftSwarmMintTexts[minting]}
                          {/if}
                        </span>
                      </div>
                    </li>
                  {/if}

                  <li class={minting >= 2 ? "complete" : ""}>
                    <div class="flex"><span class="label">Swarm Image link</span></div>
                    <div class="flex">
                      {#if swarmUploadedRef}
                        <a class="link" href={swarmGatewayUrl(swarmUploadedRef)} target="_blank"
                          >{textShort(swarmUploadedRef, 15)}</a
                        >
                      {/if}
                    </div>
                  </li>
                  <li class={minting >= 3 ? "complete" : ""}>
                    <div class="flex"><span class="label">Swarm Metadata link</span></div>
                    <div class="flex">
                      {#if swarmJson}
                        <a class="link" href={swarmGatewayUrl(swarmJson)} target="_blank">{textShort(swarmJson, 15)}</a>
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
      </div>
    </div>
  {/if}
{:else}
  <main id="kredeum-mint">
    {#if display && src}
      <img {src} {alt} {width} /><br />
    {/if}

    {#if $metamaskSigner}
      {#if minting}
        {#if mintedNft}
          {#if getNetwork($metamaskChainId)?.openSea}
            <button on:click={sell} class="btn btn-small btn-sell" title="Sell on OpenSea">SELL NFT</button>
          {:else}
            <button on:click={view} class="btn btn-small btn-sell" title="View in Explorer">VIEW NFT</button>
          {/if}
        {:else if 1 <= minting && minting <= 5}
          <div>
            <button id="mint-button" class="btn btn-small btn-minting">MINTING {minting}...</button>
          </div>
          <div>
            <em>{nftSwarmMintTexts[minting]}</em>
          </div>
        {/if}
      {:else}
        <button id="mint-button-{pid || '0'}" on:click={mint} class="btn btn-small btn-mint"> MINT NFT </button>
      {/if}
    {:else}
      <small>
        <br /><AccountConnect />
      </small>
    {/if}

    {#if display}
      <small>
        <br />{urlToLink(src, `${src}@${alt}`)}

        <br /><a href={swarmGatewayUrl(swarmUploadedRef)} alt="">{swarmUploadedRef}</a>
      </small>
    {/if}
  </main>
{/if}

<style>
  #create-swarm-nft {
    visibility: visible;
    opacity: 1;
    pointer-events: auto;
  }
  /*************************/
  button.btn {
    color: white;
    background-color: #2a81de;
    border: 0px;
    margin: 10px;
  }
  button.btn-mint {
    background-color: #2a81de;
  }
  button.btn-minting {
    /* color: black; */
    background-color: grey;
  }
  button.btn-mint:hover {
    background-color: black;
    cursor: pointer;
  }
  button.btn-sell {
    background-color: #36d06f;
  }
</style>
