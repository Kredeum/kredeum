<script lang="ts">
  import { Collection, getNetwork, Network, Nft } from "../lib/kconfig";
  import {
    sleep,
    collectionName,
    explorerCollectionInventoryUrl,
    nftImageLink,
    nftDescription,
    nftDescriptionShort,
    nftName,
    nftsSupplyAndName,
    nftOpenSeaUrl,
    addressSame
  } from "../lib/knfts";
  import { nftsUrl } from "../lib/kconfig";
  import { listNFTs, listNFTsFromCache } from "../lib/open-nfts";

  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();

  let network: Network;
  let refreshingCollection: boolean;

  let NFTs: Array<Nft>;
  let Collections: Array<Collection>;
  let nftImport: number;

  // export let beta: string = undefined; // platform : WordPress or Dapp
  export const platform: string = undefined; // platform : WordPress or Dapp

  export let chainId: number = undefined;
  export let address: string = undefined;
  export let collection: Collection = undefined;

  // ON NETWORK, ADDRESS OR COLLECTION CHANGE
  $: if (chainId && address && collection) _listNFTs();

  async function _listNFTs() {
    network = getNetwork(chainId);
    if (network && address && collection) {
      console.log(
        "<kredeum-nfts/> _listNFTs",
        `nft://${network?.chainName && "..."}/${collection.address || "..."}@${address || "..."}`,
        network
      );

      NFTs = null;

      NFTs = listNFTsFromCache(chainId, collection.address, address);
      // console.log("<kredeum-nfts/> _listNFTs cache loaded", NFTs);
      refreshingCollection = true;

      NFTs = await listNFTs(chainId, collection.address, address);
      // console.log("<kredeum-nfts/> _listNFTs refresh done", NFTs);
      refreshingCollection = false;
    }
  }

  const dispatchImport = async (nft: Nft) => {
    nftImport = 1;
    dispatch("import", { nft });
    while ((window as any).ajaxResponse == false) await sleep(1000);
    nftImport = 2;
  };

  const moreToggle = (i: number) => {
    const divTableDrop = document.getElementById(`table-drop-${i}`);
    const divMoreDetail = document.getElementById(`more-detail-${i}`);

    divTableDrop.classList.toggle("closed");
    divTableDrop.style.height = divTableDrop.classList.contains("closed")
      ? "auto"
      : `${divMoreDetail.offsetHeight + 70}px`;
  };
</script>

<div id="kredeum-list-nfts" class="table">
  {#key address && refreshingCollection}
    {#if NFTs?.length > 0}
      <div class="table-row">
        <div class="table-col no-bg">&nbsp;</div>
        <div class="table-col no-bg table-col-full colspan">
          <input id="menu" type="checkbox" />
          Collection {collectionName(collection)}
          <a
            href="{explorerCollectionInventoryUrl(chainId, collection.address)}"
            target="_blank"
            title="{nftsUrl(chainId, collection.address)}"
          >
            <i class="fas fa-external-link-alt"></i>
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
        {#if network?.openSea}
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
          {#if network?.openSea}
            <div id="opensea-{i}" class="table-col">
              {#if addressSame(nft.owner, address)}
                <a
                  href="{nftOpenSeaUrl(chainId, nft)}"
                  class="btn btn-small btn-sell"
                  title="Sell"
                  target="_blank"
                >
                  Sell
                </a>
              {:else}
                <a
                  href="{nftOpenSeaUrl(chainId, nft)}"
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
                      <a href="{explorerNftUrl(nft)}" title="{nft.nid}" target="_blank">
                        &nbsp;{textShort(nft.tokenID, 16)}&nbsp;
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
          {nftsSupplyAndName(NFTs, collection)}
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
