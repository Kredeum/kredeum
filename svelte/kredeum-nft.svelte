<svelte:options tag="kredeum-nft" />

<script lang="ts">
  import Metamask from "./kredeum-metamask.svelte";
  import KredeumNftMint from "./kredeum-nft-mint.svelte";
  import OpenNFTs from "../lib/open-nfts";
  import kimages from "../lib/kimages";
  import { createEventDispatcher } from "svelte";
  import type { Contract, Network } from "../lib/config";
  import type { NftData } from "../lib/open-nfts";

  const dispatch = createEventDispatcher();

  const openNFTs = new OpenNFTs();

  let network: Network;
  let contract: Contract;
  let signer: string;
  let owner: string;
  let chainId: string;
  let explorer: string;
  let openSea: string;
  let refreshingNFTs: boolean;
  let refreshingContracts: boolean;
  let importing: boolean = true;
  let NFTs: Array<NftData>;
  let NFTsContracts: Array<Contract>;

  export let address: string = undefined; // NFT smartcontract address
  export let platform: string = undefined; // platform : WordPress or Dapp

  // ADDRESS CHANGE
  $: if (owner) {
    console.log("<kredeum-nft/> owner changed", owner);
    openNFTs.setOwner(owner);
    listContracts();
    listNFTs();
  }

  // CONTRACT OR NETWORK CHANGE
  $: if (address || chainId) {
    console.log("<kredeum-nft/> chainId or address changed", chainId, address);
    init(chainId, address);
  }

  async function init(_chainId?: string, _address?: string): void {
    ({ network, contract } = await openNFTs.init(_chainId, _address));
    openSea = network.openSea?.assets || "";
    explorer = network.blockExplorerUrls[0] || "";

    if (network) {
      if (chainId !== network.chainId) {
        chainId = network.chainId;
        listContracts();
      }
      listNFTs();
    }
  }

  async function listContracts() {
    if (network && owner) {
      console.log("<kredeum-nft/> listContracts", `nfts://${network}@${owner}`);

      NFTsContracts = null;

      NFTsContracts = openNFTs.listContractsFromCache();
      console.log("<kredeum-nft/> NFTsContracts cache loaded", NFTsContracts);
      refreshingContracts = true;

      NFTsContracts = await openNFTs.listContracts();
      console.log("<kredeum-nft/> NFTsContracts refresh done", NFTsContracts);
      refreshingContracts = false;
    }
  }

  async function listNFTs() {
    if (network && address && owner) {
      console.log(
        "<kredeum-nft/> listNFTs",
        `nft://${network || "..."}/${address || "..."}@${owner || "..."}`
      );

      NFTs = null;

      NFTs = openNFTs.listNFTsFromCache(owner);
      console.log("<kredeum-nft/> listNFTs cache loaded", NFTs);
      refreshingNFTs = true;

      NFTs = await openNFTs.listNFTs(owner);
      console.log("<kredeum-nft/> listNFTs refresh done", NFTs);
      refreshingNFTs = false;
    }
  }

  const short = (s = "", n = 16, p = 0) => {
    const l = s?.toString().length;
    return s?.substring(0, n) + (l < n ? "" : "..." + (p > 0 ? s?.substring(l - 4, l) : ""));
  };

  const sameAddress = (a, b = address) => a && a?.toLowerCase() === b?.toLowerCase();
  const shortAddress = (a) => short(a, 6, 4);

  const dispatchImport = async (nft) => {
    nft.import = 1;
    dispatch("import", { nft });
    while (window.ajaxResponse == false) await sleep(1000);
    nft.import = 2;
  };

  const createCollection = () => {
    console.log("<kredeum-nft/> createCollection");
    if (signer) {
      openNFTs.Clone(signer);
    } else {
      console.error("<kredeum-nft/> not signer");
    }
  };

  const description = (nft) => (nft.name != nft.description && nft.description) || " ";

  $: openSeaLinkKredeum = () => openSea?.kredeum;
  $: openSeaLinkToken = (item) => `${openSea?.assets}/${item.address}/${item.tokenID}`;

  $: kreTokenLink = (item) =>
    explorer?.includes("chainstacklabs.com")
      ? `${explorer}/tokens/${item.address}/instance/${item.tokenID}/metadata`
      : `${explorer}/token/${item.address}?a=${item.tokenID}`;

  $: kreLink = () =>
    explorer?.includes("chainstacklabs.com")
      ? `${explorer}/tokens/${address}/inventory`
      : `${explorer}/token/${address}#inventory`;

  $: addressLink = (address) =>
    explorer?.includes("chainstacklabs.com")
      ? `${explorer}/address/${address}/tokens`
      : `${explorer}/address/${address}/token`;

  $: imageLink = (item) =>
    item.image?.replace("https://gateway.pinata.cloud/ipfs/", " https://ipfs.io/ipfs/");

  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
