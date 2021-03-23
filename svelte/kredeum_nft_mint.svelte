<svelte:options tag="kredeum-nft-mint" />

<script>
  // import Metamask from './kredeum_metamask.svelte';
  import nft from '../lib/nft.mjs';
  import pinata from '../lib/pinata.mjs';
  import hash from '../lib/hash.mjs';
  import axios from 'axios';
  import Metamask from './kredeum_metamask.svelte';
  import { onMount } from 'svelte';

  export let url;
  export let name;
  let cid;

  const ipfsGateway = 'https://gateway.pinata.cloud/ipfs';
  const maticEthExplorer = 'https://explorer-mainnet.maticvigil.com';
  const OpenSeaAssetsMatic = 'https://opensea.io/assets/matic';
  const OpenSeaKredeumCollectionMatic = '0x792f8e3c36ac3c1c6d62ecc44a88ca1317fece93';
  const OpenSeaKredeumCollection = 'https://opensea.io/collection/kredeum-nft';
  const chainIdMatic = '0x89';

  let minted = false;
  let tokenId = 1;
  let chainId = chainIdMatic;
  let signer = '';
  let address = '';
  let pinImage = '';

  onMount(async function () {
    nft.init(chainIdMatic);

    cid = await hash(url);
    console.log('nftMint cidPreview', cid);
  });

  async function nftMint() {
    console.log('nftMint url name', url, name);

    const image = { url, name, owner: address };
    pinImage = await pinata.pinImage(image);
    console.log('nftMint pinImage', pinImage);
    if (pinImage.cid === cid) console.log('Good Guess !!!');

    image.cid = pinImage.cid;
    const pinJson = await pinata.pinJson(image);
    console.log('nftMint pinJson', pinJson);

    tokenId = await nft.Mint(signer, pinJson.jsonIpfs);
    console.log('nftMinted', tokenId);
    minted = true;
  }
</script>

<main>
  {#if minted}
    <a href="{OpenSeaAssetsMatic}/{OpenSeaKredeumCollectionMatic}/{tokenId}" target="_blank"> <button class="sell">SELL NFT</button></a>
  {:else}
    <button on:click="{nftMint}" class="mint">MINT NFT</button>
    <small>
      <br />{url}
      <br />{name}
      <br />{cid}
      <br />
      <Metamask autoconnect="off" bind:address bind:chainId bind:signer />
    </small>
  {/if}
</main>

<style>
  button {
    color: white;
    border: 0px;
  }
  button.mint {
    background-color: #2a81de;
  }
  button.sell {
    background-color: #36d06f;
  }
</style>
