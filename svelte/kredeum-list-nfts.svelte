<script lang="ts">
  import type { Collection, Network, Nft } from "lib/ktypes";

  import {
    sleep,
    collectionName,
    explorerCollectionUrl,
    nftImageLink,
    nftDescription,
    nftDescriptionShort,
    nftName,
    nftsBalanceAndName,
    nftOpenSeaUrl,
    nftExplorerLink,
    addressSame,
    textShort,
    explorerNftUrl,
    explorerAddressLink
  } from "lib/knfts";
  import { listNFTsTokenId, listNFTsFromCache, addNftMetadata } from "lib/klist-nfts";
  import { getNetwork, getShortAddress } from "lib/kconfig";
  import { createEventDispatcher } from "svelte";
  import { nftUrl, nftsUrl } from "lib/kconfig";
  import { clearCache } from "lib/klist-nfts";

  // down to component
  export let owner: string = undefined;
  export let collection: Collection = undefined;
  export let platform: string = undefined; // platform : wordPress or dapp
  // up to parent
  export let refreshing: boolean;

  let index: number;
  let network: Network;
  let chainId: number;

  let NFTs: Map<string, Nft>;
  let allNFTs: Map<string, Nft>;
  let Collections: Array<Collection>;
  let nftImport: number;

  const dispatch = createEventDispatcher();

  // ON OWNER OR COLLECTION CHANGE
  $: {
    // console.log(
    //   "KredeumListNfts owner or collection changed, so refresh NFTs...",
    //   owner,
    //   collection
    // );
    if (owner && collection) {
      chainId = collection?.chainId;
      refreshNFTs();
    }
  }

  export const refreshNFTs = async (force = false) => {
    // console.log("refreshNFTS", force, collection);
    network = getNetwork(chainId);

    if (network && collection && owner) {
      let refreshLib: boolean;

      if (force) {
        refreshLib = true;
      } else {
        // LOAD NFTs from cache
        const numNFTs = _refreshNFTsFromCache(chainId, collection, owner);

        // REFRESH LIB WHEN NFT count found in cache not good
        refreshLib = numNFTs !== collection.balanceOf;
      }

      // LOAD NFTs from lib
      if (refreshLib) {
        clearCache(chainId, collection.address);
        NFTs = new Map();
        _refreshNFTsFromLib(chainId, collection, owner);
      }
    }
  };

  const _refreshNFTsFromCache = (
    _chainId: number,
    _collection: Collection,
    _owner: string
  ): number => {
    allNFTs = listNFTsFromCache();
    // console.log("allNFTs", allNFTs);

    NFTs = new Map(
      [...allNFTs].filter(
        ([, nft]) =>
          nft.chainId === chainId && nft.collection === collection.address && nft.owner === owner
      )
    );

    // console.log("_refreshNFTsFromCache =>", NFTs?.size, NFTs);
    return NFTs?.size;
  };

  const _refreshNFTsFromLib = async (_chainId: number, _collection: Collection, _owner: string) => {
    // console.log("_refreshNFTsFromLib");

    const numNFTs = _collection.balanceOf || _collection.totalSupply;
    // console.log("_refreshNFTsFromLib numNFTs", numNFTs);

    for (index = 0; index < numNFTs; index++) {
      refreshing = true;

      const nftFromId = await listNFTsTokenId(_chainId, _collection.address, index, _owner);
      const nft = await addNftMetadata(chainId, nftFromId, _collection.address);

      // chainId and collection have not changed while loading NFTs
      if (chainId === _chainId && collection?.address === _collection.address) {
        NFTs.set(nft.nid, nft);
        // console.log("no break", chainId, _chainId, collection?.address, _collection.address);
      } else {
        // console.log("break");
        break;
      }
    }
    refreshing = false;

    // console.log("_refreshNFTsFromLib =>", NFTs?.size, NFTs);
  };

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

  const shortcode = async (nft: Nft) => {
    const data = `[kredeum_sell chain="${nft.chainName}" collection="${nft.collection}" tokenid="${
      nft.tokenID
    }" cid="${nft.cid}"]${nftName(nft)}[/kredeum_sell]`;

    await navigator.clipboard.writeText(data).catch(() => console.log("Not copied"));
    console.log("Copied");
  };
