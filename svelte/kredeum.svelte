<script>
  import { ethers } from 'ethers';

  import KRU from '../lib/kru.mjs';
  import endpoint from '../lib/endpoint.mjs';

  import Metamask from './metamask2.svelte';
  import { signer, chainId, addresses } from './metamask2.mjs';

  let pinataPins = [];
  let nftPins = [];
  let pinataPinsCount = 0;
  let nftPinsCount = 0;

  $: if ($chainId > 0) {
    pinataInit();
    nftInit();
  }
  async function nftInit() {
    const { network, url } = endpoint($chainId);
    const provider = new ethers.providers.JsonRpcProvider(url);

    console.log(KRU.ADDRESS[network]);

    const kru = new ethers.Contract(KRU.ADDRESS[network], KRU.ABI, provider);
    console.log('name:', await kru.name());
    console.log('symbol:', await kru.symbol());

    nftPinsCount = (await kru.totalSupply()).toNumber();
    console.log('totalSupply', nftPinsCount);

    for (let index = 0; index < nftPinsCount; index++) {
      const tockenId = await kru.tokenByIndex(index);
      const ownerOf = await kru.ownerOf(tockenId);
      const tokenURI = await kru.tokenURI(tockenId);
      nftPins.push({
        tockenId,
        ownerOf,
        tokenURI
      });
      nftPins = nftPins;
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
    pinataPinsCount = json.count;
    pinataPins = json.results;
    // console.log(JSON.stringify(pinataPins, null, '  '));
  }
</script>

<main>
  <h1>NFTS Kredeum</h1>

  <table>
    <th>NFT {nftPinsCount} pins</th>
    {#each nftPins as nftPin}
      <tr>
        <td>
          {#if nftPin.ownerOf.toLowerCase() === $signer.toLowerCase()}
            MINE
          {/if}
        </td>
        <td>{nftPin.tockenId}</td>
        <td>{nftPin.ownerOf}</td>
        <td>{nftPin.tokenURI}</td>
      </tr>
    {/each}
  </table>

  <hr />
  <table>
    <th>PINATA {pinataPinsCount} pins</th>
    {#each pinataPins as pinataPin, i}
      <tr>
        <td>{i}</td>
        <td>{pinataPin.pin.name}</td>
        <td>{pinataPin.pin.cid}</td>
      </tr>
    {/each}
  </table>

  <hr />
  <Metamask />

  {#if $signer !== ''}
    <span>{$signer.toString()}</span>
  {:else}
    <span>Connect wallet</span>
  {/if}
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
