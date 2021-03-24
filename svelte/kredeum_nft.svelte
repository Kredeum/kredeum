<svelte:options tag="kredeum-nft" />

<script>
  import Metamask from './kredeum_metamask.svelte';
  import KredeumNftMint from './kredeum_nft_mint.svelte';
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

  $: if (chainId > 0) {
    if (chainId !== chainIdMatic) {
      console.log('Wrong chainId =', chainId, ' switch to Matic / Polygon =', chainIdMatic);
      alert('Switch to Matic / Polygon');
    } else {
      nft.init(chainId);
      nftList();
    }
  }
  $: console.log('SIGNER', signer);

  async function nftList() {
    NFTs = await nft.list();
    console.log('NFTs', NFTs);
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
      <td width="200">name</td>
      <td>image</td>
      <td>OpenSea</td>
      <td>owner</td>
      <td>ipfs</td>
      <td>json</td>
    </tr>
    <tr><td colspan="8"><hr /></td></tr>
    {#each [...NFTs].sort(([k1], [k2]) => k2 - k1) as [tokenId, item]}
      <tr>
        <td>
          {tokenId}
        </td>

        <td>
          {item.tokenJson?.name || ''}
        </td>

        <td>
          <img alt="" src="{ipfsGateway}/{item.cid}" height="100" />
        </td>

        <td>
          <a href="{OpenSeaAssetsMatic}/{OpenSeaKredeumCollectionMatic}/{tokenId}" target="_blank"> <button class="sell">SELL NFT</button></a>
        </td>

        <td>
          {#if item.ownerOf}
            <a href="{maticEthExplorer}/address/{item.ownerOf}" target="_blank">
              {item.ownerOf.substring(0, 12)}...
            </a>
            {#if item.ownerOf.toLowerCase() === address.toLowerCase()}*{/if}
          {/if}
        </td>

        <td>
          <a href="{ipfsGateway}/{item.cid}" target="_blank">{item.cid?.substring(0, 12)}...</a>
        </td>

        <td>
          {#if item.tokenURI}
            <a href="{item.tokenURI}" target="_blank">{item.tokenURI.replace(/^.*ipfs\//, '').substring(0, 12)}...</a>
          {/if}
        </td>
      </tr>
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
    border: 0px;
  }
  button.mint {
    background-color: #2a81de;
  }
  button.sell {
    background-color: #36d06f;
  }
</style>
