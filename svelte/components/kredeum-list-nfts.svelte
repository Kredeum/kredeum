<script lang="ts">
  import type { Collection, Network, Nft } from "lib/ktypes";
  import type { Provider } from "@ethersproject/abstract-provider";
  import KredeumGetNft from "./kredeum-get-nft.svelte";

  import { collectionName, explorerCollectionUrl, nftsBalanceAndName, nftsUrl, nftUrl3 } from "lib/kconfig";
  import { chainId, network, provider, owner } from "main/network";
  import { clearCache, nftList, nftListFromCache, nftListTokenIds } from "lib/knft-list";
  import { nftGetFromContractEnumerable, nftGetMetadata, nftGetImageLink } from "lib/knft-get";
  import { onMount } from "svelte";

  // down to component
  export let collection: Collection = undefined;
  export let platform: string = undefined; // platform : wordPress or dapp
  // up to parent
  export let refreshing: boolean;

  let collectionAddress: string;
  let numNFT: number;

  let NFTs: Map<string, Nft>;
  let allNFTs: Map<string, Nft>;
  let tokenID = "";

  // Track NFTs div offsetHeight with "more" details
  let mores: Array<number> = [];

  export const nftsList = async () => {
    _nftsList();
  };

  $: if (collection && $chainId && $owner) collectionAddress = collection.address;

  $: if (collectionAddress) _nftsList(true);

  const _nftsList = (cache = false) => {
    if (collection && collection.chainId == $chainId && $owner) {
      // console.log("_nftsList", _chainId, _owner, cache, _collection);

      let fromLib = !cache;

      if (cache) {
        // LOAD NFTs from cache
        const nbNFTs = _nftsListFromCache($chainId, collection, $owner);

        // REFRESH LIB WHEN NFT count found in cache not good
        fromLib = nbNFTs !== collection.balanceOf;
      }

      if (fromLib) {
        // LOAD NFTs from lib
        _nftsListFromLib($chainId, collection, $owner);
      }
    }
  };

  const _nftsListFromCache = (_chainId: number, _collection: Collection, _owner: string): number => {
    allNFTs = nftListFromCache();
    // console.log("allNFTs", allNFTs);

    NFTs = new Map(
      [...allNFTs].filter(
        ([, nft]) => nft.chainId === _chainId && nft.collection === _collection.address && nft.owner === _owner
      )
    );

    // console.log("_nftsListFromCache =>", NFTs?.size, NFTs);
    return NFTs?.size;
  };

  const _nftsListFromLib = async (_chainId: number, _collection: Collection, _owner: string) => {
    clearCache($chainId, collection.address);
    mores = [];
    NFTs = new Map();

    // console.log("_nftsListFromLib", _chainId, _owner, _collection);

    if (_collection.supports) {
      refreshing = true;

      if (_collection.supports.IERC721Enumerable) {
        const nbNFTs = _collection.balanceOf;

        for (numNFT = 0; numNFT < nbNFTs && unchanged(_chainId, _collection); numNFT++) {
          const nftIndex = await nftGetFromContractEnumerable(_chainId, _collection, numNFT, $provider, _owner);
          const nft = await nftGetMetadata(_chainId, nftIndex, _collection);
          if (nft?.nid) NFTs.set(nft.nid, nft);
        }
      } else {
        const nftsTokenIds = await nftListTokenIds(_chainId, _collection, $provider, _owner);
        nftsTokenIds.forEach(async (nftTokenId) => {
          const nft = await nftGetMetadata(_chainId, nftTokenId, _collection);
          if (nft?.nid) NFTs.set(nft.nid, nft);
          NFTs = NFTs; // needed in Svelte for Map reactivity !
        });
      }

      refreshing = false;
      // console.log("_nftsListFromLib OUT =>", NFTs?.size, NFTs);
    } else {
      console.error("_nftsListFromLib Collection not ready", _collection);
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

{#key NFTs && collection && numNFT}
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
        <KredeumGetNft {nft} {index} {platform} more={tokenID == nft.tokenID ? -1 : mores[index]} />
      {/each}
    </div>
  {:else}
    <div class="card-krd">
      <p>No NFTs ✌️</p>
    </div>
  {/if}
{/key}
