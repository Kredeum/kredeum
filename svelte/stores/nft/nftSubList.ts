import type { Readable } from "svelte/store";
import { get, derived } from "svelte/store";

import type { CollectionFilterType, NftType } from "@lib/common/types";
import { resolverGetNfts as nftListLib } from "@lib/resolver/resolver-get-nft";
import { nftGetMetadata } from "@lib/nft/nft-get-metadata";
import { nftListTokenIds } from "@lib/nft/nft-list";

import { collectionStoreRefresh } from "@stores/collection/collection";
import { collectionListStore } from "@stores/collection/collectionList";

import { nftStoreSet } from "./nft";

import { constants } from "ethers";
import { isAddressNotZero, tokenIdSelected, tokenIdSplit, PAGE_SIZE } from "@lib/common/config";
import { nftGet } from "@lib/nft/nft-get";
import { keyCollection, keyNft } from "@lib/common/keys";
import { nftListStore } from "./nftList";

// STATE VIEW : GET Collection filtered list of NFTs
const nftSubListStore = (
  chainId: number,
  address: string,
  filter?: CollectionFilterType
): Readable<Map<string, NftType>> => {
  // console.log(`nftSubListStore ${keyCollection(chainId, address)}\n`);
  // console.log(`nftSubListStore ${JSON.stringify(filter, null, 2)}\n`);

  return derived(nftListStore, ($nftListStore) => {
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
      const okOwner = !filter.owner || nft.owner === filter.owner;

      // TOKENID
      const okTokenID = tokenIdSelected(filter.tokenID, nft.tokenID);

      const ok = okParams && okNetwork && okAddress && okOwner && okTokenID;

      return ok;
    });

    const offset = filter?.offset || 0;
    if (offset >= nfts.length) return nftsMap;

    let limit = filter?.limit || PAGE_SIZE;
    if (offset + limit > nfts.length) limit = nfts.length - offset;

    nftsMap = new Map(nfts.slice(offset, limit));
    // console.log("nftSubListStore nfts", nftsMap);
    return nftsMap;
  });
};

// ACTIONS : REFRESH all filtered NFTs from one collection
const nftSubListStoreRefresh = async (
  chainId: number,
  address: string,
  filter: CollectionFilterType = {}
): Promise<void> => {
  if (!(chainId && isAddressNotZero(address))) return;
  // console.log(`nftSubListStoreRefresh ${keyCollection(chainId, address)}\n`);
  // console.log(`nftSubListStoreRefresh ${JSON.stringify(filter, null, 2)}\n`);

  const key = keyCollection(chainId, address);

  const $collectionList = get(collectionListStore);
  let collection = $collectionList.get(key);

  if (!collection?.supports) {
    await collectionStoreRefresh(chainId, address);
    collection = $collectionList.get(key);
  }

  let nfts: Map<string, NftType>;
  if (collection?.supports?.get("IERC721Enumerable")) {
    ({ nfts } = await nftListLib(chainId, collection, filter));
  } else {
    nfts = await nftListTokenIds(chainId, collection, filter);
  }

  // add targeted tokenID if not in list
  if (filter.tokenID != "") {
    for (const tokenID of tokenIdSplit(filter.tokenID)) {
      const nftKey = keyNft(chainId, address, tokenID);
      // console.log("nftSubListStoreRefresh tokenID", tokenID);
      if (!nfts.has(nftKey)) nfts.set(nftKey, await nftGet(chainId, address, tokenID, collection));
    }
  } // else search all tokenID !

  for (const [, nft] of nfts) nftStoreSet(await nftGetMetadata(nft));
};

const nftSubListStoreAndRefresh = (
  chainId: number,
  address: string,
  filter?: CollectionFilterType
): Readable<Map<string, NftType>> => {
  if (!(chainId && address && address != constants.AddressZero)) return;

  // STATE VIEW : sync read cache
  const nfts = nftSubListStore(chainId, address, filter);

  // ACTION : async refresh from lib onchain data
  nftSubListStoreRefresh(chainId, address, filter).catch(console.error);

  return nfts;
};

export { nftSubListStore, nftSubListStoreRefresh, nftSubListStoreAndRefresh };
