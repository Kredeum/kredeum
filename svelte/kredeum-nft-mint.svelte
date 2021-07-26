<svelte:options tag="kredeum-nft-mint" />

<script>
  import OpenNFTs from "../lib/open-nfts.mjs";
  import NftStorage from "../lib/nft-storage.mjs";
  import Metamask from "./kredeum-metamask.svelte";
  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();
  const ipfsGateway = "https://ipfs.io/ipfs";

  export let key = undefined;
  export let alt = undefined;
  export let src = undefined;
  export let pid = undefined;
  export let metadata = undefined;
  export let width = 100;
  export let display = false;
  export let minted = "";

  let minting = false;
  let cidImage;
  let cidJson;

  let signer = "";
  let address = "";
  let network = "";
  let openSea;

  let chainId = 0;

  const openNFTs = new OpenNFTs();

  $: if (chainId > 0) initContract(chainId);

  async function initContract(_chainId) {
    [network] = openNFTs.setContract(_chainId);

    await openNFTs.initContract();

    if (network) {
      openSea = openNFTs.network?.openSea;
    } else {
      console.log("Wrong chainId: switch to Matic network on Polygon", _chainId);
      alert("Switch to a supported network");
    }
  }

  async function nftMint() {
    //console.log('nftMint src alt', src, alt);

    if (signer) {
      minting = true;

      const nftStorage = new NftStorage(key);
      cidImage = await nftStorage.pinUrl(src);
      cidJson = await nftStorage.pinJson({
        name: alt,
        description: alt,
        cid: cidImage,
        image: `${ipfsGateway}/${cidImage}`,
        ipfs: "ipfs://" + cidImage,
        origin: src,
        minter: address,
        metadata: JSON.parse(metadata || {})
      });

      try {
        minted = await openNFTs.Mint(signer, `${ipfsGateway}/${cidJson}`);
        dispatch("token", { nid: minted.nid });
      } catch (e) {
        console.error("Minting ERROR", e);
        minted = false;
        minting = false;
      }
    } else {
      alert("You must be connected with Metamask to Mint");
    }
  }
</script>

<main>
  {#if display && src}
    <img src="{src}" alt="{alt}" width="{width}" /><br />
  {/if}

  {#if address}
    {#if minted}
      <a href="{`${openSea?.assets}/${minted.contract}/${minted.tokenID}`}">
        <button class="sell">SELL NFT</button>
      </a>
      <!-- </a> -->
    {:else if minting}
      <button id="mint-button" class="minting">MINTING...</button>
    {:else if !network}
      <button id="mint-button" class="switch">Switch to MATIC</button>
    {:else}
      <button id="mint-button-{pid}" on:click="{nftMint}" class="mint-button mint">MINT NFT</button>
    {/if}

    {#if display}
      <small>
        <br /><a href="{src}">{src}@{alt}</a>

        <br /><a href="{ipfsGateway}/{cidImage}">{cidImage}@ipfs</a>
      </small>
    {/if}
  {:else}
    <small>
      <br /><Metamask autoconnect="off" bind:address bind:chainId bind:signer />
    </small>
  {/if}
</main>

<style>
  button {
    color: white;
    background-color: #2a81de;
    border: 0px;
    margin: 10px;
  }
  button:hover {
    cursor: pointer;
  }
  button.switch {
    background-color: grey;
  }
  button.mint:hover {
    background-color: black;
    cursor: pointer;
  }
  button.mint {
    background-color: #2a81de;
  }
  button.minting {
    color: black;
    background-color: grey;
  }
  button.sell {
    background-color: #36d06f;
  }
</style>
