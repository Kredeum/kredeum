<script lang="ts">
  import { nftExplorerLink } from "lib/knfts";
  import type { Signer } from "ethers";
  import type { Nft } from "lib/ktypes";
  import type { Collection } from "lib/kconfig";

  import KredeumListCollection from "./kredeum-list-collections.svelte";
  import { mintImagePinUrl, mintImagePinJson, mintImageCallContract } from "lib/kmint";
  import {
    textShort,
    ipfsUrl,
    ipfsGatewayUrl,
    explorerTxUrl,
    explorerNftUrl,
    nftName
  } from "lib/knfts";
  import { MintResponse, MintReceipt, MintTokenID, MintedNft } from "lib/klist-nfts";
  import { onMount } from "svelte";

  export let chainId: number = undefined;
  export let address: string = undefined;
  export let signer: Signer = undefined;
  export let collection: Collection = undefined;

  let mintedNft: Nft;
  let minting: number;
  let mintingTxHash: string;
  let cidImage: string;
  let cidJson: string;
  let tokenID: string;
  let imageName: string;

  let files, image;

  $: if (files) {
    let reader = new FileReader();
    reader.readAsDataURL(files[0]);
    imageName = files[0].name;
    reader.onload = (e) => {
      image = e.target.result;
    };
  }

  onMount(async () => {
    minting = 0;
  });

  const mint = async (): Promise<Nft> => {
    minting = 1;

    mintingTxHash = null;
    mintedNft = null;
    cidImage = null;
    cidJson = null;

    const signerAddress = await signer.getAddress();

    cidImage = await mintImagePinUrl(image);
    // console.log("cidImage", cidImage);

    minting = 2;

    const nftData = {
      name: imageName,
      description: imageName || "",
      cid: cidImage,
      image: ipfsGatewayUrl(cidImage),
      ipfs: ipfsUrl(cidImage),
      origin: textShort(image, 140),
      minter: signerAddress,
      metadata: {}
    };
    cidJson = await mintImagePinJson(nftData as Nft);
    const urlJson = ipfsGatewayUrl(cidJson);
    // console.log("urlJson", urlJson);

    minting = 3;

    // console.log("MintResponse", chainId, collection.address, urlJson, signer);
    const txResp = await MintResponse(chainId, collection.address, urlJson, signer);
    // console.log("txResp", txResp);
    mintingTxHash = txResp.hash;

    minting = 4;

    const txReceipt = await MintReceipt(txResp);
    // console.log("txReceipt", txReceipt);

    tokenID = MintTokenID(txReceipt);
    // console.log("tokenID", tokenID);

    mintedNft = await MintedNft(chainId, collection.address, tokenID, urlJson, signerAddress);
    mintedNft.cidJson = cidJson;
    // console.log("mintedNft", mintedNft);

    minting = 5;

    return mintedNft;
  };
</script>

<div id="kredeum-create-nft">
  <div class="modal-content">
    <a href="." title="Close" class="modal-close"><i class="fa fa-times" /></a>

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
                  >NFT '<a class="link" href={explorerNftUrl(chainId, mintedNft)} target="_blank"
                    >{nftName(mintedNft)}</a
                  >' minted!
                  <i class="fas fa-check fa-left c-green" />
                </span>
              </div>
            </li>
          {:else}
            <li>
              <div class="flex">
                <span class="titre">
                  Minting NFT
                  <i class="fas fa-spinner fa-left c-green refresh" />
                </span>
              </div>
              <div class="flex">
                <span class="t-light">
                  {#if minting == 1}
                    Wait till Image stored on IPFS
                  {:else if minting == 2}
                    Wait till Metadata stored on IPFS
                  {:else if minting == 3}
                    Please, sign the transaction
                  {:else if minting == 4}
                    Wait till transaction completed, it may takes one minute or more...
                  {/if}
                </span>
              </div>
            </li>
          {/if}

          <li class={minting >= 2 ? "complete" : ""}>
            <div class="flex"><span class="label">Image ipfs cid</span></div>
            <div class="flex">
              {#if cidImage}
                <a class="link" href={ipfsGatewayUrl(cidImage)} target="_blank"
                  >{textShort(cidImage, 15)}</a
                >
              {/if}
            </div>
          </li>
          <li class={minting >= 3 ? "complete" : ""}>
            <div class="flex"><span class="label">Metadata ipfs cid</span></div>
            <div class="flex">
              {#if cidJson}
                <a class="link" href={ipfsGatewayUrl(cidJson)} target="_blank"
                  >{textShort(cidJson, 15)}</a
                >
              {/if}
            </div>
          </li>
          <li class={minting >= 4 ? "complete" : ""}>
            <div class="flex"><span class="label">Transaction</span></div>
            <div class="flex">
              {#if mintingTxHash}
                <a class="link" href={explorerTxUrl(chainId, mintingTxHash)} target="_blank"
                  >{textShort(mintingTxHash, 15)}</a
                >
              {/if}
            </div>
          </li>
          <li class={minting >= 5 ? "complete" : ""}>
            <div class="flex"><span class="label">Token ID</span></div>
            <div class="flex">
              {#if tokenID}
                <strong>{tokenID}</strong>
              {/if}
            </div>
          </li>
          <li class={mintedNft ? "complete" : ""}>
            <div class="flex"><span class="label">NFT</span></div>
            <div class="flex">
              {#if mintedNft}
                {@html nftExplorerLink(mintedNft, 6)}
              {/if}
            </div>
          </li>
        </ul>
      {:else}
        <div class="section">
          <div class="box-file">
            {#if image}
              <div class="media media-photo mt-20">
                <img src={image} alt="nft" />
              </div>
            {:else}
              <input type="file" id="file" name="file" bind:files />
            {/if}
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
              value="Texte"
              disabled
            />
            <label class="field" for="create-type-texte"><i class="fas fa-file-alt" />Texte</label>

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
          <span class="label label-big">Add to an existing collection ?</span>
          <KredeumListCollection bind:address bind:chainId bind:collection popup />
        </div>

        <div class="txtright">
          <button class="btn btn-default btn-sell" on:click={mint}>Mint NFT</button>
        </div>
      {/if}
    </div>
  </div>
</div>
