<script>
  import { onMount } from 'svelte';
  import { ethers } from 'ethers';

  import KRU from '../lib/kru.mjs';
  import endpoint from '../lib/endpoint.mjs';

  import Metamask from './metamask.svelte';
  import { signer, chainId, addresses } from './metamask.mjs';

  $: if ($chainId > 0) init();

  async function init() {
    console.log('IN', chainId, 'T', $chainId);

    const { network, url } = endpoint($chainId);
    const provider = new ethers.providers.JsonRpcProvider(url);

    const kru = new ethers.Contract(KRU.ADDRESS[network], KRU.ABI, provider);
    console.log('name:', await kru.name());
    console.log('symbol:', await kru.symbol());

    let totalSupply = (await kru.totalSupply()).toNumber();
    console.log('totalSupply', totalSupply);

    for (let index = 0; index < totalSupply; index++) {
      const tockenId = await kru.tokenByIndex(index);
      console.log('index', index, '=> tockenId', tockenId.toNumber());
      console.log('ownerOf:', await kru.ownerOf(tockenId));
      console.log('tokenURI:', await kru.tokenURI(tockenId));
    }
  }
</script>

<main>
  <h1>Korigin</h1>

  {#if $signer !== ''}
    <span>{$signer.toString()}</span>
  {:else}
    <span>Connect wallet</span>
  {/if}

  <Metamask />
</main>

<style>
  main {
    text-align: center;
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
