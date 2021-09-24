<svelte:options tag="kredeum-nft" />

<script lang="ts">
  import Metamask from "./kredeum-metamask.svelte";
  import KredeumNftMint from "./kredeum-nft-mint.svelte";
  import kimages from "../lib/kimages";
  import { createEventDispatcher } from "svelte";
  import { Signer, utils } from "ethers";
  import { Contract, getNetwork, Network, NftData, nftUrl, nftsUrl } from "../lib/kconfig";

  import { listContracts, listContractsFromCache, Clone } from "../lib/nfts-factory";
  import { listNFTs, listNFTsFromCache } from "../lib/open-nfts";

  const dispatch = createEventDispatcher();

  let network: Network;
  let signer: Signer;
  let address: string;
  let chainId: number;
  let explorer: string;
  let openSea: Network["openSea"];
  let refreshingNFTs: boolean;
  let refreshingContracts: boolean;
  let cloning: boolean = false;
  let cloneAddress: string;
  let nftImport: number;
  let NFTs: Array<NftData>;
  let NFTsContracts: Array<Contract>;
  let chainIdOld: number;
  let contractOld: string;
  let addressOld: string;

  export let contract: string = "0x933E3468e940fb310fFE625E63c42930D2861464"; // NFT smartcontract address
  export let platform: string = undefined; // platform : WordPress or Dapp

  // ADDRESS, CONTRACT OR NETWORK CHANGE
  $: if (address || contract || chainId) _listsUpdate();

  async function _listsUpdate(): Promise<void> {
    if (chainId && address) {
      network = getNetwork(chainId);
      if (network) {
        console.log("<kredeum-nft/> init", chainId, contract, address, network);

        openSea = network.openSea;
        explorer = network.blockExplorerUrls[0] || "";

        // chain change : force contract to default
        if (chainId != chainIdOld) {
          contract = network.openNFTs;
        }

        // chain or address changed : refresh list contract
        if (chainId != chainIdOld || address != addressOld) {
          _listContracts();
        }
        _listNFTs();

        chainIdOld = chainId;
        addressOld = address;
        contractOld = contract;
      }
    }
  }

  async function _listContracts() {
    if (network && address) {
      console.log("<kredeum-nft/> _listContracts", `nfts://${network?.chainName}@${address}`);

      NFTsContracts = null;

      NFTsContracts = listContractsFromCache(chainId);
      console.log("<kredeum-nft/> NFTsContracts cache loaded", NFTsContracts);
      refreshingContracts = true;

      NFTsContracts = await listContracts(chainId, address);
      console.log("<kredeum-nft/> NFTsContracts refresh done", NFTsContracts);
      refreshingContracts = false;
    }
  }

  async function _listNFTs() {
    if (network && contract && address) {
      console.log(
        "<kredeum-nft/> _listNFTs",
        `nft://${network?.chainName || "..."}/${contract || "..."}@${address || "..."}`
      );

      NFTs = null;

      NFTs = listNFTsFromCache(chainId, contract);
      console.log("<kredeum-nft/> _listNFTs cache loaded", NFTs);
      refreshingNFTs = true;

      NFTs = await listNFTs(chainId, contract, address);
      console.log("<kredeum-nft/> _listNFTs refresh done", NFTs);
      refreshingNFTs = false;
    }
  }

  const short = (s = "", n = 16, p = 0) => {
    const l = s?.toString().length;
    return s?.substring(0, n) + (l < n ? "" : "..." + (p > 0 ? s?.substring(l - 4, l) : ""));
  };

  const sameAddress = (a, b = address) => utils.getAddress(a) === utils.getAddress(b);
  const shortAddress = (a) => short(utils.getAddress(a), 6, 4);

  const dispatchImport = async (nft) => {
    nftImport = 1;
    dispatch("import", { nft });
    while (window.ajaxResponse == false) await sleep(1000);
    nftImport = 2;
  };

  const createCollection = async () => {
    console.log("<kredeum-nft/> createCollection");
    if (signer) {
      cloning = true;
      cloneAddress = await Clone(chainId, address, signer);
      cloning = false;
    } else {
      console.error("<kredeum-nft/> not signer");
    }
  };

  const description = (nft) => (nft.name != nft.description && nft.description) || " ";

  $: openSeaLinkKredeum = () => openSea?.kredeum;
  $: openSeaLinkToken = (item) => `${openSea?.assets}/${item.contract}/${item.tokenID}`;

  $: kreTokenLink = (item) =>
    explorer?.includes("chainstacklabs.com")
      ? `${explorer}/tokens/${item.contract}/instance/${item.tokenID}/metadata`
      : `${explorer}/token/${item.contract}?a=${item.tokenID}`;

  $: kreLink = () =>
    explorer?.includes("chainstacklabs.com")
      ? `${explorer}/tokens/${contract}/inventory`
      : `${explorer}/token/${contract}#inventory`;

  $: addressLink = (address) =>
    explorer?.includes("chainstacklabs.com")
      ? `${explorer}/address/${contract}/tokens`
      : `${explorer}/address/${contract}/token`;

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

  {#if cloneAddress}
    Collection created: {cloneAddress}
  {:else if cloning}
    Creating collection... sign the transaction and wait till completed, it may takes one minute or
    more.
  {:else}
    <button on:click="{createCollection}">Create Collection</button>
  {/if}

  <h3>
    {#if NFTsContracts?.length > 0}
      <select bind:value="{contract}">
        <option value="">Choose Collection</option>
        {#each NFTsContracts as NFTsContract}
          <option value="{utils.getAddress(NFTsContract.address)}">
            {NFTsContract.totalSupply || (NFTsContract.totalSupply == 0 ? "0" : "?")}
            {NFTsContract.symbol || "NFT"}@{NFTsContract.address}
            {NFTsContract.name ? `- ${NFTsContract.name}` : " "}
          </option>
        {/each}
      </select>
    {:else}
      <p><em>NO Collection found !</em></p>
    {/if}
  </h3>
  {#if refreshingContracts} Refreshing Collections... {/if}

  {#key address && refreshingNFTs}
    {#if NFTs?.length > 0}
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
                    class="{nftImport ? (nftImport == 2 ? 'green' : 'grey') : 'blue'}"
                    on:click="{dispatchImport(nft)}"
                  >
                    {nftImport ? (nftImport == 2 ? "IMPORTED" : "IMPORTING...") : "IMPORT WP"}
                  </button>
                </td>
              {/if}

              <td>
                <div title="{JSON.stringify(nft, null, 2)}">ⓘ</div>
              </td>
            </tr>
          {/each}
        </tbody>
      </table>

      <p>
        {NFTs.length} NFT{NFTs.length > 1 ? "s" : ""}
      </p>
    {:else}
      <p>NO NFT found !</p>
    {/if}
    <p>
      <em
        >{#if refreshingNFTs}Refreshing NFTs...{/if}</em
      >
    </p>

    <!-- {/await} -->
  {/key}

  <small>
    {#if network}Collection <a href="{kreLink()}" target="_blank">
        {nftsUrl(chainId, contract)}
      </a>
    {/if}
    <br />
    {#if address}Address{/if}
    <Metamask autoconnect="off" bind:address bind:chainId bind:signer />
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
