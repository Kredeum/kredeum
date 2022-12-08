import type { Readable } from "svelte/store";
import { get, derived } from "svelte/store";

import type { NftType } from "@lib/common/types";
import { resolverGetNfts } from "@lib/resolver/resolver-get-nft";
import { nftGetMetadata } from "@lib/nft/nft-get-metadata";
import { nftListTokenIds } from "@lib/nft/nft-list";

import { collectionStore } from "@stores/collection/collection";
import { collectionListStore } from "@stores/collection/collectionList";

import { nftStore } from "./nft";

// ACTIONS : REFRESH all NFTs from one collection for an account
const nftSubListRefresh = async (chainId: number, address: string, account: string): Promise<void> => {
  if (!(chainId && address)) return;
  // console.log("nftSubListRefresh", chainId, address, account);

  const key = collectionStore.getKey(chainId, address);
  const $collectionList = get(collectionListStore);
  let collection = $collectionList.get(key);

  if (!collection?.supports) {
    await collectionStore.refreshOne(chainId, address);
    collection = $collectionList.get(key);
  }

  if (collection?.supports?.IERC721Enumerable) {
    const { nfts } = await resolverGetNfts(chainId, collection, account);
    // console.log("nftSubListRefresh Enumerable ~ nNFTs", Number(count));

    for (const [, nft] of nfts) nftStore.setOne(await nftGetMetadata(nft));
  } else {
    const nftsTokenIds = await nftListTokenIds(chainId, collection.address, collection, account);
    // console.log("nftSubListRefresh nbTokenIds ~ nNFTs", nftsTokenIds.size);

    for await (const _nft of nftsTokenIds.values()) {
      nftStore.setOne(await nftGetMetadata(_nft));
    }
  }
};

// STATE VIEW : GET Collection fitered list
const nftSubListStore = (chainId: number, address: string, account?: string): Readable<Map<string, NftType>> =>
  derived(nftStore.getListStore, ($nftListStore) => {
    if (!(chainId && address)) return new Map() as Map<string, NftType>;

    return new Map(
      [...$nftListStore].filter(
        ([, nft]) => nft.chainId === chainId && nft.address === address && nft.owner === account
      )
    );
  });

export { nftSubListStore, nftSubListRefresh };