</script>

<main>
  <h1>
    <img alt="img" width="80" src="data:image/jpeg;base64,{kimages.klogo_png}" />
    My NFT Wallet
  </h1>

  <button on:click="{createCollection}">Create Collection</button>

  <h3>
    {#if NFTsContracts}
      {#if NFTsContracts.length > 0}
        <select bind:value="{address}">
          <option value="">Choose Collection</option>
          {#each NFTsContracts as NFTsContract}
            <!-- {#if i == 1}selected{/if} -->
            <option value="{NFTsContract.address}">
              {NFTsContract.totalSupply || (NFTsContract.totalSupply == 0 ? "0" : "?")}
              {NFTsContract.symbol || "NFT"}@{NFTsContract.address}
              {NFTsContract.name ? `- ${NFTsContract.name}` : " "}
            </option>
          {/each}
        </select>
      {:else}
        <p><em>NO Collection found !</em></p>
      {/if}
    {:else}
      <p><em>Loading Collections...</em></p>
    {/if}
  </h3>
  {#if refreshingContracts} Refreshing Collections... {/if}

  {#key owner && importing}
    {#if NFTs}
      {#if NFTs.length > 0}
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
              <th>Infos</th>
            </tr>
          </thead>

          <tbody>
            {#each NFTs as nft}
              <tr>
                <td>
                  <a href="{kreTokenLink(nft)}" title="{nft.nid}" target="_blank">
                    &nbsp;{short(nft.tokenID, 16)}&nbsp;
                  </a>
                </td>

                <td>
                  <a href="{nft.tokenURI}" title="{nft.tokenURI}" target="_blank">
                    <strong>{nft.name || "___"}</strong>
                  </a>
                  <br />
                  <p title="{description(nft)}">
                    {short(description(nft), 140)}
                  </p>
                </td>

                <td>
                  <a href="{imageLink(nft)}" title="{nft.description}" target="_blank">
                    <img alt="{nft.name}" src="{imageLink(nft)}" height="100" />
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
                      on:click="{dispatchImport(nft)}"
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
                <td>
                  <div title="{JSON.stringify(nft, null, 2)}">ⓘ</div>
                </td>
              </tr>
            {/each}
          </tbody>
        </table>

        <p>
          <em>
            {NFTs.length} NFT{NFTs.length > 1 ? "s" : ""}
            {#if refreshingNFTs} Refreshing NFTs... {/if}
          </em>
        </p>
      {:else}
        <p><em>NO NFT found !</em></p>
      {/if}
    {:else}
      <p><em>Loading NFTs...</em></p>
    {/if}
    <!-- {/await} -->
  {/key}

  <small>
    {#if openNFTs}Collection <a href="{kreLink()}" target="_blank">
        nft://{network?.chainName || "..."}/{address || "..."}
      </a>
    {/if}
    <br />
    {#if owner}Address{/if}
    <Metamask autoconnect="off" bind:owner bind:chainId bind:signer />
    <br />
    Cache <a href on:click="{() => localStorage.clear()}">clear</a>
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
