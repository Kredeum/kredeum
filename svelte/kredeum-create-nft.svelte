<script lang="ts">
  import { nftExplorerLink } from "../lib/knfts";
  import type { Signer } from "ethers";
  import type { Nft } from "../lib/ktypes";
  import type { Collection } from "../lib/kconfig";

  import KredeumSelectCollection from "./kredeum-select-collection.svelte";
  import { mintImagePinUrl, mintImagePinJson, mintImageCallContract } from "../lib/kmint";
  import {
    textShort,
    ipfsUrl,
    ipfsGatewayUrl,
    ipfsGatewayLink,
    explorerTxLink,
    explorerNftLink
  } from "../lib/knfts";
  import { MintResponse, MintReceipt, MintTokenID, MintedNft } from "../lib/open-nfts";
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
    cidJson = await mintImagePinJson(nftData);
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
    <a href="." title="Close" class="modal-close"><i class="fa fa-times"></i></a>

    <div class="modal-body">
      {#if mintedNft}
        <div class="titre">
          <i class="fas fa-check fa-left c-green"></i>
          NFT '{@html explorerNftLink(chainId, mintedNft)}' minted!
        </div>
      {:else if minting}
        <div class="titre">
          <i class="fas fa-sync fa-left c-green"></i>Minting your NFT...
        </div>
        <div class="section">
          <i>
            {#if minting == 1}
              Wait till Image stored on IPFS
            {:else if minting == 2}
              Wait till Metadata stored on IPFS
            {:else if minting == 3}
              Please, sign the transaction
            {:else if minting == 4}
              Wait till transaction completed, it may takes one minute or more...
            {/if}
          </i>
        </div>
      {:else}
        <div class="titre"><i class="fas fa-plus fa-left c-green"></i>Mint NFT</div>

        <div class="section">
          <span class="label label-big">Upload an image</span>

          <div class="box-file">
            {#if image}
              {imageName} uploaded
            {:else}
              <input type="file" id="file" name="file" bind:files />
            {/if}
          </div>
        </div>
        <div class="section">
          <span class="label label-big">Choose an existing collection</span>

          <KredeumSelectCollection bind:address bind:chainId bind:collection />
        </div>

        <div class="txtright">
          <button class="btn btn-default btn-sell" on:click="{mint}">Mint NFT</button>
        </div>
      {/if}

      {#if image}
        <div class="section">
          <img src="{image}" alt="nft" />
        </div>
      {/if}
      {#if minting}
        <div class="section">
          Image IPFS CID:
          {#if cidImage}
            {@html ipfsGatewayLink(cidImage)}
          {/if}
        </div>
        <div class="section">
          Metadata IPFS CID:
          {#if cidJson}
            {@html ipfsGatewayLink(cidJson)}
          {/if}
        </div>
        <div class="section">
          Transaction:
          {#if mintingTxHash}
            {@html explorerTxLink(chainId, mintingTxHash)}
          {/if}
        </div>
        <div class="section">
          Token ID:
          {#if tokenID}
            {tokenID}
          {/if}
        </div>
        <div class="section">
          NFT :
          {#if mintedNft}
            {@html nftExplorerLink(mintedNft)}
          {/if}
        </div>
      {/if}
    </div>
  </div>
</div>
