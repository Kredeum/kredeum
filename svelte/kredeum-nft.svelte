<svelte:options tag="kredeum-nft" />

<script>
  import Metamask from "./kredeum-metamask.svelte";
  import KredeumNftMint from "./kredeum-nft-mint.svelte";
  import OpenNfts from "../lib/open-nfts.mjs";
  import kimages from "../lib/kimages.mjs";
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();

  let chainId,
    network,
    openNFTs,
    explorer,
    openSea,
    address,
    importing = {};

  export let contract = undefined;
  export let platform = undefined;

  let NFTsListPromise;
  let NFTsContractsPromise = [];

  $: chainId && address && init();
  $: contract && address && nftsListTokens();

  async function init() {
    // console.log("init", chainId, address);
    openNFTs = await OpenNfts(chainId);
    if (openNFTs.ok) {
      explorer = openNFTs.network?.blockExplorerUrls[0];
      openSea = openNFTs.network?.openSea;
      network = openNFTs.network?.chainName;

      NFTsContractsPromise = openNFTs.listContracts(address);
      contract = openNFTs.currentContract?.address;
    } else {
      console.error(openNFTs);
      alert("Wrong network detected");
    }
  }

  async function nftsListTokens() {
    // console.log("nftsListTokens", contract);
    if (openNFTs?.ok) {
      await openNFTs.setContract(chainId, contract);
      NFTsListPromise = openNFTs.listTokens(address);
      // console.log("nftsListTokens", await NFTsListPromise);
    }
  }

  const sameAddress = (a, b = address) => a && a?.toLowerCase() === b?.toLowerCase();
  const short = (a) => `${a?.substring(0, 6)}...${a?.substring(a?.length - 4, a?.length)}`;

  $: openSeaLinkKredeum = () => openSea?.kredeum;
  $: openSeaLinkToken = (item) => `${openSea?.assets}/${item.contract}/${item.tokenID}`;
  $: kreLinkToken = (item) =>
    explorer.includes("chainstacklabs.com")
      ? `${explorer}/tokens/${item.contract}/instance/${item.tokenID}/metadata`
      : `${explorer}/token/${item.contract}?a=${item.tokenID}`;

  $: kreLink = () =>
    explorer.includes("chainstacklabs.com")
      ? `${explorer}/tokens/${contract}/inventory`
      : `${explorer}/token/${contract}#inventory`;

  $: addressLink = (address) =>
    explorer.includes("chainstacklabs.com")
      ? `${explorer}/address/${address}/tokens`
      : `${explorer}/address/${address}/token`;

  $: imageLink = (item) =>
    item.image.replace("https://gateway.pinata.cloud/ipfs/", " https://ipfs.io/ipfs/");

  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
</script>

<main>
  <h1>
    <img alt="img" width="80" src="data:image/jpeg;base64,{kimages.klogo_png}" />
    My NFTs {network ? `on ${network.toUpperCase()}` : ""}
  </h1>

  <h3>
    <div>
      <strong>Collection @{contract || ""}</strong>
    </div>
    {#await NFTsContractsPromise}
      <div>Loading Collections...</div>
    {:then NFTsContracts}
      {#if NFTsContracts.length > 0}
        <select bind:value="{contract}">
          <option value="">Choose another Collection</option>
          {#each NFTsContracts as item}
            <option value="{item.address}">
              {item.totalSupply || " "}
              {item.symbol || "NFT"}@{item.address}
              {item.name ? `- ${item.name}` : " "}
            </option>
          {/each}
        </select>
      {/if}
    {/await}
  </h3>

  <table>
    <thead>
      <tr>
        <th>TokenID</th>
        <th width="200">Description</th>
        <th>Image</th>
        {#if openSea}
          <th>MarketPlace</th>
        {/if}
        {#if platform}
          <th>Import</th>
        {/if}
        <!-- <th>Owner</th>
          <th>creator</th>
          <th>Ipfs</th>
          <th>Json</th> -->
      </tr>
    </thead>

    <tbody>
      {#key address && importing}
        {#await NFTsListPromise}
          <p>Loading NFT Collection @{contract} ...</p>
          <img alt="img" width="160" src="data:image/jpeg;base64,{kimages.loader_png}" />
        {:then NFTs}
          {#if NFTs && NFTs.length > 0}
            {#each NFTs as nft}
              <tr>
                <td>
                  <a href="{kreLinkToken(nft)}" target="_blank">
                    &nbsp;{nft.tokenID}&nbsp;
                  </a>
                </td>

                <td>
                  <a href="{nft.tokenURI}" target="_blank">
                    <strong>{nft.name || "___"}</strong>
                  </a>
                  <br />
                  {(nft.name != nft.description && nft.description) || " "}
                </td>

                <td>
                  <a href="{imageLink(nft)}" target="_blank">
                    <img alt="___" src="{imageLink(nft)}" height="100" />
                  </a>
                </td>

                {#if openSea}
                  <td>
                    <a href="{openSeaLinkToken(nft)}" target="_blank">
                      {#if sameAddress(nft.owner)}
                        <button class="green">SELL NFT</button>
                      {:else}
                        <button class="blue">BUY NFT</button>
                      {/if}
                    </a>
                  </td>
                {/if}

                {#if platform}
                  <td>
                    <button
                      url="{nft.image}"
                      class="{nft.import ? (nft.import == 2 ? 'green' : 'grey') : 'blue'}"
                      on:click="{async () => {
                        nft.import = 1;
                        dispatch('import', { nft });
                        while (window.ajaxResponse == false) await sleep(1000);
                        nft.import = 2;
                      }}"
                    >
                      {nft.import ? (nft.import == 2 ? "IMPORTED" : "IMPORTING...") : "IMPORT WP"}
                    </button>
                  </td>
                {/if}

                <!-- <td>
                {#if nft.owner}
                  <a href="{addressLink(nft.owner)}" target="_blank">
                    {short(nft.owner)}
                  </a>
                  {#if sameAddress(nft.owner)}*{/if}
                {/if}
              </td>

              <td>
                {#if nft.minter}
                  <a href="{addressLink(nft.minter)}" target="_blank">
                    {short(nft.minter)}
                  </a>
                  {#if sameAddress(nft.minter)}*{/if}
                {/if}
              </td>

              <td>
                <a href="{ipfsGateway}/{nft.cid}" target="_blank">{short(nft.cid)}</a>
              </td>

              <td>
                {#if nft.tokenURI}
                  <a href="{nft.tokenURI}" target="_blank"
                    >{short(nft.tokenURI.replace(/^.*ipfs\//, ""))}</a
                  >
                {/if}
              </td> -->
              </tr>
            {/each}
          {/if}
        {/await}
      {/key}
    </tbody>
  </table>

  <small>
    {#if openNFTs}NFT collection <a href="{kreLink()}" target="_blank">{contract}@{network}</a>
    {/if}
    <br />
    {#if address}My address{/if}
    <Metamask autoconnect="off" bind:address bind:chainId />
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
    font-size: 3em;
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
  button.green {
    background-color: #36d06f;
  }
  button.blue {
    background-color: #2a81de;
  }
  button.grey {
    background-color: grey;
  }
  button:hover {
    background-color: black;
    cursor: pointer;
  }
  th {
    border: solid;
    border-width: 0 0 1px 0;
  }
</style>
