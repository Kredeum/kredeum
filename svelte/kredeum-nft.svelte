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
  let collection: string;
  let collectionName: string;
  let nftImport: number;
  let NFTs: Array<NftData>;
  let NFTsContracts: Array<Contract>;
  let chainIdOld: number;
  let contractOld: string;
  let addressOld: string;

  export const platform: string = undefined; // platform : WordPress or Dapp
  export let contract: string = undefined; // NFT smartcontract address
  export let beta: string = undefined; // platform : WordPress or Dapp

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
        // if (chainId != chainIdOld) {
        //   contract = network.openNFTs;
        // }

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
      // console.log("<kredeum-nft/> NFTsContracts cache loaded", NFTsContracts);
      refreshingContracts = true;

      NFTsContracts = await listContracts(chainId, address);
      // console.log("<kredeum-nft/> NFTsContracts refresh done", NFTsContracts);
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

      NFTs = listNFTsFromCache(chainId, contract, address);
      // console.log("<kredeum-nft/> _listNFTs cache loaded", NFTs);
      refreshingNFTs = true;

      NFTs = await listNFTs(chainId, contract, address);
      // console.log("<kredeum-nft/> _listNFTs refresh done", NFTs);
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
    // console.log("<kredeum-nft/> createCollection");
    if (signer) {
      cloning = true;

      collection = await Clone(chainId, address, collectionName, signer);
      contract = collection;

      dispatch("collection", { collection });

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
    explorer?.includes("chainstacklabs.com") || explorer?.includes("cchain.explorer")
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

<div>
  <form id="search-top" action="">
    <input type="text" id="search" placeholder="Search" />
    <button type="submit">
      <i class="fas fa-search"></i>
    </button>
  </form>

  <section class="content">
    <header>
      <div class="row aligncenter">
        <div class="col col-xs-12 col-sm-3">
          <h1>My NFT wallet</h1>
        </div>

        <div class="col col-sm-6">
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
          {#if refreshingContracts} Refreshing Collections... {/if}
        </div>

        <div class="col col-sm-3 txtright">
          <a href="#create" class="btn btn-light" title="Create"
            ><i class="fas fa-plus"></i><span class="hidden-xs">Create</span></a
          >
        </div>

        <div>
          {#if beta}
            {#if collection}
              Collection created: {collection}
            {:else if cloning}
              Creating collection... sign the transaction and wait till completed, it may takes one
              minute or more.
            {:else}
              <input bind:value="{collectionName}" placeholder="Collection name" />
              <button on:click="{createCollection}">Create Collection</button>
            {/if}
          {/if}
        </div>
      </div>
    </header>

    <div class="table">
      <div class="row">
        <div class="col col-xs-12 col-md-3 col-filters">
          <span class="label">Filter</span>
          <div class="box">
            <div class="box-section">
              <div>
                <Metamask autoconnect="off" bind:address bind:chainId bind:signer />
              </div>
            </div>

            <div class="box-section">
              <span class="label label-big">Statut</span>
              <div class="box-fields">
                <input
                  class="box-field"
                  id="mint"
                  name="statut"
                  type="checkbox"
                  value="Mint"
                  checked
                />
                <label class="field" for="mint">Mint</label>

                <input
                  class="box-field"
                  id="inactive"
                  name="statut"
                  type="checkbox"
                  value="Inactive"
                />
                <label class="field" for="inactive">Inactive</label>

                <input class="box-field" id="sell" name="statut" type="checkbox" value="Sell" />
                <label class="field" for="sell">Sell</label>
              </div>
            </div>

            <div class="box-section">
              <span class="label label-big">Media type</span>
              <div class="box-fields">
                <input
                  class="box-field"
                  id="picture"
                  name="media-type"
                  type="checkbox"
                  value="Picture"
                  checked
                />
                <label class="field" for="picture"><i class="fas fa-image"></i>Picture</label>

                <input
                  class="box-field"
                  id="video"
                  name="media-type"
                  type="checkbox"
                  value="Video"
                />
                <label class="field" for="video"><i class="fas fa-play"></i>Video</label>

                <input
                  class="box-field"
                  id="texte"
                  name="media-type"
                  type="checkbox"
                  value="Texte"
                />
                <label class="field" for="texte"><i class="fas fa-file-alt"></i>Texte</label>

                <input
                  class="box-field"
                  id="music"
                  name="media-type"
                  type="checkbox"
                  value="Music"
                />
                <label class="field" for="music"><i class="fas fa-music"></i>Music</label>

                <input class="box-field" id="web" name="media-type" type="checkbox" value="Web" />
                <label class="field" for="web"><i class="fas fa-code"></i>Web</label>
              </div>
            </div>

            <div class="box-section">
              <span class="label label-big">Marketplace</span>
              <div class="box-fields">
                <input
                  class="box-field"
                  id="opensea"
                  name="marketplace"
                  type="checkbox"
                  value="Ethereum"
                  checked
                />
                <label class="field" for="opensea">Opensea</label>

                <input
                  class="box-field"
                  id="venly"
                  name="marketplace"
                  type="checkbox"
                  value="Venly"
                />
                <label class="field" for="venly">Venly</label>
              </div>
            </div>
          </div>
        </div>

        <div class="col col-xs-12 col-md-9">
          <div class="table">
            {#key address && refreshingNFTs}
              {#if NFTs?.length > 0}
                <div class="table-row table-head hidden-xs">
                  <div class="table-col"><span class="label">Media</span></div>
                  <div class="table-col"><span class="label">Type</span></div>
                  <div class="table-col"><span class="label">Date</span></div>
                  <div class="table-col"><span class="label">Description</span></div>
                  <div class="table-col"><span class="label">Network</span></div>
                  {#if openSea}
                    <div class="table-col"><span class="label">Marketplace</span></div>
                  {/if}
                  <div class="table-col"><span class="label">Statut</span></div>
                  <div class="table-col"><span class="label">More</span></div>
                  <div class="table-col"><span class="label">ID</span></div>
                  {#if beta}
                    <div class="table-col"><span class="label">Import</span></div>
                  {/if}
                  <div class="table-col"><span class="label">Import</span></div>
                </div>

                <div class="table-row">
                  <div class="table-col no-bg">&nbsp;</div>
                  <div class="table-col no-bg table-col-full colspan">
                    <input id="menu" type="checkbox" />
                    My first collection <label for="menu" class="fas fa-ellipsis-v"></label>
                  </div>
                </div>

                {#each NFTs as nft}
                  <div id="table-drop-1" class="table-row table-drop closed">
                    <div class="table-col">
                      <div class="media media-photo">
                        <a href="{imageLink(nft)}" title="{nft.description}" target="_blank">
                          <img alt="{nft.name}" src="{imageLink(nft)}" height="100" />
                        </a>
                      </div>
                    </div>
                    <div class="table-col"><strong>Photo</strong></div>
                    <div class="table-col light">10/02/21</div>
                    <div class="table-col light">
                      <p title="{description(nft)}">
                        {short(description(nft), 140)}
                      </p>
                    </div>
                    <div class="table-col"><span class="tag tag-bsc">Bsc</span></div>
                    {#if openSea}
                      <div class="table-col">
                        <span class="tag tag-marketplace">
                          {#if sameAddress(nft.owner)}
                            <button class="btn btn-small btn-sell" title="Sell NFT">SELL NFT</button
                            >
                          {:else}
                            <button class="btn btn-small btn-buy" title="Buy NFT">BUY NFT</button>
                          {/if}</span
                        >
                      </div>
                    {/if}
                    <div class="table-col">
                      <a href="." class="btn btn-small btn-mint" title="Mint">Mint</a>
                    </div>
                    <div class="table-col more">
                      <div class="more-button"><i class="fas fa-chevron-down"></i></div>
                    </div>

                    <div class="table-col more">
                      <a href="{kreTokenLink(nft)}" title="{nft.nid}" target="_blank">
                        &nbsp;{short(nft.tokenID, 16)}&nbsp;
                      </a>
                    </div>

                    <div class="table-col more">
                      <a href="{nft.tokenURI}" title="{nft.tokenURI}" target="_blank">
                        <strong>{nft.name || "___"}</strong>
                      </a>
                    </div>

                    <div class="table-col more">
                      <a href="{openSeaLinkToken(nft)}" target="_blank"> </a>
                    </div>

                    <div class="table-col more">
                      <div title="{JSON.stringify(nft, null, 2)}">ⓘ</div>
                    </div>

                    {#if beta}
                      <div class="table-col more">
                        <button
                          url="{nft.image}"
                          class="{nftImport ? (nftImport == 2 ? 'green' : 'grey') : 'blue'}"
                          on:click="{dispatchImport(nft)}"
                        >
                          {nftImport ? (nftImport == 2 ? "IMPORTED" : "IMPORTING...") : "IMPORT WP"}
                        </button>
                      </div>
                    {/if}

                    <div class="detail">test</div>
                  </div>
                {/each}

                <div>
                  <em
                    >{#if refreshingNFTs}Refreshing NFTs...{/if}</em
                  >
                </div>

                <p>
                  {NFTs.length} NFT{NFTs.length > 1 ? "s" : ""}
                </p>
              {:else}
                <p>NO NFT found !</p>
              {/if}
            {/key}
          </div>
        </div>
      </div>
    </div>
  </section>

  <small>
    {#if network}
      <div>
        Collection
        <a href="{kreLink()}" target="_blank">
          {nftsUrl(chainId, contract)}
        </a>
      </div>
    {/if}
    <div>
      Cache <a href="." on:click="{() => localStorage.clear()}">clear</a>
    </div>
  </small>
</div>
