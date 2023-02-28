import type { CollectionType } from "@lib/common/types";
import { getNetwork } from "@lib/common/config";
import { collectionMerge } from "@lib/collection/collection-get";

import { alchemyActive, alchemyCollectionList } from "@lib/apis/api-alchemy";
import { covalentActive, covalentCollectionList } from "@lib/apis/api-covalent";
import { thegraphActive, thegraphCollectionList } from "@lib/apis/api-thegraph";
import { moralisActive, moralisCollectionList } from "@lib/apis/api-moralis";
import { resolverFilterCollections, resolverGetCollectionList } from "@lib/resolver/resolver-get-collection";

// Merge 2 collections list into 1
const collectionListMerge = (
  colList1: Map<string, CollectionType>,
  colList2: Map<string, CollectionType>
): Map<string, CollectionType> => {
  const collList = colList2;
  if (colList1) {
    for (const [key, coll1] of colList1.entries()) {
      // console.log(key, coll1);
      const coll2 = colList2.get(key);
      if (coll2) {
        const mergedColl = collectionMerge(coll1, coll2);
        colList2.set(key, mergedColl);
      } else {
        colList2.set(key, coll1);
      }
    }
  }
  return collList;
};

const collectionList = async (
  chainId: number,
  account?: string,
  mintable?: boolean
): Promise<Map<string, CollectionType>> => {
  // console.log(`collectionList ${keyCollectionList(chainId, account)}\n`);

  let collections: Map<string, CollectionType> = new Map();

  const network = getNetwork(chainId);
  if (network && account) {
    let collectionsApi: Map<string, CollectionType> = new Map();
    let collectionsResolver: Map<string, CollectionType> = new Map();

    // GET user collections
    if (alchemyActive(chainId)) {
      collectionsApi = await alchemyCollectionList(chainId, account);
      // console.log("collectionList alchemyCollectionList", collectionsApi);
    } else if (thegraphActive(chainId)) {
      collectionsApi = await thegraphCollectionList(chainId, account);
      // console.log("collectionList thegraphCollectionList", collectionsApi);
    } else if (moralisActive(chainId)) {
      collectionsApi = await moralisCollectionList(chainId, account);
      // console.log("collectionList moralisCollectionList", collectionsApi);
    } else if (covalentActive(chainId)) {
      collectionsApi = await covalentCollectionList(chainId, account);
      // console.log("collectionList covalentCollectionList", collectionsApi);
    }

    const lengthBefore = collectionsApi.size;
    // console.log("collectionsApi  BEFORE", collectionsApi);
    collectionsApi = await resolverFilterCollections(chainId, collectionsApi);
    // console.log("collectionsApi   AFTER", collectionsApi);
    const removed = lengthBefore - collectionsApi.size;
    if (removed > 0) console.info("collectionList collectionsApi removed", removed);

    collectionsResolver = await resolverGetCollectionList(chainId, account);
    // console.log("collectionList collectionsResolver", collectionsResolver);

    // MERGE collectionsApi and collectionsResolver
    collections = collectionListMerge(collectionsApi, collectionsResolver);
    // console.log("collectionList merge", collections);
  }

  if (mintable) {
    // filter mintable collection
    collections = new Map(
      [...collections].filter(([, coll]) => coll.open || (coll.owner === account && (coll.version || 0) >= 3))
    );
  }

  // console.log(`collectionList ${keyCollectionList(chainId, account)}\n`, collections);
  return collections;
};

export { collectionList, collectionListMerge };
