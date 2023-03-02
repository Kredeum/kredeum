import type { Readable } from "svelte/store";
import { get, derived } from "svelte/store";

import type { CollectionFilterType, NftType } from "@lib/common/types";
import { resolverGetNfts as nftListLib, resolverGetNft as nftLib } from "@lib/resolver/resolver-get-nft";
import { nftGetMetadata } from "@lib/nft/nft-get-metadata";
import { nftListTokenIds } from "@lib/nft/nft-list";

import { collectionStore } from "@stores/collection/collection";
import { collectionListStore } from "@stores/collection/collectionList";

import { nftStore } from "./nft";
import { keyNftList } from "@lib/common/keys";

import { constants } from "ethers";

// STATE VIEW : GET Collection filtered list of NFTs
const nftSubListStore = (
  chainId: number,
  address: string,
  filter?: CollectionFilterType
): Readable<Map<string, NftType>> => {
  // console.log(`nftSubListStore ${keyNftList(chainId, address)}\n`);
  // console.log(`nftSubListStore ${JSON.stringify(filter, null, 2)}\n`);

  return derived(nftStore.getList, ($nftListStore) => {
    let nftsMap = new Map() as Map<string, NftType>;
    if (!(chainId && address && address != constants.AddressZero)) return nftsMap;

    const nfts = [...$nftListStore].filter(([, nft]) => {
      // const okParams = chainId > 0;
      const okParams = chainId > 0 && Boolean(address);

      // NETWORK
      const okNetwork = nft.chainId === chainId;

      // ADDRESS
      const okAddress = nft.address === address;

      // OWNER
      const okOwner = filter.owner && nft.owner === filter.owner;

      // TOKENID
      const okTokenIDs = Array.isArray(filter.tokenIDs) && filter.tokenIDs.includes(nft.tokenID);

      // FILTER
      const okFilter = okOwner || okTokenIDs;

      const ok = okParams && okNetwork && okAddress && okFilter;

      return ok;
    });

    const offset = filter?.offset || 0;
    if (offset >= nfts.length) return nftsMap;

    let limit = filter?.limit || 6;
    if (offset + limit > nfts.length) limit = nfts.length - offset;

    nftsMap = new Map(nfts.slice(offset, limit));
    // console.log("nftSubListStore nfts", nftsMap);
    return nftsMap;
  });
};

// ACTIONS : REFRESH all filtered NFTs from one collection
const nftSubListRefresh = async (chainId: number, address: string, filter?: CollectionFilterType): Promise<void> => {
  if (!(chainId && address && address != constants.AddressZero)) return;
  // console.log(`nftSubListRefresh ${keyNftList(chainId, address)}\n`);
  // console.log(`nftSubListRefresh ${JSON.stringify(filter, null, 2)}\n`);

  const key = collectionStore.getKey(chainId, address);

  const $collectionList = get(collectionListStore);
  let collection = $collectionList.get(key);

  if (!collection?.supports) {
    await collectionStore.refreshOne(chainId, address);
    collection = $collectionList.get(key);
  }

  let nfts: Map<string, NftType>;
  if (collection?.supports?.IERC721Enumerable) {
    ({ nfts } = await nftListLib(chainId, collection, filter));
  } else {
    nfts = await nftListTokenIds(chainId, collection, filter);
  }

  for (const [, nft] of nfts) nftStore.setOne(await nftGetMetadata(nft));

  // add targeted tokenIDs if not in list
  if (Array.isArray(filter?.tokenIDs)) {
    for (const tokenID of filter.tokenIDs) {
      if (!nfts.has(nftStore.getKey(chainId, address, tokenID))) {
        const nft = await nftLib(chainId, collection, tokenID);
        nftStore.setOne(await nftGetMetadata(nft));
      }
    }
  }
};

const nftSubListGetStoreAndRefresh = (
  chainId: number,
  address: string,
  filter?: CollectionFilterType
): Readable<Map<string, NftType>> => {
  if (!(chainId && address && address != constants.AddressZero)) return;

  // STATE VIEW : sync read cache
  const nfts = nftSubListStore(chainId, address, filter);

  // ACTION : async refresh from lib onchain data
  nftSubListRefresh(chainId, address, filter).catch(console.error);

  return nfts;
};

export { nftSubListStore, nftSubListRefresh, nftSubListGetStoreAndRefresh };
