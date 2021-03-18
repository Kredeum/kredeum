<script>
  import Metamask from './metamask.svelte';

  import pinata from '../lib/pinata.mjs';
  import nft from '../lib/nft.mjs';

  let signer;
  let address = '0x0';
  let chainId = '0x0';
  const chainIdPolygon = '0x89';

  $: pinataPins = [];
  $: nftList = [];

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
    <th colspan="5">{nftList?.length} Kredeum NFTs</th>
    {#each nftList as nft, i}
      <tr>
        <td>
          {#if nft.ownerOf.toLowerCase() === address.toLowerCase()}
            MINE
          {/if}
        </td>
        <td>{i}</td>
        <td>{nft.tockenId}</td>
        <td>{nft.tokenURI}</td>
        <td>{nft.ownerOf}</td>
      </tr>
    {/each}

    <tr><td colspan="5"><hr /></td></tr>

    <th colspan="5">{pinataPins?.length} pins PINATA</th>
    {#each pinataPins as pinataPin, i}
      <tr>
        <td>
          {#if pinataPin.pin.meta.address.toLowerCase() === address.toLowerCase()}
            <button on:click="{nftMint}" num="{i}">MINT NFT</button>
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
  th {
    text-align: left;
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
