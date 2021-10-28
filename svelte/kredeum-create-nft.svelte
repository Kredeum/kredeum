<script lang="ts">
  import type { Collection } from "../lib/kconfig";
  import type { Signer } from "ethers";
  import type { Nft } from "../lib/ktypes";

  import KredeumSelectCollection from "./kredeum-select-collection.svelte";
  import { mintImagePinUrl, mintImagePinJson, mintImageCallContract } from "../lib/kmint";
  import { ipfsUrl, ipfsGatewayUrl, explorerTxLink, explorerNftLink } from "../lib/knfts";
  import { MintResponse, MintReceipt, MintTokenID, MintNft } from "../lib/open-nfts";

  export let chainId: number = undefined;
  export let address: string = undefined;
  export let signer: Signer = undefined;
  export let collection: Collection = undefined;

  let nftMinted: Nft;
  let minting: boolean;
  let mintingTxHash: string;

  let files, image, imageName;

  $: if (files) {
    let reader = new FileReader();
    reader.readAsDataURL(files[0]);
    imageName = files[0].name;
    reader.onload = (e) => {
      image = e.target.result;
    };
  }

  const mint = async (): Promise<Nft> => {
    minting = true;
    mintingTxHash = null;
    nftMinted = null;

    const signerAddress = await signer.getAddress();

    console.log("mint image");
    const cidImage = await mintImagePinUrl(image);
    console.log("cidImage", cidImage);

    const nftData = {
      name: imageName,
      description: imageName || "",
      cid: cidImage,
      image: ipfsGatewayUrl(cidImage),
      ipfs: ipfsUrl(cidImage),
      origin: image,
      minter: signerAddress,
      metadata: {}
    };
    const cidJson = await mintImagePinJson(nftData);
    const urlJson = ipfsGatewayUrl(cidJson);

    console.log("MintResponse", chainId, collection.address, urlJson, signer);
    const txResp = await MintResponse(chainId, collection.address, urlJson, signer);
    console.log("txResp", txResp);
    mintingTxHash = txResp.hash;

    const txReceipt = await MintReceipt(txResp);
    console.log("txReceipt", txReceipt);

    const tokenID = MintTokenID(txReceipt);
    console.log("tokenID", tokenID);

    nftMinted = await MintNft(chainId, collection.address, tokenID, urlJson, signerAddress);
    console.log("nftMinted", nftMinted);

    return nftMinted;
  };
</script>

<div id="kredeum-create-nft">
  <div class="modal-content">
    <a href="." title="Close" class="modal-close"><i class="fa fa-times"></i></a>

    <div class="modal-body">
      {#if nftMinted}
        <div class="titre">
          <i class="fas fa-check fa-left c-green"></i>
          NFT minted @ {@html explorerNftLink(chainId, nftMinted)}
        </div>
      {:else if minting}
        <div class="titre">
          <i class="fas fa-sync fa-left c-green"></i>Minting your NFT...
        </div>
        <div class="section">
          {#if mintingTxHash}
            Wait till completed, it may takes one minute or more.
          {:else}
            Sign the transaction
          {/if}
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
      {#if mintingTxHash}
        <div class="section">
          Transaction: {@html explorerTxLink(chainId, mintingTxHash)}
        </div>
      {/if}
      {#if image}
        <div class="section">
          <img src="{image}" alt="nft" />
        </div>
      {/if}
    </div>
  </div>
</div>