</script>

{#key owner && index}
  {#if collection?.balanceOf > 0}
    <h2>
      Collection {collectionName(collection)}
    </h2>
    {nftsBalanceAndName(collection)}
    <a
      class="info-button"
      href={explorerCollectionUrl(chainId, collection?.address)}
      title="&#009;Collection address (click to view in explorer)&#013;
      {nftsUrl(chainId, collection?.address)}"
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
      {#each [...NFTs.values()] as nft, i}
        <div id="table-drop-{i}" class="table-row table-drop closed">
          <div id="media-{i}" class="table-col">
            <div class="table-col-content">
              <div class="media media-small media-photo">
                <img alt="link" src={nftImageLink(nft)} height="100" />
              </div>
              <strong>{nftName(nft)}</strong>
              <span id="description-short-{i}">{nftDescriptionShort(nft, 64)}</span>
              <a
                class="info-button"
                href={nftImageLink(nft)}
                title="&#009;{nftDescription(nft)} 
                NFT address (click to view in explorer)&#013.{nftUrl(nft)}"
                target="_blank"><i class="fas fa-info-circle" /></a
              >
            </div>
          </div>

          <div id="marketplace-{i}" class="table-col">
            <div class="table-col-content">
              {#if network?.openSea}
                {#if addressSame(nft.owner, owner)}
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
                    class="btn btn-small btn-buy"
                    title="Buy"
                    target="_blank"
                  >
                    Buy
                  </a>
                {/if}
              {:else}
                <a
                  class="info-button"
                  href={nftImageLink(nft)}
                  title="&#009;{nftDescription(nft)} 
                  NFT address (click to view explorer)&#013.{nftUrl(nft)}"
                  target="_blank"><i class="fas fa-info-circle" /></a
                >
              {/if}
              <span id="token-id-{i}" title="  #{nft.tokenID}">
                &nbsp;&nbsp;<strong>#{textShort(nft.tokenID)}</strong>
              </span>
            </div>
          </div>

          <div id="more-{i}" class="table-col more" on:click={() => moreToggle(i)}>
            <div class="table-col-content txtright">
              <div class="more-button"><i class="fas fa-chevron-down" /></div>
            </div>
          </div>

          <div id="more-detail-{i}" class="detail">
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
                  <div class="flex"><span class="label">Owner</span></div>
                  <div class="flex">
                    {@html explorerAddressLink(chainId, nft.owner, 15)}
                  </div>
                </li>
                <li class="complete">
                  <div class="flex"><span class="label">Token REF</span></div>
                  <div class="flex">
                    <a class="link" href={explorerNftUrl(chainId, nft)} target="_blank">
                      {@html nftUrl(nft, 10)}
                    </a>
                  </div>
                </li>
                <li class="complete">
                  <div class="flex"><span class="label">Collection @</span></div>
                  <div class="flex">
                    <a
                      class="link"
                      href={explorerCollectionUrl(chainId, nft?.collection)}
                      target="_blank">{getShortAddress(collection?.address, 15)}</a
                    >
                  </div>
                </li>

                <li class="complete">
                  <div class="flex"><span class="label">Metadata CID</span></div>
                  <div class="flex">
                    <a class="link" href={nft.tokenURI} target="_blank">{textShort(nft.cidJson)}</a>
                  </div>
                </li>
                <li class="complete">
                  <div class="flex"><span class="label">Image CID</span></div>
                  <div class="flex">
                    <a class="link" href={nft.image} target="_blank">{textShort(nft.cid)}</a>
                  </div>
                </li>
                {#if platform === "wordpress"}
                  <li class="complete">
                    <div class="flex"><span class="label">Copy shortcode sell button</span></div>
                    <div class="flex">
                      <button on:click={() => shortcode(nft)} class="btn krd_shortcode_data"
                        >Shortcode</button
                      >
                    </div>
                  </li>
                {/if}
              </ul>
            </div>
          </div>
        </div>
      {/each}
    </div>
  {:else}
    <div class="card-krd">
      <p>No NFTs ✌️</p>
    </div>
  {/if}
{/key}
