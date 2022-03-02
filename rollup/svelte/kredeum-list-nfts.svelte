<script lang="ts">
  import type { Collection, Network, Nft } from "lib/ktypes";
  import type { Provider } from "@ethersproject/abstract-provider";
  import KredeumGetNft from "./kredeum-get-nft.svelte";

  import { collectionName, explorerCollectionUrl, nftsBalanceAndName, nftsUrl, nftUrl3 } from "lib/kconfig";
  import { chainId, network, provider, owner } from "./network";
  import { clearCache, nftListFromCache, nftListTokenIds } from "lib/knft-list";
  import { nftGetFromContractEnumerable, nftGetMetadata, nftGetImageLink } from "lib/knft-get";
  import { onMount } from "svelte";

  // down to component
  export let collection: Collection = undefined;
  export let platform: string = undefined; // platform : wordPress or dapp
  // up to parent
  export let refreshing: boolean;

  let numNFT: number;

  let NFTs: Map<string, Nft>;
  let allNFTs: Map<string, Nft>;
  let Collections: Array<Collection>;
  let nftImport: number;
  let tokenID = "";

  // Track NFTs div offsetHeight with "more" details
  let mores: Array<number> = [];

  // ON NETWORK, OWNER OR COLLECTION CHANGE
  $: if ($network && $owner && collection) refreshNFTs(true);

  export const refreshNFTs = async (cache = false) => {
    // console.log("refreshNFTS", force, collection);

    if (cache) {
      // LOAD NFTs from cache
      const nbNFTs = _refreshNFTsFromCache($chainId, collection, $owner);

      // REFRESH LIB WHEN NFT count found in cache not good
      if (nbNFTs !== collection.balanceOf) refreshNFTs(false);
    } else {
      // LOAD NFTs from lib
      _refreshNFTsFromLib($chainId, collection, $provider, $owner);
    }
  };

  const _refreshNFTsFromCache = (_chainId: number, _collection: Collection, _owner: string): number => {
    allNFTs = nftListFromCache();
    // console.log("allNFTs", allNFTs);

    NFTs = new Map(
      [...allNFTs].filter(
        ([, nft]) => nft.chainId === _chainId && nft.collection === _collection.address && nft.owner === _owner
      )
    );

    // console.log("_refreshNFTsFromCache =>", NFTs?.size, NFTs);
    return NFTs?.size;
  };

  const _refreshNFTsFromLib = async (_chainId: number, _collection: Collection, _provider: Provider, _owner: string) => {
    clearCache($chainId, collection.address);
    mores = [];
    NFTs = new Map();

    // console.log("_refreshNFTsFromLib", _chainId, _owner, _collection);

    if (_collection.supports) {
      const nbNFTs = _collection.balanceOf || _collection.totalSupply;
      // console.log("_refreshNFTsFromLib nbNFTs", nbNFTs);

      refreshing = true;

      if (_collection.supports.IERC721Enumerable) {
        for (numNFT = 0; numNFT < nbNFTs && unchanged(_chainId, _collection); numNFT++) {
          const nftIndex = await nftGetFromContractEnumerable(_chainId, _collection, numNFT, _provider, _owner);
          const nft = await nftGetMetadata(_chainId, nftIndex, _collection);
          if (nft?.nid) NFTs.set(nft.nid, nft);
        }
      } else {
        const nftsTokenIds = await nftListTokenIds(_chainId, _collection, _provider, _owner);
        nftsTokenIds.forEach(async (nftTokenId) => {
          const nft = await nftGetMetadata(_chainId, nftTokenId, _collection);
          if (nft?.nid) NFTs.set(nft.nid, nft);
          NFTs = NFTs; // needed in Svelte for Map reactivity !
        });
      }

      refreshing = false;
      // console.log("_refreshNFTsFromLib OUT =>", NFTs?.size, NFTs);
    } else {
      console.error("_refreshNFTsFromLib Collection not ready", _collection);
    }
  };

  const unchanged = async (_chainId: number, _collection: Collection): Promise<boolean> => {
    // chainId and collection have not changed while loading NFTs
    return $chainId === _chainId && collection?.address === _collection.address;
  };

  onMount(async () => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has("tokenID")) tokenID = urlParams.get("tokenID");
  });
</script>

{#key NFTs && collection}
  {#if NFTs && collection?.balanceOf > 0}
    <h2>
      Collection {collectionName(collection)}
    </h2>
    {nftsBalanceAndName(collection)}
    <a
      class="info-button"
      href={explorerCollectionUrl($chainId, collection?.address)}
      title="&#009;Collection address (click to view in explorer)&#013;
      {nftsUrl($chainId, collection?.address)}"
      target="_blank"><i class="fas fa-info-circle" /></a
    >

    <div class="table">
      <div class="table-row table-head hidden-xs">
        <div class="table-col"><span class="label">Media</span></div>
        {#if $network?.openSea}
          <div class="table-col"><span class="label">Marketplace</span></div>
        {:else}
          <div class="table-col"><span class="label">Infos</span></div>
        {/if}
      </div>
      {#each [...NFTs.values()] as nft, index}
        {#if tokenID == ""}
          <KredeumGetNft {nft} {index} {platform} more={mores[index]} />
        {:else if tokenID == nft.tokenID}
          <KredeumGetNft {nft} {index} {platform} more={-1} />
        {/if}
      {/each}
    </div>
  {:else}
    <div class="card-krd">
      <p>No NFTs ✌️</p>
    </div>
  {/if}
{/key}
