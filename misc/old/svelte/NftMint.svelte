<script lang="ts">
  import type { TransactionResponse } from "@ethersproject/abstract-provider";

  import type { NftType } from "lib/ktypes";
  import { nftIpfsMintTexts, nftMint1IpfsImage, nftMint2IpfsJson, nftMint3TxResponse, nftMint4 } from "lib/knft-mint";
  import { textShort, ipfsGatewayUrl, explorerTxUrl, explorerNftUrl, nftUrl } from "lib/kconfig";

  import { metamaskSigner } from "main/metamask";

  import CollectionList from "../../../svelte/components/Collection/CollectionList.svelte";

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
  let nftDescription: string = "";

  let files: FileList;
  let image: string;

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

  // DISPLAY image AFTER upload
  const fileload = () => {
    mintReset();

    if (files) {
      let reader = new FileReader();
      reader.readAsDataURL(files[0]);
      nftTitle = nftTitle || files[0].name;
      nftDescription = nftDescription || files[0].name;
      reader.onload = (e) => {
        image = e.target.result.toString();
      };
    }
  };

  const mint = async (): Promise<NftType> => {
    mintReset();

    if (image) {
      minting = 1;

      ipfsImage = await nftMint1IpfsImage(image);
      // console.log("ipfsImage", ipfsImage);

      if (ipfsImage) {
        minting = 2;

        ipfsJson = await nftMint2IpfsJson(nftTitle, nftDescription, ipfsImage, account, image);
        // console.log("json", ipfsJson);

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
                    {nftIpfsMintTexts[minting]}
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
            <input type="text" placeholder="My NFT description" bind:value={nftDescription} id="description-nft" />
          </div>
        </div>

        <div class="section">
          <span class="label label-big">Media type</span>
          <div class="box-fields">
            <input class="box-field" id="create-type-video" name="media-type" type="checkbox" value="Video" disabled />
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

            <input class="box-field" id="create-type-texte" name="media-type" type="checkbox" value="Text" disabled />
            <label class="field" for="create-type-texte"><i class="fas fa-file-alt" />Text</label>

            <input class="box-field" id="create-type-music" name="media-type" type="checkbox" value="Music" disabled />
            <label class="field" for="create-type-music"><i class="fas fa-music" />Music</label>

            <input class="box-field" id="create-type-web" name="media-type" type="checkbox" value="Web" disabled />
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
