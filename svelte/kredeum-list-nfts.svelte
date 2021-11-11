<script lang="ts">
  import { Collection, getNetwork, Network, Nft } from "../lib/kconfig";
  import {
    sleep,
    collectionName,
    explorerCollectionInventoryUrl,
    nftImageLink,
    explorerCollectionUrl,
    nftDescription,
    nftDescriptionShort,
    nftName,
    nftsSupplyAndName,
    nftOpenSeaUrl,
    nftExplorerLink,
    addressSame,
    addressShort,
    explorerNftUrl,
    nftUrl
  } from "../lib/knfts";

  import { nftsUrl } from "../lib/kconfig";
  import { listNFTs, listNFTsFromCache } from "../lib/open-nfts";

  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();

  let network: Network;

  let NFTs: Array<Nft>;
  let Collections: Array<Collection>;
  let nftImport: number;

  // export let beta: string = undefined; // platform : WordPress or Dapp
  export const platform: string = undefined; // platform : WordPress or Dapp

  export let chainId: number = undefined;
  export let address: string = undefined;
  export let collection: Collection = undefined;
  export let refreshing: boolean;

  export const refreshNFTs = async () => {
    network = getNetwork(chainId);
    if (network && address && collection) {
      // console.log(
      //   "<kredeum-nfts/> refreshNFTs",
      //   `nft://${network?.chainName && "..."}/${collection.address || "..."}@${address || "..."}`,
      //   network
      // );

      NFTs = null;

      NFTs = listNFTsFromCache(chainId, collection.address, address);
      // console.log("<kredeum-nfts/> refreshNFTs from cache loaded", NFTs);

      refreshing = true;

      NFTs = await listNFTs(chainId, collection.address, address);
      // console.log("<kredeum-nfts/> refreshNFTs done", NFTs);
      refreshing = false;
    }
  };

  // ON NETWORK, ADDRESS OR COLLECTION CHANGE
  $: if (chainId && address && collection) refreshNFTs();

  const dispatchImport = async (nft: Nft) => {
    nftImport = 1;
    dispatch("import", { nft });
    while ((window as any).ajaxResponse == false) await sleep(1000);
    nftImport = 2;
  };

  const moreToggle = (i: number) => {
    const divTableDrop = document.getElementById(`table-drop-${i}`);
    const divMoreDetail = document.getElementById(`more-detail-${i}`);
    const divDescShort = document.getElementById(`description-short-${i}`);
    divDescShort.classList.toggle("hidden");
    divTableDrop.classList.toggle("closed");
    divTableDrop.style.height = divTableDrop.classList.contains("closed")
      ? "auto"
      : `${divMoreDetail.offsetHeight + 70}px`;
  };
</script>

{#key address && refreshing}
  {#if NFTs?.length > 0}
    <h2>
      Collection {collectionName(collection)}
    </h2>
    {nftsSupplyAndName(NFTs, collection)}
    <a
      class="info-button"
      href={explorerCollectionInventoryUrl(chainId, collection?.address)}
      title={collection?.address}
      target="_blank"><i class="fas fa-info-circle" /></a
    >

    <div class="table">
      <div class="table-row table-head hidden-xs">
        <div class="table-col"><span class="label">Media</span></div>
        {#if network?.openSea}
          <div class="table-col"><span class="label">Marketplace</span></div>
        {:else}
          <div class="table-col"><span class="label">Infos</span></div>
        {/if}
      </div>
      {#each NFTs as nft, i}
        <div id="table-drop-{i}" class="table-row table-drop closed">
          <div id="media-{i}" class="table-col">
            <div class="table-col-content">
              <div class="media media-small media-photo">
                <img alt="link" src={nftImageLink(nft)} height="100" />
              </div>
              <strong>{nftName(nft)}</strong>
              <span id="description-short-{i}">{nftDescriptionShort(nft, 64)}</span>
            </div>
          </div>

          {#if network?.openSea}
            <div id="marketplace-{i}" class="table-col">
              <div class="table-col-content">
                {#if addressSame(nft.owner, address)}
                  <a
                    href={nftOpenSeaUrl(chainId, nft)}
                    class="btn btn-small btn-sell"
                    title="Sell"
                    target="_blank"
                  >
                    Sell
                  </a>
                {:else}
                  <a
                    href={nftOpenSeaUrl(chainId, nft)}
                    class="btn btn-small btn-sell"
                    title="Buy"
                    target="_blank"
                  >
                    Buy
                  </a>
                {/if}
              </div>
            </div>
          {:else}
            <div class="table-col">
              <div class="table-col-content">
                <a
                  class="info-button"
                  href={nftImageLink(nft)}
                  title={nftDescription(nft)}
                  target="_blank"><i class="fas fa-info-circle" /></a
                >
              </div>
            </div>
          {/if}

          <div id="more-{i}" class="table-col more" on:click={() => moreToggle(i)}>
            <div class="table-col-content txtright">
              <div class="more-button"><i class="fas fa-chevron-down" /></div>
            </div>
          </div>

          <div class="detail">
            <div id="media-full-{i}" class="media media-photo">
              <img alt="link" src={nftImageLink(nft)} />
            </div>
            <div id="description-{i}" class="description">
              <strong>Description</strong>
              <p>
                {nftDescription(nft)}
              </p>
              <ul class="steps">
                <li class="complete">
                  <div class="flex"><span class="label">Token ID</span></div>
                  <div class="flex">
                    <a class="link" href={explorerNftUrl(nft.chainId, nft)} target="_blank"
                      ><strong>{nft.tokenID}</strong></a
                    >
                  </div>
                </li>
                <li class="complete">
                  <div class="flex"><span class="label">Metadata CID</span></div>
                  <div class="flex">
                    <a class="link" href={nft.tokenURI} target="_blank"
                      >{addressShort(nft.cidJson)}</a
                    >
                  </div>
                </li>
                <li class="complete">
                  <div class="flex"><span class="label">Image CID</span></div>
                  <div class="flex">
                    <a class="link" href={nft.image} target="_blank">{addressShort(nft.cid)}</a>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      {/each}
    </div>
  {:else}
    <div class="card">
      <p>No NFTs ✌️</p>
    </div>
  {/if}
{/key}

<div id="kredeum-list-nfts" class="table">
  {#key address && refreshing}
    {#if NFTs?.length > 0}
      {#each NFTs as nft, i}
        <div id="table-drop-{i}" class="table-row table-drop closed">
          <!-- <div id="more-{i}" class="table-col more" on:click="{() => moreToggle(i)}">
            <div class="more-button"><i class="fas fa-chevron-down"></i></div>
          </div> -->

          <div id="more-detail-{i}" class="detail">
            <div class="table">
              <div class="table-row">
                <div class="table-col">
                  <img alt={nftName(nft)} src={nftImageLink(nft)} height="600" />
                  <p title={nftDescription(nft)}>
                    {nftDescription(nft)}
                  </p>
                </div>
                <div class="table-col" />
              </div>
            </div>
          </div>
        </div>
      {/each}
    {/if}
  {/key}
</div>
