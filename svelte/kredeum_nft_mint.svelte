<svelte:options tag="kredeum-nft-mint" />

<script>
  import nft from "../lib/nft.mjs";
  import KRE from "../lib/kre1.mjs";
  import pinata from "../lib/pinata.mjs";
  import kcid from "../lib/kcid.mjs";
  import Metamask from "./kredeum_metamask.svelte";
  import { onMount } from "svelte";

  export let src;
  export let alt;
  export let width = 100;
  export let display = false;
  let cid;

  let minted = 0;
  let tokenId = 1;
  let pinImage = "";

  let signer = "";
  let address = "";
  let networkKRE = "";

  const chain_ids = "0x89,0x13881";
  let chainId = 0;

  $: console.log("SIGNER", signer);

  $: if (chainId > 0) {
    networkKRE = nft.init(chainId);
    console.log("networkKRE", networkKRE);
    if (!networkKRE) {
      console.log("Wrong chainId: switch to Matic or Mumbai on Polygon");
      // alert('Switch to Matic or Mumbai on Polygon');
    }
  }

  onMount(async function () {
    cid = await kcid.url(src);
    console.log("nftMint cidPreview", cid);
  });

  async function nftMint() {
    console.log("nftMint src alt", src, alt);

    if (signer) {
      minted = 1;

      const image = { origin: src, name: alt, minter: address };
      pinImage = await pinata.pinImage(image);
      console.log("nftMint pinImage", pinImage);
      if (pinImage.cid === cid) console.log("Good Guess !!!");

      image.cid = pinImage.cid;
      const pinJson = await pinata.pinJson(image);
      console.log("nftMint pinJson", pinJson);

      try {
        tokenId = await nft.Mint(signer, pinJson.jsonIpfs);
        console.log("nftMinted", tokenId);
        minted = 2;
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
      <!-- <a href="{network?.openSeaAssets}/{network?.KRE}/{tokenId}" target="_blank"> -->
      <button class="sell">SELL NFT</button>
      <!-- </a> -->
    {:else if minted == 1}
      <button id="mint-button" class="minting">MINTING...</button>
    {:else if !networkKRE}
      <button id="mint-button" class="switch">Switch to MATIC (or testnet MUMBAI)</button>
    {:else}
      <button on:click="{nftMint}" class="mint">MINT NFT</button>
    {/if}

    {#if display}
      <small>
        <br /><a href="{src}">{src}@{alt}</a>

        <br /><a href="https://ipfs.io/ipfs/{cid}">{cid}@ipfs</a>
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
