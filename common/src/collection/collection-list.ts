import type { CollectionType } from "../common/types";

import { collectionMerge } from "../collection/collection-get";

import { alchemyActive, alchemyCollections } from "../apis/api-alchemy";
import { covalentActive, covalentCollections } from "../apis/api-covalent";
import { thegraphActive, thegraphCollections } from "../apis/api-thegraph";
import { resolverFilterCollections, resolverGetCollections } from "../resolver/resolver-get-collection";
import { networks } from "../common/networks";
// import { infuraActive, infuraCollections } from "../apis/api-infura";

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
  // console.log(`collectionList ${keyCollections(chainId, account)}\n`);

  let collections: Map<string, CollectionType> = new Map();

  const network = networks.get(chainId);
  if (network && account) {
    let collectionsApi: Map<string, CollectionType> = new Map();
    let collectionsResolver: Map<string, CollectionType> = new Map();

    // GET user collections
    if (alchemyActive(chainId)) {
      collectionsApi = await alchemyCollections(chainId, account);
      // console.log("collectionList alchemyCollections", collectionsApi);
    } else if (thegraphActive(chainId)) {
      collectionsApi = await thegraphCollections(chainId, account);
      // console.log("collectionList thegraphCollections", collectionsApi);
    } else if (covalentActive(chainId)) {
      collectionsApi = await covalentCollections(chainId, account);
      // console.log("collectionList covalentCollections", collectionsApi);
    }
    // else if (infuraActive(chainId)) {
    //   collectionsApi = await infuraCollections(chainId, account);
    //   // console.log("collectionList infuraCollections", collectionsApi);
    // }

    const lengthBefore = collectionsApi.size;
    // console.log("collectionsApi  BEFORE", collectionsApi);
    collectionsApi = await resolverFilterCollections(chainId, collectionsApi);
    // console.log("collectionsApi   AFTER", collectionsApi);
    const removed = lengthBefore - collectionsApi.size;
    if (removed > 0) console.info("collectionList collectionsApi removed", removed);

    collectionsResolver = await resolverGetCollections(chainId, account);
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

  // console.log(`collectionList ${keyCollections(chainId, account)}\n`, collections);
  return collections;
};

export { collectionList, collectionListMerge };
