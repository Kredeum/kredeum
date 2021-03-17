<script>
  import { ethers } from 'ethers';
  import KRU from '../lib/kru.mjs';
  import endpoint from '../lib/endpoint.mjs';
  import Metamask from './metamask.svelte';

  let signer = '';
  let chainId = '0x0';
  const chainIdPolygon = '0x89';

  let pinataPins = [];
  let pinataPinsCount = 0;

  let nftPins = [];
  let nftPinsCount = 0;
  let nftPinsCountAll = 0;

  $: if (chainId > 0) {
    if (chainId !== chainIdPolygon) {
      console.log('Wrong chainId =', chainId, ' switch to Polygon =', chainIdPolygon);
      alert('Switch to Polygon');
    } else {
      pinataInit();
      nftInit();
    }
  }
  async function nftInit() {
    const { network, url } = endpoint(chainId);
    const provider = new ethers.providers.JsonRpcProvider(url);

    console.log(KRU.ADDRESS[network]);

    const kru = new ethers.Contract(KRU.ADDRESS[network], KRU.ABI, provider);
    console.log('name:', await kru.name());
    console.log('symbol:', await kru.symbol());

    nftPinsCountAll = (await kru.totalSupply()).toNumber();
    console.log('nftPinsCountAll', nftPinsCountAll);

    for (let index = 0; index < nftPinsCountAll; index++) {
      const tockenId = await kru.tokenByIndex(index);
      const ownerOf = await kru.ownerOf(tockenId);
      const tokenURI = await kru.tokenURI(tockenId);
      // if (ownerOf.toLowerCase() === signer.toLowerCase())
      {
        nftPins.push({
          tockenId,
          ownerOf,
          tokenURI
        });
        nftPins = nftPins;
        nftPinsCount++;
      }
    }
    console.log('nftPins', JSON.stringify(nftPins, null, '  '));
  }

  async function pinataInit() {
    const response = await fetch('https://api.pinata.cloud/psa/pins?limit=99', {
      headers: {
        'Content-Type': 'application/json',
        pinata_api_key: 'f710b52158cee837859d',
        pinata_secret_api_key: '3fb4a7f92aba772082cadae63a034a91c7e048b7d62524397e7458193df3dbb0'
      }
    });
    const json = await response.json();
    // console.log(json.results);

    pinataPins = json.results;
    // pinataPins = json.results.filter(function (item) {
    //   return item.pin.meta.address.toLowerCase() === signer.toLowerCase();
    // });
    // console.log(JSON.stringify(pinataPins, null, '  '));
    pinataPinsCount = pinataPins.length;
  }
</script>

<main>
  <h1>Kredeum Wallet</h1>
  <small>
    <Metamask autoconnect="off" bind:signer bind:chainId />
  </small>
  <h2>Your NFTs</h2>

  <table>
    <tr><td colspan="5"><hr /></td></tr>
    <th>{nftPinsCount} Kredeum NFTs</th>
    {#each nftPins as nftPin, i}
      <tr>
        <td>
          {#if nftPin.ownerOf.toLowerCase() === signer.toLowerCase()}
            MINE
          {/if}
        </td>
        <td>{i}</td>
        <td>{nftPin.tockenId}</td>
        <td>{nftPin.tokenURI}</td>
        <td>{nftPin.ownerOf}</td>
      </tr>
    {/each}

    <tr><td colspan="5"><hr /></td></tr>

    <th>{pinataPinsCount} pins PINATA</th>
    {#each pinataPins as pinataPin, i}
      <tr>
        <td>
          {#if pinataPin.pin.meta.address.toLowerCase() === signer.toLowerCase()}
            MINE
          {/if}
        </td>
        <td>{i}</td>
        <td>{pinataPin.pin.name}</td>
        <td>{pinataPin.pin.cid}</td>
        <td>{pinataPin.pin.meta.address}</td>
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
