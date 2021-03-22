<svelte:options tag="kredeum-nft-mint" />

<script>
  // import Metamask from './kredeum_metamask.svelte';
  import nft from '../lib/nft.mjs';
  import pinata from '../lib/pinata.mjs';
  import hash from '../lib/hash.mjs';
  import fetch from 'node-fetch';

  export let src;
  export let name;

  const ipfsGateway = 'https://gateway.pinata.cloud/ipfs';
  const maticEthExplorer = 'https://explorer-mainnet.maticvigil.com';
  const OpenSeaAssetsMatic = 'https://opensea.io/assets/matic';
  const OpenSeaKredeumCollectionMatic = '0x792f8e3c36ac3c1c6d62ecc44a88ca1317fece93';
  const OpenSeaKredeumCollection = 'https://opensea.io/collection/kredeum-nft';
  const chainIdMatic = '0x89';

  let NFTs = new Map();
  let CIDs = new Set();

  let minted = false;
  let tokenId = 1;
  let chainId = chainIdMatic;

  $: if (chainId > 0) {
    if (chainId !== chainIdMatic) {
      console.log('Wrong chainId =', chainId, ' switch to Matic / Polygon =', chainIdMatic);
      alert('Switch to Matic / Polygon');
    } else {
      nft.init(chainId);
      nftList();
    }
  }
  async function nftOne(key, nft) {
    const { cid, tokenId } = nft;
    const value = { cid, tokenId, nft };

    const pin = NFTs.get(cid);
    if (pin) {
      value.pin = pin.pin;
      NFTs.delete(cid);
    }
    CIDs.add(cid);
    NFTs.set(key, value);
  }
  async function nftList() {
    let nftList = await nft.list();
    console.log('nftList', nftList);

    for (const [key, nft] of nftList) {
      nftOne(key, nft);

      const res = await fetch(nft.tokenURI);
      console.log('res', res);
      // console.log(await res.text());
      const json = await res.text();
      console.log('res.json', json);
      // console.log(res.buffer());
      console.log('cid', nft.cid, 'hash json', await hash(json));
    }

    console.log('NFTs', NFTs);
    NFTs = NFTs;
  }

  async function nftMint() {
    console.log('nftMint', src, name);

    console.log(await hash((await fetch(src)).buffer()));
    const nftJson = await pinata.pinJson({ cid, name, owner });
    console.log('nftJson', nftJson);

    const nftMinted = await nft.Mint(signer, nftJson);
    console.log('nftMinted', nftMinted);
  }
</script>

<main>
  {#if minted}
    <a href="{OpenSeaAssetsMatic}/{OpenSeaKredeumCollectionMatic}/{tokenId}" target="_blank"> <button class="sell">SELL NFT</button></a>
  {:else}
    <button on:click="{nftMint}" class="mint">MINT NFT</button>
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
