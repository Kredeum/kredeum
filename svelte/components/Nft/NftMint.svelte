<script lang="ts">
  import type { TransactionResponse } from "@ethersproject/abstract-provider";
  import type { NftType } from "@lib/ktypes";

  import { getContext } from "svelte";
  import { Writable } from "svelte/store";

  import { metamaskChainId, metamaskSigner, metamaskProvider } from "@main/metamask";

  import {
    nftMintTexts,
    nftMint1IpfsImage,
    nftMint2IpfsJson,
    nftMint1SwarmImage,
    nftMint2SwarmJson,
    nftMint3TxResponse,
    nftMint4
  } from "@lib/knft-mint";
  import {
    textShort,
    swarmGatewayUrl,
    explorerTxUrl,
    explorerNftUrl,
    nftUrl,
    storageLinkToUrlHttp,
    sleep
  } from "@lib/kconfig";
  /////////////////////////////////////////////////
  import CollectionList from "../Collection/CollectionList.svelte";

  import { fade } from "svelte/transition";
  import { clickOutside } from "@helpers/clickOutside";

  import { getDefaultCollPrice } from "@lib/kautomarket";

  /////////////////////////////////////////////////
  //  <NftMint {storage} {nodeUrl}? {batchId}? />
  // Mint NFT button with Ipfs | Swarm storage (button + mint modal)
  /////////////////////////////////////////////////
  export let storage: string;

  export let nodeUrl: string = undefined;
  export let batchId: string = undefined;

  // Context for refreshCollectionList & refreshNftsList & refreshing
  ///////////////////////////////////////////////////////////
  let refreshCollectionList: Writable<number> = getContext("refreshCollectionList");
  let refreshNftsList: Writable<number> = getContext("refreshNftsList");
  let refreshing: Writable<boolean> = getContext("refreshing");
  ///////////////////////////////////////////////////////////

  /////////////////////////////////////////////////
  let chainId: number;
  let account: string;
  let address: string;

  let files: FileList;
  let file: File;
  let image: string;
  let nftTitle: string = "";
  let nftDescription: string = "";
  let nftMintingPrice: string;
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
  const handleResetAfterMint = () => {
    files = null;
    file = null;
    image = null;
    nftTitle = null;
    nftDescription = null;
    mintReset();
  };

  const openMintModal = () => {
    open = true;
  };

  const closeMintModal = () => {
    open = false;
  };

  $: chainId && address && $metamaskSigner && handleDefaultAutomarketValues();
  const handleDefaultAutomarketValues = async () => {
    if (chainId && address && $metamaskSigner) {
      nftMintingPrice = await getDefaultCollPrice(chainId, address, $metamaskSigner);
    }
  };

  /////////////////////////////////////////////////
  // ON network or account change
  $: $metamaskChainId && $metamaskSigner && handleChange().catch(console.error);
  const handleChange = async () => {
    chainId = $metamaskChainId;

    account = await $metamaskSigner.getAddress();
    // console.log("handleChange", $metamaskChainId, account);
  };

  /////////////////////////////////////////////////
  // ON modal AFTER upload get file & nftTitle & image to DISPLAY {image}
  const fileload = () => {
    mintReset();
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

  /////////////////////////////////////////////////
  const mintReset = (): void => {
    storageImg = null;
    storageJson = null;
    minting = 0;
    mintingTxResp = null;
    mintedNft = null;
    mintingError = null;
  };

  /////////////////////////////////////////////////
  const mint = async (): Promise<NftType> => {
    mintReset();

    if (image) {
      minting = 1;

      storageImg =
        "ipfs" === storage
          ? await nftMint1IpfsImage(image)
          : "swarm" === storage
          ? await nftMint1SwarmImage(file, nftTitle, file.type, nodeUrl, batchId, file.size)
          : "";

      if (storageImg) {
        minting = 2;

        storageJson =
          "ipfs" === storage
            ? await nftMint2IpfsJson(nftTitle, nftDescription, storageImg, account, image)
            : "swarm" === storage
            ? swarmGatewayUrl(
                await nftMint2SwarmJson(nftTitle, nftDescription, storageImg, account, image, nodeUrl, batchId)
              )
            : "";

        if (storageJson) {
          minting = 3;

          mintingTxResp = await nftMint3TxResponse(chainId, address, storageJson, $metamaskSigner);

          // console.log("txResp", txResp);

          if (mintingTxResp) {
            minting = 4;

            mintedNft = await nftMint4(chainId, address, mintingTxResp, storageJson, account);
            // console.log("mintedNft", mintedNft);

            if (mintedNft) {
              minting = 5;

              $refreshCollectionList += 1;

              const mintingTxReceipt = await mintingTxResp.wait();
              console.log("mintingTxReceipt", mintingTxReceipt);
              const blockTx = mintingTxReceipt.blockNumber;

              do {
                $refreshing = true;
                await sleep(1000);
              } while ((await $metamaskProvider.getBlockNumber()) <= blockTx);

              $refreshNftsList += 1;
            } else {
              mintingError = "Problem with sent transaction.";
            }
          } else {
            mintingError = "Problem while sending transaction.";
          }
        } else {
          mintingError = `Problem while archiving metadata on ${storage.charAt(0).toUpperCase() + storage.slice(1)}.`;
        }
      } else {
        mintingError = `Problem while archiving image on ${storage.charAt(0).toUpperCase() + storage.slice(1)}.`;
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

<span on:click={() => openMintModal()} class="btn btn-default" title="Mint NFT">Mint NFT</span>

{#if open}
  <div id="kre-create-mint-nft" class="mint-modal-window" transition:fade>
    <div
      use:clickOutside={() => {
        closeMintModal();
      }}
    >
      <div id="kredeum-create-nft">
        <div class="mint-modal-content">
          <a href="./#" on:click={closeMintModal} title="Close" class="modal-close"><i class="fa fa-times" /></a>

          <div class="mint-modal-body">
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
                          {nftMintTexts[minting]}
                        {/if}
                      </span>
                    </div>
                  </li>
                {/if}

                <li class={minting >= 2 ? "complete" : ""}>
                  <div class="flex"><span class="label">Image link</span></div>
                  <div class="flex">
                    {#if storageImg}
                      <a class="link" href={storageLinkToUrlHttp(storageImg)} target="_blank"
                        >{textShort(storageImg, 15)}</a
                      >
                    {/if}
                  </div>
                </li>
                <li class={minting >= 3 ? "complete" : ""}>
                  <div class="flex"><span class="label">Metadata link</span></div>
                  <div class="flex">
                    {#if storageJson}
                      <a class="link" href={storageLinkToUrlHttp(storageJson)} target="_blank"
                        >{textShort(storageJson, 15)}</a
                      >
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
