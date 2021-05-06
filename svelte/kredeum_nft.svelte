<svelte:options tag="kredeum-nft" />

<script>
  import Metamask from "./kredeum_metamask.svelte";
  // import KredeumNftMint from './kredeum_nft_mint.svelte';
  import nft from "../lib/nft.mjs";
  import kimages from "../lib/kimages.mjs";

  const MaticOpenSeaAssets = "https://opensea.io/assets/matic";
  const MaticArkaneAssets = "https://arkane.market/inventory/MATIC";

  const ArkaneAddress = "0x1ac1cA3665b5cd5fDD8bc76f924b76c2a2889D39";
  const OpenSeaKredeumCollection = "https://opensea.io/collection/kredeum-nfts";
  const ArkaneKredeumCollection = "https://arkane.market/search?contractName=Kredeum%20NFTs";

  const ipfsGateway = "https://gateway.pinata.cloud/ipfs";
  const PolygonTechnology = "https://polygon.technology/";

  const loader_ref =
    "<p>Data loading, please wait ...</p>" +
    '<img alt="img" width="160" src="/wp-content/plugins/kredeum-nfts/img/loader-v1.gif" />';

  let loader = loader_ref;
  let address = "";

  let chainId = 0;
  let network;

  export let all = 2;
  // 0 all NFTs
  // 1 NFTs I created
  // 2 NFTs I own
  // 3 NFTs I created and I own

  let NFTs = new Map();

  $: if (chainId > 0) nftInit();

  async function nftInit() {
    console.log("chainId", chainId);
    network = await nft.init(chainId);
    if (network?.KRE) {
      nftList();
    } else {
      // console.log("Wrong chainId: switch to Matic or Mumbai on Polygon");
      alert("Switch to Matic or Mumbai on Polygon");
    }
  }

  async function nftList() {
    NFTs = await nft.list();
    //console.log('NFTs', NFTs);
    loader = "Data loading over.";
  }
</script>

/* eslint-disable */ // eslint-disable @svelte/missing-custom-element-compile-options

<main>
  <h1>
    Kredeum
    <img alt="img" width="160" src="data:image/jpeg;base64,{kimages.klogo_png}" />
    NFTs
  </h1>

  <h3>
    Exchange My NFTs
    <a href="{ArkaneKredeumCollection}" target="_blank">on Arkane Market</a>
    -
    <a href="{OpenSeaKredeumCollection}" target="_blank">on OpenSea</a>
    at low cost using
    <a href="{PolygonTechnology}" target="_blank">Polygon / Matic</a>
  </h3>

  <table>
    <tr>
      <td colspan="8">
        <!-- <button on:click="{(e) => (all = 0)}">All NFTs</button>
        - -->
        <button on:click="{() => (all = 1)}">NFTs I created</button>
        -
        <button on:click="{() => (all = 2)}">NFTs I own</button>
        <hr />
      </td>
    </tr>
    <tr>
      <td>id</td>
      <td width="200">name</td>
      <td>image</td>
      <td>Arkane Market</td>
      <td>OpenSea</td>
      <td>creator</td>
      <td>ipfs</td>
      <td>json</td>
    </tr>
    <tr><td colspan="8"><hr /></td></tr>
    {#each [...NFTs].sort(([k1], [k2]) => k2 - k1) as [tokenId, item]}
      {#if ((all & 1) == 1 && item.tokenJson?.minter.toLowerCase() === address.toLowerCase()) || ((all & 2) == 2 && item.ownerOf.toLowerCase() === address.toLowerCase())}
        <tr>
          <td>
            {tokenId}
          </td>

          <td>
            {item.tokenJson?.name || ""}
          </td>

          <td>
            <img alt="" src="{ipfsGateway}/{item.cid}" height="100" />
          </td>

          <td>
            {#if item.ownerOf}
              {#if item.ownerOf.toLowerCase() === ArkaneAddress.toLowerCase()}
                <a href="{ArkaneKredeumCollection}" target="_blank">
                  <button class="buy">BUY NFT</button>
                </a>
              {:else if item.ownerOf.toLowerCase() === address.toLowerCase()}
                <a href="{MaticArkaneAssets}/{network?.KRE}/{tokenId}" target="_blank">
                  <button class="sell">SELL NFT</button>
                </a>
              {:else}
                <a href="{network?.blockExplorerUrls[0]}/address/{item.ownerOf}" target="_blank">
                  <button class="grey">OWNER</button>
                </a>
              {/if}
            {/if}
          </td>

          <td>
            <a href="{MaticOpenSeaAssets}/{network?.KRE}/{tokenId}" target="_blank">
              <button class="grey">OpenSea</button>
            </a>
          </td>

          <td>
            {#if item.tokenJson?.minter}
              <a href="{network?.blockExplorerUrls[0]}/address/{item.tokenJson?.minter}" target="_blank">
                {item.tokenJson?.minter.substring(0, 12)}...
              </a>
              {#if item.tokenJson?.minter.toLowerCase() === address.toLowerCase()}*{/if}
            {/if}
          </td>

          <td>
            <a href="{ipfsGateway}/{item.cid}" target="_blank">{item.cid?.substring(0, 12)}...</a>
          </td>

          <td>
            {#if item.tokenURI}
              <a href="{item.tokenURI}" target="_blank">{item.tokenURI.replace(/^.*ipfs\//, "").substring(0, 12)}...</a>
            {/if}
          </td>
        </tr>
      {/if}
    {/each}
    {@html loader}
    <tr><td colspan="8"><hr /></td></tr>
  </table>

  <small>
    {network?.chainName}@<a href="{network?.blockExplorerUrls[0]}/address/{address}" target="_blank">
      <Metamask autoconnect="off" bind:address bind:chainId />
    </a><br />

    nft@<a href="{network?.blockExplorerUrls[0]}/address/{network?.KRE}" target="_blank">
      {network?.KRE}
    </a>
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
    background-color: #2a81de;
    border: 0px;
    margin: 10px;
  }
  button:hover {
    cursor: pointer;
  }
  button.sell {
    background-color: #36d06f;
  }
  button.grey {
    background-color: grey;
  }
</style>
