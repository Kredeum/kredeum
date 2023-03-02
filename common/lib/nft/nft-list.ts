import type { CollectionFilterType, CollectionType, NftType } from "@lib/common/types";

import { nftGetMetadata } from "@lib/nft/nft-get-metadata";
import { resolverGetNfts } from "@lib/resolver/resolver-get-nft";

import { alchemyActive, alchemyNftList } from "@lib/apis/api-alchemy";
import { covalentActive, covalentNftList } from "@lib/apis/api-covalent";
import { thegraphActive, thegraphNftList } from "@lib/apis/api-thegraph";
import { moralisActive, moralisNftList } from "@lib/apis/api-moralis";

import { getNetwork } from "@lib/common/config";
import { FETCH_LIMIT } from "@lib/common/fetch";

// Merge 2 nfts list into 1
const nftsMerge = (nftList1: Map<string, NftType>, nftList2: Map<string, NftType>): Map<string, NftType> => {
  const nftList = nftList2;
  if (nftList1) {
    for (const [key, value1] of nftList1.entries()) {
      // console.log(key, value1);
      if (!nftList2.get(key)) {
        nftList2.set(key, value1);
      }
    }
  }
  return nftList;
};

const nftListTokenIds = async (
  chainId: number,
  collection: CollectionType,
  filter: CollectionFilterType = {}
): Promise<Map<string, NftType>> => {
  let nfts: Map<string, NftType> = new Map();
  let nftsOwner: Map<string, NftType> = new Map();
  let nftsKredeum: Map<string, NftType> = new Map();
  const network = getNetwork(chainId);

  if (network) {
    if (alchemyActive(chainId)) {
      nftsOwner = await alchemyNftList(chainId, collection, filter);
    } else if (thegraphActive(chainId)) {
      nftsOwner = await thegraphNftList(chainId, collection, filter);
    } else if (covalentActive(chainId)) {
      nftsOwner = await covalentNftList(chainId, collection, filter);
    } else if (moralisActive(chainId)) {
      nftsOwner = await moralisNftList(chainId, collection, filter);
    } else {
      console.error("No NFTs found:-(");
    }

    ({ nfts: nftsKredeum } = await resolverGetNfts(chainId, collection, filter));
  }
  // console.log("nftListTokenIds", nfts);

  // MERGE nftsOwner and nftsKredeum
  nfts = nftsMerge(nftsOwner, nftsKredeum);

  return nfts;
};

const _nftListWithMetadata = async (
  nfts: Map<string, NftType>,
  filter: CollectionFilterType = {}
): Promise<Map<string, NftType>> => {
  const limit = filter.limit || FETCH_LIMIT;
  // console.log("_nftListWithMetadata", chainId, collection);

  const nftsWithMetadata: Map<string, NftType> = new Map();
  const nftsFromIds = [...nfts.values()];

  let index = 0;
  for (const nftFromIds of nftsFromIds) {
    if (index++ >= limit) break;

    const nft = await nftGetMetadata(nftFromIds);

    if (nft) nftsWithMetadata.set(nft.nid || "", nft);
  }
  
  // console.log(`_nftListWithMetadata from ${collection}`, nftsWithMetadata);
  return nftsWithMetadata;
};

// const nftListCache = (chainId?: number, collection?: string, account?: string): Map<string, NftType> =>
//   storeNfts(chainId, collection, account);

const nftList = async (
  chainId: number,
  collection: CollectionType,
  filter: CollectionFilterType = {}
): Promise<Map<string, NftType>> => {
  // console.log("nftList", chainId, collection, account, limit);

  const nftsTokenIds: Map<string, NftType> = await nftListTokenIds(chainId, collection, filter);
  const nftsWithMetadata: Map<string, NftType> = await _nftListWithMetadata(nftsTokenIds, filter);

  // console.log("nftList", nftsWithMetadata);

  return nftsWithMetadata;
};

export {
  nftList,
  nftListTokenIds,
  moralisNftList as nftListMoralis,
  alchemyNftList as nftListAlcheme,
  thegraphNftList as nftListThegraph,
  covalentNftList as nftListCovalent
};
