<script lang="ts">
  import Metamask from "./kredeum-metamask.svelte";
  import KredeumNftMint from "./kredeum-nft-mint.svelte";
  import kimages from "../lib/kimages";
  import { createEventDispatcher } from "svelte";
  import { Signer, utils } from "ethers";
  import { Contract, getNetwork, Network, NftData, nftUrl, nftsUrl } from "../lib/kconfig";

  import {
    listContracts,
    listContractsFromCache,
    Clone,
    CloneResponse,
    CloneReceipt,
    CloneAddress
  } from "../lib/nfts-factory";
  import { listNFTs, listNFTsFromCache } from "../lib/open-nfts";

  const dispatch = createEventDispatcher();

  let network: Network;
  let signer: Signer;
  let address: string;
  let chainId: number;
  let explorer: string;
  let openSea: Network["openSea"];
  let refreshingCollection: boolean;
  let refreshingCollections: boolean;
  let cloning: boolean = false;
  let cloningTxHash: string;
  let collectionNew: string;
  let collectionNewName: string;
  let nftImport: number;
  let NFTs: Array<NftData>;
  let Collections: Array<Contract>;
  let collectionContract: Contract;
  let chainIdOld: number;
  let collectionOld: string;
  let addressOld: string;

  export const platform: string = undefined; // platform : WordPress or Dapp
  export let collection: string = undefined; // NFT smartcontract address
  // export let beta: string = undefined; // platform : WordPress or Dapp

  // ADDRESS, CONTRACT OR NETWORK CHANGE
  $: if (address || collection || chainId) _listsUpdate();

  async function _listsUpdate(): Promise<void> {
    if (chainId && address) {
      network = getNetwork(chainId);
      if (network) {
        console.log("<kredeum-nft/> init", chainId, collection, address, network);

        openSea = network.openSea;
        explorer = network.blockExplorerUrls[0] || "";

        // chain change : force collection to default
        // if (chainId != chainIdOld) {
        //   collection = network.openNFTs;
        // }

        // chain or address changed : refresh list collection
        if (chainId != chainIdOld || address != addressOld) {
          _listContracts();
        }
        _listNFTs();

        chainIdOld = chainId;
        addressOld = address;
        collectionOld = collection;
      }
    }
  }

  async function _listContracts() {
    if (network && address) {
      console.log("<kredeum-nft/> _listContracts", `nfts://${network?.chainName}@${address}`);

      Collections = null;

      Collections = listContractsFromCache(chainId);
      // console.log("<kredeum-nft/> Collections cache loaded", Collections);
      refreshingCollections = true;

      Collections = await listContracts(chainId, address);
      // console.log("<kredeum-nft/> Collections refresh done", Collections);
      refreshingCollections = false;
    }
  }

  async function _listNFTs() {
    collectionContract = Collections.find(
      (_contract: Contract) => _contract.address === collection
    );

    if (network && collection && collectionContract && address) {
      console.log(
        "<kredeum-nft/> _listNFTs",
        `nft://${network?.chainName || "..."}/${collection || "..."}@${address || "..."}`,
        network
      );

      NFTs = null;

      NFTs = listNFTsFromCache(chainId, collection, address);
      // console.log("<kredeum-nft/> _listNFTs cache loaded", NFTs);
      refreshingCollection = true;

      NFTs = await listNFTs(chainId, collection, address);
      // console.log("<kredeum-nft/> _listNFTs refresh done", NFTs);
      refreshingCollection = false;
    }
  }

  const short = (s = "", n = 16, p = 0) => {
    const l = s?.toString().length;
    return s?.substring(0, n) + (l < n ? "" : "..." + (p > 0 ? s?.substring(l - p, l) : ""));
  };

  const sameAddress = (a: string, b = address) => a.toLowerCase() === b.toLowerCase();
  const shortAddress = (a: string) => short(a, 8, 8);

  const dispatchImport = async (nft: NftData) => {
    nftImport = 1;
    dispatch("import", { nft });
    while ((window as any).ajaxResponse == false) await sleep(1000);
    nftImport = 2;
  };

  const createCollection = async () => {
    // console.log("<kredeum-nft/> createCollection");
    if (signer) {
      cloning = true;
      cloningTxHash = null;

      const txResp = await CloneResponse(chainId, address, collectionNewName, signer);
      cloningTxHash = txResp.hash;

      const txReceipt = await CloneReceipt(txResp);
      collectionNew = CloneAddress(txReceipt);

      collection = collectionNew;

      dispatch("collectionNew", { collectionNew });

      cloning = false;
    } else {
      console.error("<kredeum-nft/> not signer");
    }
  };

  // General helpers
  const explorerLink = (type: string, address: string) =>
    `<a href="${explorer}/${type}/${address}" target="_blank">${shortAddress(address)}</a>`;
  const explorerAddressLink = (address: string) => explorerLink("address", address);
  const explorerTxLink = (tx: string) => explorerLink("tx", tx);

  // Collection helpers
  const collectionName = (collContract: Contract) => collContract.name || "No name";
  const collectionSymbol = (collContract: Contract) => collContract.symbol || "NFT";
  const collectionTotalSupply = (collContract: Contract) =>
    collContract.totalSupply || (collContract.totalSupply == 0 ? "0" : "?");
  const collectionNameAndTotalSupply = (collContract: Contract) =>
    `${collectionName(collContract)} (${collectionTotalSupply(collContract)})`;

  const collectionOpenSeaLink = (collAddress: string) => openSea?.kredeum;
  const collectionExplorerLink = (collAddress: string) =>
    explorer?.includes("chainstacklabs.com")
      ? `${explorer}/collection/${collAddress}/tokens`
      : `${explorer}/token/${collAddress}`;

  const collectionExplorerInventoryLink = (collAddress: string) =>
    explorer?.includes("chainstacklabs.com") || explorer?.includes("cchain.explorer")
      ? `${explorer}/tokens/${collAddress}/inventory`
      : `${explorer}/token/${collAddress}#inventory`;

  // Nfts helpers
  const nftsSupply = (nfts: Array<NftData>) => nfts.length || 0;
  const nftsSupplyAndName = (nfts: Array<NftData>, collContract: Contract) =>
    `${nftsSupply(nfts)} ${collectionSymbol(collContract)}${nftsSupply(nfts) > 1 ? "s" : ""}`;

  // Nft helpers
  const nftName = (nft: NftData) => nft.name;
  const nftDescription = (nft: NftData) =>
    (nft.name != nft.description && nft.description) ||
    `${collectionContract.name} #${nft.tokenID}`;
  const nftDescriptionShort = (nft: NftData) => short(nftDescription(nft), 140);
  const nftImageLink = (nft: NftData) =>
    nft.image?.replace("https://gateway.pinata.cloud/ipfs/", " https://ipfs.io/ipfs/");
  const nftOpenSeaLink = (nft: NftData) => `${openSea?.assets}/${collection}/${nft.tokenID}`;
  const nftExplorerLink = (nft: NftData) =>
    explorer?.includes("chainstacklabs.com")
      ? `${explorer}/tokens/${nft.contract}/instance/${nft.tokenID}/metadata`
      : `${explorer}/token/${nft.contract}?a=${nft.tokenID}`;

  const moreToggle = (i: number) => {
    const divTableDrop = document.getElementById(`table-drop-${i}`);
    const divMoreDetail = document.getElementById(`more-detail-${i}`);

    divTableDrop.classList.toggle("closed");
    divTableDrop.style.height = divTableDrop.classList.contains("closed")
      ? "auto"
      : `${divMoreDetail.offsetHeight + 70}px`;
  };
  const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
