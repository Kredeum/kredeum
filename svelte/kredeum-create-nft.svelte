<script lang="ts">
  import type { Collection } from "lib/ktypes";
  import type { Nft } from "lib/ktypes";
  import type { JsonRpcSigner } from "@ethersproject/providers";

  import KredeumListCollections from "./kredeum-list-collections.svelte";

  import { mintingTexts, mint1cidImage, mint2cidJson, mint3TxResponse, mint4Nft } from "lib/kmint";
  import { textShort, ipfsGatewayUrl, explorerTxUrl, explorerNftUrl } from "lib/knfts";
  import { TransactionResponse } from "@ethersproject/abstract-provider";
  import { nftUrl } from "lib/kconfig";

  import { chainId, signer, owner } from "./network";

  // down to component
  export let collection: Collection = undefined;

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // <KredeumListCollections bind:collection filter />;
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////

  let mintedNft: Nft;
  let minting = 0;
  let mintingTxResp: TransactionResponse;

  let nftTitle: string;
  let cidImage: string;
  let cidJson: string;
  let imageName = "My NFT title";

  let files: FileList;
  let image: string;

  let errormsg = "";

  // DISPLAY image AFTER upload
  /*   $: if (files) {
    let reader = new FileReader();
    reader.readAsDataURL(files[0]);
    imageName = files[0].name;
    reader.onload = (e) => {
      image = `${e.target.result}`;
    };
  } */

  function fileload() {
    if (files) {
      let reader = new FileReader();
      reader.readAsDataURL(files[0]);
      imageName = files[0].name;
      //nftTitle = imageName;
      reader.onload = (e) => {
        image = `${e.target.result}`;
      };
    }
  }

  const mint = async (): Promise<Nft> => {
    errormsg = null;
    cidImage = null;
    cidJson = null;
    mintingTxResp = null;
    mintedNft = null;

    console.log("image", image);
    console.log("nftTitle", nftTitle);
    if (image == undefined) {
      errormsg = "Missing NFT file. Sorry can't mint.";
      return;
    }

    if (nftTitle == undefined) {
      errormsg = "Missing NFT title. Sorry can't mint.";
      return;
    }
    minting = 1;

    cidImage = await mint1cidImage(image);
    // console.log("cidImage", cidImage);

    minting = 2;

    // cidJson = await mint2cidJson(imageName, cidImage, $owner, image);
    cidJson = await mint2cidJson(nftTitle, cidImage, $owner, image);
    // console.log("json", cidJson);

    minting = 3;

    mintingTxResp = await mint3TxResponse($chainId, collection.address, cidJson, $signer);
    // console.log("txResp", txResp);

    minting = 4;

    mintedNft = await mint4Nft($chainId, collection.address, mintingTxResp, cidJson, $owner);
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
                  >NFT Minted, congrats!
                  <i class="fas fa-check fa-left c-green" />
                </span>
              </div>
              <div class="flex">
                <a class="link" href={explorerNftUrl($chainId, mintedNft)} target="_blank"
                  >{nftUrl(mintedNft, 6)}</a
                >
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
                  {#if 1 <= minting && minting <= 5}
                    {mintingTexts[minting]}
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
              {#if mintingTxResp}
                <a class="link" href={explorerTxUrl($chainId, mintingTxResp.hash)} target="_blank"
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
          <span class="label label-big">NFT title</span>
          <div class="form-field">
            <input type="text" placeholder="My NFT title" bind:value={nftTitle} id="title-nft" />
          </div>
        </div>
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
          <KredeumListCollections bind:collection filter />
        </div>

        <div class="txtright">
          <button class="btn btn-default btn-sell" on:click={mint}>Mint NFT</button>
        </div>
        <div class="section">
          <p class="txtright errormsg">
            {errormsg}
          </p>
        </div>
      {/if}
    </div>
  </div>
</div>
