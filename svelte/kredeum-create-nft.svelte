<script lang="ts">
  import type { Collection } from "../lib/kconfig";
  import type { Signer } from "ethers";
  import type { Nft } from "../lib/ktypes";

  import KredeumSelectCollection from "./kredeum-select-collection.svelte";
  import { mintImagePinUrl, mintImagePinJson, mintImageCallContract } from "../lib/kmint";
  import { ipfsUrl, ipfsGatewayUrl } from "../lib/knfts";

  export let chainId: number = undefined;
  export let address: string = undefined;
  export let signer: Signer = undefined;
  export let collection: Collection = undefined;

  let files, image, name;
  $: if (files) {
    let reader = new FileReader();
    reader.readAsDataURL(files[0]);
    name = files[0].name;
    reader.onload = (e) => {
      image = e.target.result;
    };
  }

  const mint = async (): Promise<Nft> => {
    console.log("mint image", image);
    const cidImage = await mintImagePinUrl(image);
    console.log("cidImage", cidImage);

    const nftData = {
      name,
      description: name || "",
      cid: cidImage,
      image: ipfsGatewayUrl(cidImage),
      ipfs: ipfsUrl(cidImage),
      origin: image,
      minter: await signer.getAddress(),
      metadata: {}
    };
    const cidJson = await mintImagePinJson(nftData);

    const nft: Nft = await mintImageCallContract(chainId, collection.address, cidJson, signer);

    return nft;
  };
</script>

<div id="kredeum-create-nft">
  <div class="modal-content">
    <a href="." title="Close" class="modal-close"><i class="fa fa-times"></i></a>

    <div class="modal-body">
      <div class="titre"><i class="fas fa-plus fa-left c-green"></i>Mint NFT</div>

      <div class="section">
        <span class="label label-big">Upload an image</span>

        <div class="box-file">
          {#if image}
            <img src="{image}" alt="nft" />
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
    </div>
  </div>
</div>
