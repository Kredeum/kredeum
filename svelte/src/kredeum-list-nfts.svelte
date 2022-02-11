<script lang="ts">
  import type { Collection, Network, Nft } from "lib/ktypes";
  import type { Provider } from "@ethersproject/abstract-provider";
  import KredeumGetNft from "./kredeum-get-nft.svelte";

  import { collectionName, explorerCollectionUrl, nftsBalanceAndName, nftsUrl } from "lib/kconfig";
  import { chainId, network, provider, owner } from "./network";
  import { clearCache, nftListFromCache, nftListTokenIds } from "lib/knft-list";
  import { nftGetFromContractEnumerable, nftGetMetadata, nftGetImageLink } from "lib/knft-get";

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

  // Track NFTs div offsetHeight with "more" details
  let mores: Array<number> = [];

  // ON OWNER OR COLLECTION CHANGE
  $: {
    if ($owner && collection) {
      // chainId.set(collection?.chainId);
      refreshNFTs();
    }
  }

  export const refreshNFTs = async (force = false) => {
    // console.log("refreshNFTS", force, collection);

    if ($network && collection && $owner) {
      let refreshLib: boolean;

      if (force) {
        refreshLib = true;
      } else {
        // LOAD NFTs from cache
        const nbNFTs = refreshNFTsFromCache($chainId, collection, $owner);

        // REFRESH LIB WHEN NFT count found in cache not good
        refreshLib = nbNFTs !== collection.balanceOf;
      }

      // LOAD NFTs from lib
      if (refreshLib) {
        clearCache($chainId, collection.address);
        mores = [];
        NFTs = new Map();
        refreshNFTsFromLib($chainId, collection, $provider, $owner);
      }
    }
  };

  const refreshNFTsFromCache = (_chainId: number, _collection: Collection, _owner: string): number => {
    allNFTs = nftListFromCache();
    // console.log("allNFTs", allNFTs);

    NFTs = new Map([...allNFTs].filter(([, nft]) => nft.chainId === $chainId && nft.collection === collection.address && nft.owner === $owner));

    // console.log("refreshNFTsFromCache =>", NFTs?.size, NFTs);
    return NFTs?.size;
  };

  const unchanged = async (_chainId: number, _collection: Collection): Promise<boolean> => {
    // chainId and collection have not changed while loading NFTs
    return $chainId === _chainId && collection?.address === _collection.address;
  };

  const refreshNFTsFromLib = async (_chainId: number, _collection: Collection, _provider: Provider, _owner: string) => {
    console.log("refreshNFTsFromLib", _chainId, _owner, _collection);

    if (_collection.supports) {
      const nbNFTs = _collection.balanceOf || _collection.totalSupply;
      // console.log("refreshNFTsFromLib nbNFTs", nbNFTs);

      refreshing = true;

      if (_collection.supports.ERC721Enumerable) {
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
      console.log("refreshNFTsFromLib OUT =>", NFTs?.size, NFTs);
    } else {
      console.error("refreshNFTsFromLib Collection not ready", _collection);
    }
  };
</script>

{#key $owner && numNFT && NFTs}
  {#if NFTs && collection?.balanceOf > 0}
    <h2>
      Collection {collectionName(collection)}
    </h2>
    {nftsBalanceAndName(collection)}
    <a
      class="info-button"
      href="{explorerCollectionUrl($chainId, collection?.address)}"
      title="&#009;Collection address (click to view in explorer)&#013;
      {nftsUrl($chainId, collection?.address)}"
      target="_blank"><i class="fas fa-info-circle"></i></a>

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
        <KredeumGetNft nft="{nft}" index="{index}" platform="{platform}" more="{mores[index]}" />
      {/each}
    </div>
  {:else}
    <div class="card-krd">
      <p>No NFTs ✌️</p>
    </div>
  {/if}
{/key}
