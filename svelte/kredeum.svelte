<script>
  import Metamask from './metamask.svelte';

  import pinata from '../lib/pinata.mjs';
  import nft from '../lib/nft.mjs';

  const maticEthExplorer = 'https://explorer-mainnet.maticvigil.com';
  const maticOpenSeaAssets = 'https://opensea.io/assets/matic';
  const maticOpenSeaCollection = '0x5f13c4c75cd1eb9091525dee5282c1855429b7d4';
  const ipfsGateway = 'https://gateway.pinata.cloud/ipfs';

  let signer = '';
  let address = '';
  let chainId = '';
  const chainIdPolygon = '0x89';

  let NFTs = new Map();

  let pinataPins = new Map();
  let nftList = new Map();

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
    let [nftList, pinataPins] = await Promise.all([nft.list(chainId), pinata.list()]);
    console.log('nftList', nftList);
    console.log('pinataPins', pinataPins);

    for (const [cid, nft] of nftList) {
      const value = NFTs.get(cid) || {};
      value.nft = nft;
      NFTs.set(cid, value);
    }
    for (const [cid, pin] of pinataPins) {
      const value = NFTs.get(cid) || {};
      value.pin = pin;
      NFTs.set(cid, value);
    }
    console.log('NFTs', NFTs);
    NFTs = NFTs;
  }
  async function nftMint() {
    const num = Number(this.attributes.num.value);
    const pin = pinataPins[num].pin;
    console.log('nftMint', num, pin);

    const nftJson = await pinata.pinJson(pin);
    console.log('nftJson', nftJson);

    const nftMinted = await nft.Mint(signer, nftJson);
    console.log('nftMinted', nftMinted);
  }
</script>

<main>
  <h1>Kredeum Wallet</h1>
  <h3>
    {NFTs?.size} NFTs Kredeum -
    <a href="https://opensea.io/collection/kredeum-user/" target="_blank">Explore on OpenSea</a>
  </h3>

  <table>
    <tr><td colspan="10"><hr /></td></tr>
    <tr>
      <td>cid</td><td>name NFT</td><td>name PIN</td><td>image PIN</td>
      <td>MY NFT</td><td>owner NFT</td><td>MY PIN</td><td>owner PIN</td><td>tokenId</td><td>OpenSea</td>
    </tr>
    <tr><td colspan="10"><hr /></td></tr>

    <!-- {#each Array.from(NFTs.values()) as item, i} -->
    {#each [...NFTs] as [cid, item]}
      <tr>
        <td><a href="{ipfsGateway}/{cid}" target="_blank">{cid.substring(0, 12)}...</a></td>
        <td>{item.nft?.tokenJson.name || ''}</td>
        <td>{item.pin?.pin.name || ''}</td>
        <td><img alt="" src="{ipfsGateway}/{cid}" height="100" /></td>
        <td>
          {#if item.nft?.ownerOf.toLowerCase() === address.toLowerCase()}MY NFT {/if}
        </td>
        <td>
          {#if item.nft?.ownerOf}<a href="{maticEthExplorer}/address/{item.nft?.ownerOf}" target="_blank">{item.nft?.ownerOf.substring(0, 12)}...</a>{/if}
        </td>
        <td>
          {#if item.pin?.pin.meta?.address?.toLowerCase() === address.toLowerCase()}MY PIN{/if}
        </td>
        <td>
          {#if item.pin?.pin.meta?.address}<a href="{maticEthExplorer}/address/{item.pin?.pin.meta?.address}" target="_blank">{item.pin?.pin.meta?.address?.substring(0, 12)}...</a
            >{/if}
        </td>
        <td>{item.nft?.tockenId || ''}</td>
        <td>
          {#if item.nft?.tockenId}<a href="{maticOpenSeaAssets}/{maticOpenSeaCollection}/{item.nft?.tockenId}" target="_blank">view</a>{/if}
        </td>
      </tr>
    {/each}
    <tr><td colspan="10"><hr /></td></tr>
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
  th {
    text-align: left;
  }
  td {
    padding: 10px;
  }
  h1 {
    color: #ff3e00;
    text-transform: uppercase;
    font-size: 4em;
    font-weight: 100;
  }

  @media (min-width: 640px) {
    main {
      max-width: none;
    }
  }
</style>
