<svelte:options tag="kredeum-nft-mint" />

<script>
  import OpenNfts from "../lib/open-nfts.mjs";
  import NftStorage from "../lib/nft-storage.mjs";
  import Metamask from "./kredeum-metamask.svelte";
  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();
  const ipfsGateway = "https://ipfs.io/ipfs";

  export let key;
  export let alt;
  export let src;
  export let pid = 0;
  export let width = 100;
  export let display = false;
  export let minted = 0;
  let cidImage;
  let cidJson;

  let pinImage = "";

  let signer = "";
  let address = "";
  let tokenId;
  let nfts, network;

  const chain_ids = "0x89,0x13881";
  let chainId = 0;

  //$: console.log("SIGNER", signer);

  $: if (chainId > 0) {
    const openNfts = new OpenNfts(chainId);
    if (openNfts) {
      // console.log(openNfts);

      nfts = openNfts.contract;
      network = openNfts.network;
    } else {
      console.log("Wrong chainId: switch to Matic network on Polygon");
      // alert('Switch to Matic or Mumbai on Polygon');
    }
  }

  async function nftMint() {
    //console.log('nftMint src alt', src, alt);

    if (signer) {
      minted = 1;

      const nftStorage = new NftStorage(key);
      cidImage = await nftStorage.pinUrl(src);
      cidJson = await nftStorage.pinJson({
        name: alt,
        description: alt,
        cid: cidImage,
        image: `${ipfsGateway}/${cidImage}`,
        ipfs: "ipfs://" + cidImage,
        origin: src,
        minter: address
      });

      try {
        tokenId = await nfts.Mint(signer, `${ipfsGateway}/${cidJson}`);
        minted = 2;
        dispatch("token", { tokenId: tokenId });
      } catch (e) {
        console.error("Minting ERROR", e);
        minted = 0;
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
    {#if minted == 2}
      <a href="/wp-admin/admin.php?page=nfts">
        <button class="sell">SELL NFT</button>
      </a>
      <!-- </a> -->
    {:else if minted == 1}
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
      <br /><Metamask autoconnect="off" bind:address bind:chainId bind:signer chain_ids="{chain_ids}" />
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