</script>

<div id="kredeum-nft">
  <!-- <form id="search-top" action="">
    <input type="text" id="search" placeholder="Search" />
    <button type="submit">
      <i class="fas fa-search"></i>
    </button>
  </form> -->

  <section class="content">
    <header>
      <div class="row aligncenter">
        <div class="col col-xs-12 col-sm-3">
          <h1>My NFT wallet</h1>
        </div>

        <div class="col col-sm-6">
          {#if Collections?.length > 0}
            <select bind:value="{collection}">
              <option value="">Choose Collection</option>
              {#each Collections as coll}
                <option value="{utils.getAddress(coll.address)}">
                  {collectionNameAndTotalSupply(coll)}
                </option>
              {/each}
            </select>
          {:else}
            <p><em>NO Collection found !</em></p>
          {/if}
          <p>
            {#if refreshingCollections}Refreshing Collection list... {/if}
          </p>
        </div>

        <div class="col col-sm-3 txtright">
          <a href="#create" class="btn btn-light" title="Create"
            ><i class="fas fa-plus"></i><span class="hidden-xs">Create</span></a
          >
        </div>
      </div>
    </header>

    <div class="table">
      <div class="row">
        <div class="col col-xs-12 col-md-3 col-filters">
          <!-- <span class="label">Filter</span> -->
          <div class="box">
            <Metamask autoconnect="off" bind:address bind:chainId bind:signer />

            <div class="box-section">
              <span class="label label-big">Cache</span>
              <div>
                <a href="." on:click="{() => localStorage.clear()}">clear</a>
              </div>
            </div>

            <!-- 
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
            </div> -->

            <!-- <div class="box-section">
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
            </div> -->

            <!-- <div class="box-section">
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
            </div> -->
          </div>
        </div>

        <div class="col col-xs-12 col-md-9">
          <div class="table">
            {#key address && refreshingCollection}
              {#if NFTs?.length > 0}
                <div class="table-row">
                  <div class="table-col no-bg">&nbsp;</div>
                  <div class="table-col no-bg table-col-full colspan">
                    <input id="menu" type="checkbox" />
                    Collection {collectionName(collectionContract)}
                    <span title="{nftsUrl(chainId, collection)}">ⓘ</span>
                    <a href="{collectionExplorerInventoryLink(collection)}" target="_blank">
                      explorer
                    </a>
                    <label for="menu" class="fas fa-ellipsis-v"></label>
                  </div>
                </div>

                <div class="table-row table-head hidden-xs">
                  <div class="table-col"><span class="label">Media</span></div>
                  <!-- <div class="table-col"><span class="label">Type</span></div>
                  <div class="table-col"><span class="label">Date</span></div>
                  <div class="table-col"><span class="label">Network</span></div> -->
                  <div class="table-col"><span class="label">Description</span></div>
                  {#if openSea}
                    <div class="table-col"><span class="label">Marketplace</span></div>
                  {/if}
                  <!-- <div class="table-col"><span class="label">Statut</span></div> -->
                  <div class="table-col"><span class="label">More</span></div>
                  <!-- <div class="table-col"><span class="label">ID</span></div>
                  {#if beta}
                    <div class="table-col"><span class="label">Import</span></div>
                  {/if} -->
                </div>

                {#each NFTs as nft, i}
                  <div id="table-drop-{i}" class="table-row table-drop closed">
                    <div id="media-{i}" class="table-col">
                      <div class="media media-photo">
                        <a href="{nftImageLink(nft)}" title="{nftDescription(nft)}" target="_blank">
                          <img alt="{nftName(nft)}" src="{nftImageLink(nft)}" height="100" />
                        </a>
                      </div>
                    </div>
                    <!-- <div class="table-col"><strong>Photo</strong></div>
                    <div class="table-col light">10/02/21</div> -->
                    <!-- <div class="table-col">
                      <span class="tag tag-{nft.chainName.toLowerCase()}">{nft.chainName}</span>
                    </div> -->
                    <div id="description-{i}" class="table-col">
                      <p title="{nftDescription(nft)}">
                        {nftDescriptionShort(nft)}
                      </p>
                    </div>
                    {#if openSea}
                      <div id="opensea-{i}" class="table-col">
                        {#if sameAddress(nft.owner)}
                          <a
                            href="{nftOpenSeaLink(nft)}"
                            class="btn btn-small btn-sell"
                            title="Sell"
                            target="_blank"
                          >
                            Sell
                          </a>
                        {:else}
                          <a
                            href="{nftOpenSeaLink(nft)}"
                            class="btn btn-small btn-sell"
                            title="Buy"
                            target="_blank"
                          >
                            Buy
                          </a>
                        {/if}
                      </div>
                    {/if}

                    <!-- <div class="table-col">
                      <a href="." class="btn btn-small btn-mint" title="Mint">Mint</a>
                    </div> -->

                    <!-- <div class="table-col more">
                      <div class="more-button"><i class="fas fa-chevron-down"></i></div>
                    </div> -->

                    <!-- <div class="table-col more">
                      <a href="{nftExplorerLink(nft)}" title="{nft.nid}" target="_blank">
                        &nbsp;{short(nft.tokenID, 16)}&nbsp;
                      </a>
                    </div>

                    <div class="table-col more">
                      <a href="{nft.tokenURI}" title="{nft.tokenURI}" target="_blank">
                        <strong>{nft.name || "___"}</strong>
                      </a>
                    </div> -->

                    <!-- <div class="table-col more">
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
                    {/if} -->

                    <div id="more-{i}" class="table-col more" on:click="{() => moreToggle(i)}">
                      <div class="more-button"><i class="fas fa-chevron-down"></i></div>
                    </div>

                    <div id="more-detail-{i}" class="detail">
                      <img alt="{nftName(nft)}" src="{nftImageLink(nft)}" height="600" />
                      <p title="{nftDescription(nft)}">
                        {nftDescription(nft)}
                      </p>
                    </div>
                  </div>
                {/each}

                <div class="table-row">
                  <div class="table-col no-bg table-col-full colspan">
                    {nftsSupplyAndName(NFTs, collectionContract)}
                  </div>
                </div>
              {:else}
                <div class="table-row">
                  <div class="table-col no-bg table-col-full colspan">NO NFT found !</div>
                </div>
              {/if}
              <div class="table-row">
                <div class="table-col no-bg table-col-full colspan">
                  {#if refreshingCollection}
                    <p>
                      <em>Refreshing Collection...</em>
                    </p>
                  {/if}
                </div>
              </div>
            {/key}
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Modal create -->
  <div id="create" class="modal-window">
    <div>
      <div class="modal-content">
        <a href="." title="Close" class="modal-close"><i class="fa fa-times"></i></a>

        <div class="modal-body">
          <div class="titre">
            <i class="fas fa-plus fa-left c-green"></i>What do you want to do ?
          </div>

          <div class="txtcenter">
            <a href="#create-nft" class="btn btn-default" title="Create NFT">Create NFT</a>
            <span class="or">Or</span>
            <a href="#add-collection" class="btn btn-second" title="Add a new collection">
              Add a new collection
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Modal create NFT -->
  <div id="create-nft" class="modal-window">
    <div>
      <div class="modal-content">
        <a href="." title="Close" class="modal-close"><i class="fa fa-times"></i></a>

        <div class="modal-body">
          <div class="titre"><i class="fas fa-plus fa-left c-green"></i>Create NFT</div>

          <form method="POST" action="" enctype="multipart/form-data">
            <div class="section">
              <div class="box-file"><input type="file" id="file" name="file" /></div>
            </div>

            <div class="section">
              <span class="label label-big">Media type</span>
              <div class="box-fields">
                <input
                  class="box-field"
                  id="create-type-video"
                  name="media-type"
                  type="checkbox"
                  value="Video"
                />
                <label class="field" for="create-type-video"><i class="fas fa-play"></i>Video</label
                >

                <input
                  class="box-field"
                  id="create-type-picture"
                  name="media-type"
                  type="checkbox"
                  value="Picture"
                />
                <label class="field" for="create-type-picture"
                  ><i class="fas fa-image"></i>Picture</label
                >

                <input
                  class="box-field"
                  id="create-type-texte"
                  name="media-type"
                  type="checkbox"
                  value="Texte"
                />
                <label class="field" for="create-type-texte"
                  ><i class="fas fa-file-alt"></i>Texte</label
                >

                <input
                  class="box-field"
                  id="create-type-music"
                  name="media-type"
                  type="checkbox"
                  value="Music"
                />
                <label class="field" for="create-type-music"
                  ><i class="fas fa-music"></i>Music</label
                >

                <input
                  class="box-field"
                  id="create-type-web"
                  name="media-type"
                  type="checkbox"
                  value="Web"
                />
                <label class="field" for="create-type-web"><i class="fas fa-code"></i>Web</label>
              </div>
            </div>

            <div class="section">
              <span class="label label-big">Add to an existing collection ?</span>
              <div>
                <select class="custom">
                  <option selected value="0">Collection 0</option>
                  <option value="1">Collection 1</option>
                  <option value="2">Collection 2</option>
                  <option value="3">Collection 3</option>
                </select>
              </div>
            </div>

            <div class="txtright">
              <button class="btn btn-default btn-sell" type="submit">Add file</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>

  <!-- Modal add collection -->
  <div id="add-collection" class="modal-window">
    <div>
      <div class="modal-content">
        <a href="." title="Close" class="modal-close"><i class="fa fa-times"></i></a>

        <div class="modal-body">
          <div>
            {#if collectionNew}
              <div>
                <div class="titre">
                  <i class="fas fa-check fa-left c-green"></i>
                  Collection created @ {@html explorerAddressLink(collectionNew)}
                </div>
              </div>
            {:else if cloning}
              <div class="titre">
                <i class="fas fa-sync fa-left c-green"></i>Creating new collection...
              </div>
              <div>
                Sign the transaction and wait till completed, it may takes one minute or more.
              </div>
            {:else}
              <div class="titre">
                <i class="fas fa-plus fa-left c-green"></i>Name your collection
              </div>

              <div class="section">
                <div class="form-field">
                  <input type="text" placeholder="My collection" bind:value="{collectionNewName}" />
                </div>
              </div>

              <div class="txtright">
                <button class="btn btn-default btn-sell" type="submit" on:click="{createCollection}"
                  >Create</button
                >
              </div>
            {/if}
            {#if cloningTxHash}
              <div>
                Transaction : {@html explorerTxLink(cloningTxHash)}
              </div>
            {/if}
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
