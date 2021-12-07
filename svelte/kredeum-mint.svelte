<script lang="ts">
  import type { Nft, Network } from "lib/ktypes";
  import type { Signer } from "ethers";

  import KredeumMetamask from "./kredeum-metamask.svelte";

  import { mintingTexts, mint1cidImage, mint2cidJson, mint3TxResponse, mint4Nft } from "lib/kmint";
  import { ipfsGatewayLink, urlToLink, nftOpenSeaUrl } from "lib/knfts";
  import { getNetwork } from "lib/kconfig";

  export const key: string = undefined;
  export const metadata: string = undefined;
  export let alt: string = undefined;
  export let src: string = undefined;
  export let pid: string = undefined;
  export let collection: string = undefined;
  export let width = 100;
  export let display = false;

  let mintedNft: Nft;
  let minting: number;

  let cidImage: string;
  let signer: Signer;
  let owner = "";
  let network: Network;

  let chainId;
  let chainIdOld;

  // SET owner WHEN signer change
  $: setOwner(signer);
  const setOwner = async (_signer) => (owner = await _signer.getAddress());

  // CONTRACT OR NETWORK CHANGE
  $: if (chainId) {
    // console.log("kredeum-mint chainId changed", chainId);
    init();
  }

  async function init() {
    // console.log(`kredeum-mint init ${chainId}`, key, metadata);
    network = getNetwork(chainId);
    if (network) {
      if (!collection && chainId != chainIdOld) {
        // chain changed : force collection to default
        collection = network.openNFTs;
      }

      chainIdOld = chainId;
    }
  }

  const sell = async (e: Event): Promise<void> => {
    e.preventDefault();

    location.href = nftOpenSeaUrl(chainId, mintedNft);
  };

  const mint = async (e: Event): Promise<Nft> => {
    e.preventDefault();

    cidImage = null;
    mintedNft = null;

    const signerAddress = await signer.getAddress();

    minting = 1;

    cidImage = await mint1cidImage(src);
    // console.log("cidImage", cidImage);

    minting = 2;

    const cidJson = await mint2cidJson(alt, cidImage, signerAddress, src);
    // console.log("json", cidJson);

    minting = 3;

    const mintingTxResp = await mint3TxResponse(chainId, collection, cidJson, signer);
    // console.log("txResp", txResp);

    minting = 4;

    mintedNft = await mint4Nft(chainId, collection, mintingTxResp, cidJson, signerAddress);
    // console.log("mintedNft", mintedNft);

    minting = 5;

    return mintedNft;
  };
</script>

<main id="kredeum-mint">
  {#if display && src}
    <img {src} {alt} {width} /><br />
  {/if}

  {#if owner}
    {#if minting}
      {#if mintedNft}
        <button on:click={sell} class="btn btn-small btn-sell">SELL NFT</button>
      {:else if 1 <= minting && minting <= 5}
        <div>
          <button id="mint-button" class="btn btn-small btn-minting">MINTING {minting}...</button>
        </div>
        <div>
          <em>{mintingTexts[minting]}</em>
        </div>
      {/if}
    {:else}
      <button id="mint-button-{pid}" on:click={mint} class="btn btn-small btn-mint">
        MINT NFT
      </button>
    {/if}
  {:else}
    <small>
      <br /><KredeumMetamask autoconnect="off" bind:chainId bind:signer />
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
