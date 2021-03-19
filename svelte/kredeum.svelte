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
  const chainIdPolygon = '0x89';

  let NFTs = new Map();

  $: if (chainId > 0) {
    if (chainId !== chainIdPolygon) {
      console.log('Wrong chainId =', chainId, ' switch to Matic / Polygon =', chainIdPolygon);
      alert('Switch to Matic / Polygon');
    } else {
      list();
    }
  }

  $: {
    console.log('SIGNER', signer);
  }
  async function list() {
    let [nftList, pinataList] = await Promise.all([nft.list(chainId), pinata.list()]);
    console.log('nftList', nftList);
    console.log('pinataList', pinataList);

    for (const [cid, pin] of pinataList) {
      const value = { cid, pin };
      NFTs.set(cid, value);
    }
    for (const [key, nft] of nftList) {
      console.log('NFT', nft);
      const { cid, tockenId } = nft;
      const value = { cid, tockenId, nft };

      const pin = NFTs.get(cid);
      if (pin) {
        value.pin = pin.pin;
        NFTs.delete(cid);
      }
      NFTs.set(key, value);
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
  }
</script>

<main>
  <h1>
    Wallet
    <img src="klogo.png" alt="kredeum logo" height="150" />
    NFTs Kredeum
  </h1>

  <h3>
    <a href="{OpenSeaKredeumCollection}" target="_blank">Sell on OpenSea</a>
  </h3>

  <table>
    <tr><td colspan="8"><hr /></td></tr>
    <tr>
      <td>cid</td>
      <td>json</td>
      <td>owner</td>
      <td>name</td>
      <td>image</td>
      <td>NFT</td>
    </tr>
    <tr><td colspan="8"><hr /></td></tr>

    {#each [...NFTs] as [cid, item]}
      {#if !item.pin?.pin.meta?.image}
        <tr>
          <td>
            <a href="{ipfsGateway}/{item.cid}" target="_blank">{item.tockenId || ''}#{item.cid.substring(0, 12)}...</a>
          </td>

          <td>
            {#if item.nft?.tokenURI}
              <a href="{item.nft?.tokenURI}" target="_blank">{item.nft?.tokenURI.replace(/^.*ipfs\//, '').substring(0, 12)}...</a>
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
            {item.nft?.tokenJson.name || ''}<br />
            {item.pin?.pin.name || ''}
          </td>

          <td>
            <img alt="" src="{ipfsGateway}/{item.cid}" height="100" />
          </td>

          <td>
            {#if item.tockenId}
              <a href="{OpenSeaAssetsMatic}/{OpenSeaKredeumCollectionMatic}/{item.tockenId}" target="_blank"> <button class="sell">SELL NFT</button></a>
            {:else}
              <button on:click="{nftMint}" cid="{item.cid}" class="mint">MINT NFT</button>
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
