<svelte:options tag="kredeum-nft" />

<script>
  import Metamask from './metamask.svelte';

  import pinata from '../lib/pinata.mjs';
  import nft from '../lib/nft.mjs';

  const ipfsGateway = 'https://gateway.pinata.cloud/ipfs';
  const maticEthExplorer = 'https://explorer-mainnet.maticvigil.com';
  const OpenSeaAssetsMatic = 'https://opensea.io/assets/matic';
  const OpenSeaKredeumCollectionMatic = '0x792f8e3c36ac3c1c6d62ecc44a88ca1317fece93';
  const OpenSeaKredeumCollection = 'https://opensea.io/collection/kredeum-nft';

  let signer = '';
  let address = '';
  let chainId = '';
  const chainIdMatic = '0x89';

  let NFTs = new Map();
  let CIDs = new Set();

  $: if (chainId > 0) {
    if (chainId !== chainIdMatic) {
      console.log('Wrong chainId =', chainId, ' switch to Matic / Polygon =', chainIdMatic);
      alert('Switch to Matic / Polygon');
    } else {
      nft.init(chainId);
      nftList();
      pinataList();
    }
  }

  $: {
    console.log('SIGNER', signer);
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
    }

    console.log('NFTs', NFTs);
    NFTs = NFTs;
  }

  async function pinataList() {
    let pinataList = await pinata.list();
    console.log('pinata.list', pinataList);

    for (const [cid, pin] of pinataList) {
      if (!CIDs.has(cid)) {
        console.log('set', cid);
        CIDs.add(cid);
        NFTs.set(cid, { cid, pin });
      }
    }

    console.log('NFTs', NFTs);
    NFTs = NFTs;
  }

  async function nftMint() {
    const cid = this.attributes.cid.value;
    console.log('nftMint cid', cid);

    const pin = NFTs.get(cid).pin.pin;
    console.log('nftMint pin', pin);

    const nftJson = await pinata.pinJson(pin);
    console.log('nftJson', nftJson);

    const nftMinted = await nft.Mint(signer, nftJson);
    console.log('nftMinted', nftMinted);

    nftList();
  }
</script>

<main>
  <h1>
    Wallet
    <img src="/wp-content/uploads/2021/03/K22.png" alt="kredeum logo" height="150" />
    NFTs Kredeum
  </h1>

  <h3>
    <a href="{OpenSeaKredeumCollection}" target="_blank">Sell on OpenSea</a>
  </h3>

  <table>
    <tr><td colspan="8"><hr /></td></tr>
    <tr>
      <td>id</td>
      <td>name</td>
      <td>image</td>
      <td>NFT</td>
      <td>owner</td>
      <td>ipfs</td>
      <td>json</td>
    </tr>
    <tr><td colspan="8"><hr /></td></tr>

    {#each [...NFTs] as [cid, item]}
      {#if !item.pin?.pin.meta?.image}
        <tr>
          <td>
            {#if item.tokenId}{item.tokenId}{/if}
          </td>

          <td>
            {item.nft?.tokenJson.name || ''}<br />
            {item.pin?.pin.name || ''}
          </td>

          <td>
            <img alt="" src="{ipfsGateway}/{item.cid}" height="100" />
          </td>

          <td>
            {#if item.tokenId}
              <a href="{OpenSeaAssetsMatic}/{OpenSeaKredeumCollectionMatic}/{item.tokenId}" target="_blank"> <button class="sell">SELL NFT</button></a>
            {:else}
              <button on:click="{nftMint}" cid="{item.cid}" class="mint">MINT NFT</button>
            {/if}
          </td>

          <td>
            {#if item.nft?.ownerOf}
              <a href="{maticEthExplorer}/address/{item.nft?.ownerOf}" target="_blank">
                {item.nft?.ownerOf.substring(0, 12)}...
              </a>
              {#if item.nft?.ownerOf.toLowerCase() === address.toLowerCase()}*{/if}
            {/if}
            <br />
            {#if item.pin?.pin.meta?.address}
              <a href="{maticEthExplorer}/address/{item.pin?.pin.meta?.address}" target="_blank">
                {item.pin?.pin.meta?.address?.substring(0, 12)}...
              </a>
              {#if item.pin?.pin.meta?.address?.toLowerCase() === address.toLowerCase()}*{/if}
            {/if}
          </td>

          <td>
            <a href="{ipfsGateway}/{item.cid}" target="_blank">{item.cid.substring(0, 12)}...</a>
          </td>

          <td>
            {#if item.nft?.tokenURI}
              <a href="{item.nft?.tokenURI}" target="_blank">{item.nft?.tokenURI.replace(/^.*ipfs\//, '').substring(0, 12)}...</a>
            {/if}
          </td>
        </tr>
      {/if}
    {/each}
    <tr><td colspan="8"><hr /></td></tr>
  </table>
  <small>
    <Metamask autoconnect="off" bind:address bind:chainId bind:signer />
  </small>
</main>

<style>
  main {
    padding: 1em;
    max-width: 240px;
    margin: 0 auto;
  }
  td {
    padding: 10px;
  }
  h1 {
    color: #ff3e00;
    font-size: 4em;
    font-weight: 100;
  }
  img {
    vertical-align: middle;
  }
  @media (min-width: 640px) {
    main {
      max-width: none;
    }
  }
  button {
    color: white;
  }
  button.mint {
    background-color: #2a81de;
  }
  button.sell {
    background-color: #36d06f;
  }
</style>
