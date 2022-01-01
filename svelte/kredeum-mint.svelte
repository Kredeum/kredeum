<script lang="ts">
  import type { Nft, Network, Collection } from "lib/ktypes";
  import type { JsonRpcProvider, JsonRpcSigner } from "@ethersproject/providers";

  import KredeumMetamask from "./kredeum-metamask.svelte";

  import { nftMintTexts, nftMint1CidImage, nftMint2CidJson, nftMint3TxResponse, nftMint4 } from "lib/knft-mint";
  import { ipfsGatewayLink, urlToLink, nftOpenSeaUrl, nftImageLink } from "lib/knfts";
  import { getNetwork, getOpenNFTsAddress } from "lib/kconfig";

  // export let key: string = undefined;
  // export let metadata: string = undefined;
  export let alt: string = undefined;
  export let src: string = undefined;
  export let pid: string = undefined;
  export let width = 100;
  export let display = false;
  // down to component with default
  export let collection: Collection = undefined;

  import { chainId, signer, provider } from "./network";
  import { collectionGet } from "lib/kcollection-get";

  let mintedNft: Nft;
  let minting: number;

  let cidImage: string;
  let network: Network;

  let signerAddress: string;

  // ON network or account change
  $: handleChange($chainId, $signer, $provider);

  const handleChange = async (_chainId: number, _signer: JsonRpcSigner, _provider: JsonRpcProvider) => {
    if (_chainId && _signer) {
      signerAddress = await _signer.getAddress();
      // console.log("kredeum-mint handleChange", _chainId, signerAddress);

      const collectionAddress =
        // default user collection
        localStorage.getItem(`defaultCollection/${$chainId}/${signerAddress}`) ||
        // default OpenNFTs collection
        (await getOpenNFTsAddress($chainId, _provider));
      collection = collectionGet(_chainId, collectionAddress);
    }
  };

  const sell = async (e: Event): Promise<void> => {
    e.preventDefault();

    location.href = nftOpenSeaUrl($chainId, mintedNft);
  };

  const view = async (e: Event): Promise<void> => {
    e.preventDefault();

    location.href = nftImageLink(mintedNft);
  };

  const mint = async (e: Event): Promise<Nft> => {
    e.preventDefault();
    // console.log("collection", collection);
    cidImage = null;
    mintedNft = null;

    minting = 1;

    cidImage = await nftMint1CidImage(src);
    // console.log("cidImage", cidImage);

    minting = 2;

    const cidJson = await nftMint2CidJson(alt, cidImage, signerAddress, src);
    // console.log("json", cidJson);

    minting = 3;

    const mintingTxResp = await nftMint3TxResponse($chainId, collection, cidJson, $signer);
    // console.log("txResp", txResp);

    minting = 4;

    mintedNft = await nftMint4($chainId, collection, mintingTxResp, cidJson, signerAddress);
    // console.log("mintedNft", mintedNft);

    minting = 5;

    return mintedNft;
  };
</script>

<main id="kredeum-mint">
  {#if display && src}
    <img {src} {alt} {width} /><br />
  {/if}

  {#if $signer}
    {#if minting}
      {#if mintedNft}
        {#if network?.openSea}
          <button on:click={sell} class="btn btn-small btn-sell" title="Sell on OpenSea">SELL NFT</button>
        {:else}
          <button on:click={view} class="btn btn-small btn-sell" title="View in Explorer">VIEW NFT</button>
        {/if}
      {:else if 1 <= minting && minting <= 5}
        <div>
          <button id="mint-button" class="btn btn-small btn-minting">MINTING {minting}...</button>
        </div>
        <div>
          <em>{nftMintTexts[minting]}</em>
        </div>
      {/if}
    {:else}
      <button id="mint-button-{pid}" on:click={mint} class="btn btn-small btn-mint"> MINT NFT </button>
    {/if}
  {:else}
    <small>
      <br /><KredeumMetamask autoconnect="off" />
    </small>
  {/if}

  {#if display}
    <small>
      <br />{urlToLink(src, `${src}@${alt}`)}

      <br />{ipfsGatewayLink(cidImage)}
    </small>
  {/if}
</main>

<style>
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
