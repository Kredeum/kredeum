<script lang="ts">
  import { onMount } from "svelte";

  import type { Collection, Nft as NftType } from "lib/ktypes";
  import Nft from "./Nft.svelte";
  import NftGet from "./NftGet.svelte";

  import { collectionName, explorerCollectionUrl, nftsBalanceAndName, nftsUrl } from "lib/kconfig";
  import { nftListTokenIds, nftListFromCache } from "lib/knft-list";
  import { nftGetFromContractEnumerable } from "lib/knft-get";
  import { nftGetMetadata } from "lib/knft-get-metadata";
  import { getNetwork } from "lib/kconfig";
  import { collectionGetFromCache } from "lib/kcollection-get";
  import { cacheClear } from "lib/kcache";

  import { metamaskProvider } from "main/metamask";

  /////////////////////////////////////////////////
  // <NftList {chainId} {collectionObject}  {account} {refreshing} {platform} {nftsList}/>
  // List Nfts from collection owned by account
  /////////////////////////////////////////////////
  export let chainId: number;
  export let collection: string;
  export let account: string = undefined;
  export let refreshing: boolean = true;
  export let platform: string = ""; // platform : wordPress or dapp
  export const nftsList = async () => await _nftsList(chainId, collection, account);

  let refresh = true;

  let collectionObject: Collection;
  let numNFT: number;
  let nbNFTs: number;

  let NFTs: Map<string, NftType>;
  let allNFTs: Map<string, NftType>;
  let mores: Array<number> = [];

  $: _nftsList(chainId, collection, account, true);
  $: nbNFTs = NFTs.size;

  const _nftsList = async (_chainId: number, _collection: string, _account: string, cache = false) => {
    console.log("_nftsList", _chainId, _collection, _account);

    if (_chainId && _collection && _account) {
      collectionObject = collectionObject || collectionGetFromCache(_chainId, _collection);
      console.log("_nftsList= ~ collectionObject", collectionObject);

      let fromLib = !cache;

      if (cache) {
        // LOAD NFTs from cache
        const nn = _nftsListFromCache(_chainId, _collection, _account);
        console.log("const_nftsList= ~ nfts", nn);

        // REFRESH LIB WHEN NFT count found in cache not good
        fromLib = nn !== collectionObject.balanceOf;
      }

      if (fromLib) {
        // LOAD NFTs from lib
        await _nftsListFromLib(_chainId, _collection, _account);
      }
      refresh = !refresh;
    }
    console.log("_nftsList allNFTs", _chainId, _collection, _account, allNFTs, NFTs);
  };

  const _nftsListFromCache = (_chainId: number, _collection: string, _account: string): number => {
    allNFTs = nftListFromCache(_chainId, _collection, _account);
    console.log("_nftsListFromCache allNFTs", allNFTs);

    NFTs = new Map(
      [...allNFTs].filter(
        ([, nft]) => nft.chainId === _chainId && nft.collection === _collection && nft.owner === _account
      )
    );
    refresh = !refresh;

    console.log("_nftsListFromCache", NFTs?.size, NFTs);
    return NFTs?.size;
  };

  const _nftsListFromLib = async (_chainId: number, _collection: string, _account: string) => {
    if (_chainId && _collection && _account) {
      console.log("_nftsListFromLib", _chainId, _collection, account);

      collectionObject = collectionGetFromCache(_chainId, _collection);
      console.log("_nftsListFromLib ~ collectionObject", collectionObject);

      cacheClear(_chainId, _collection);

      mores = [];
      NFTs = new Map();

      console.log("_nftsListFromLib", _chainId, _collection, _account, collectionObject);

      if (collectionObject.supports) {
        refreshing = true;

        if (collectionObject.supports.IERC721Enumerable) {
          const nNFTs = collectionObject.balanceOf;
          console.log("_nftsListFromLib= Enumerable ~ nNFTs", nNFTs);

          for (numNFT = 0; numNFT < nNFTs; numNFT++) {
            const nftIndex = await nftGetFromContractEnumerable(
              _chainId,
              collectionObject,
              numNFT,
              $metamaskProvider,
              _account
            );
            const nft = await nftGetMetadata(nftIndex);
            if (nft?.nid) NFTs.set(nft.nid, nft);
            NFTs = NFTs; // needed in Svelte for Map reactivity !
          }
        } else {
          const nftsTokenIds = await nftListTokenIds(_chainId, collectionObject, $metamaskProvider, _account);
          console.log("_nftsListFromLib= nbTokenIds ~ nNFTs", nftsTokenIds.size);

          nftsTokenIds.forEach(async (nftTokenId) => {
            const nft = await nftGetMetadata(nftTokenId);
            if (nft?.nid) NFTs.set(nft.nid, nft);
            NFTs = NFTs; // needed in Svelte for Map reactivity !
          });
        }

        refreshing = false;
        // console.log("_nftsListFromLib OUT =>", NFTs?.size, NFTs);
      } else {
        console.error("_nftsListFromLib Collection not ready", _collection);
      }
      refresh = !refresh;
      console.log("_nftsListFromLib ~ NFTs", NFTs);
    }
  };
</script>

{#if NFTs?.size > 0}
  <h2>
    Collection {collectionName(collectionObject)}
  </h2>
  {nbNFTs}/{nftsBalanceAndName(collectionObject)}
  <a
    class="info-button"
    href={explorerCollectionUrl(chainId, collection)}
    title="&#009;Collection address (click to view in explorer)&#013;
      {nftsUrl(chainId, collection)}"
    target="_blank"><i class="fas fa-info-circle" /></a
  >

  <div class="table">
    <div class="table-row table-head hidden-xs">
      <div class="table-col"><span class="label">Media</span></div>
      {#if getNetwork(chainId)?.openSea}
        <div class="table-col"><span class="label">Marketplace</span></div>
      {:else}
        <div class="table-col"><span class="label">Infos</span></div>
      {/if}
    </div>
    {#each [...NFTs.values()] as nft, index}
      <!-- <NftGet chainId={nft.chainId} collection={nft.collection} tokenID={nft.tokenID} /> -->
      <Nft {nft} {account} />
      <!-- <Nft {nft} {account} {index} {platform} more={tokenID == nft.tokenID ? -1 : mores[index]} /> -->
    {/each}
  </div>
{:else}
  <div class="card-krd">
    <p>No NFTs ✌️</p>
  </div>
{/if}

<div>
  <small>{platform}</small>
</div>
