<script>
  import Metamask from './metamask.svelte';

  import pinata from '../lib/pinata.mjs';
  import nft from '../lib/nft.mjs';

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
    nftList = await nft.list(chainId);
    console.log('nftList', nftList);

    pinataPins = await pinata.list();
    console.log('pinataPins', pinataPins);

    NFTs = new Map([...nftList, ...pinataPins]);
    console.log('NFTs', NFTs);
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
  <small>
    <Metamask autoconnect="off" bind:address bind:chainId bind:signer />
  </small>
  <h2>Your NFTs</h2>

  <table>
    <tr><td colspan="5"><hr /></td></tr>
    <th colspan="5"
      >{nftList?.length} Kredeum NFTs
      <a href="https://opensea.io/collection/kredeum-user/" target="_blank">view on OpenSea</a></th
    >
    <tr><td>i</td>tokenId<td>tokenURI</td><td>nft</td><td>owner</td><td>OpenSea</td></tr>
    {#each Array.from(nftList.values()) as nft, i}
      <tr>
        <td>
          {#if nft.ownerOf.toLowerCase() === address.toLowerCase()}
            MINE
          {/if}
        </td>
        <td>{i}</td>
        <td>{nft.tockenId}</td>
        <td><a href="{nft.tokenURI}" target="_blank">{nft.tokenURI.replace(/^ipfs:\/\//, '').substring(0, 12)}...</a></td>
        <td><a href="https://explorer-mainnet.maticvigil.com/address/{nft.ownerOf}" target="_blank">{nft.ownerOf.substring(0, 12)}...</a></td>

        <td><a href="https://opensea.io/assets/matic/0x5f13c4c75cd1eb9091525dee5282c1855429b7d4/{nft.tockenId}" target="_blank">on OpenSea</a></td>
      </tr>
    {/each}

    <tr><td colspan="5"><hr /></td></tr>

    <th colspan="5">{pinataPins?.length} pins PINATA</th>
    <tr><td>MINT</td>i<td>name</td><td>pin</td><td>owner</td></tr>
    {#each Array.from(pinataPins.values()) as pinataPin, i}
      <tr>
        <td>
          {#if pinataPin.pin.meta.address.toLowerCase() === address.toLowerCase()}
            <button on:click="{nftMint}" num="{i}">MINT NFT</button>
          {/if}
        </td>
        <td>{i}</td>
        <td>{pinataPin.pin.name}</td>
        <td><img alt="" src="https://gateway.pinata.cloud/ipfs/{pinataPin.pin.cid}" height="100" /></td>
        <td><a href="https://gateway.pinata.cloud/ipfs/{pinataPin.pin.cid}" target="_blank">{pinataPin.pin.cid.substring(0, 12)}...</a></td>
        <td><a href="https://explorer-mainnet.maticvigil.com/address/{pinataPin.pin.meta.address}" target="_blank">{pinataPin.pin.meta.address.substring(0, 12)}...</a></td>
      </tr>
    {/each}
    <tr><td colspan="5"><hr /></td></tr>
  </table>
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
