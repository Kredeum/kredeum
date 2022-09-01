import type { Provider } from "@ethersproject/abstract-provider";

import type { CollectionType } from "@lib/ktypes";
import { getNetwork } from "@lib/kconfig";
import { collectionMerge } from "@lib/kcollection-get";

import { alchemyGet, alchemyCollectionList } from "@lib/apis/api-alchemy";
import { covalentGet, covalentCollectionList } from "@lib/apis/api-covalent";
import { thegraphGet, thegraphCollectionList } from "@lib/apis/api-thegraph";
import { moralisGet, moralisCollectionList } from "@lib/apis/api-moralis";
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
  provider: Provider,
  account?: string,
  mintable?: boolean
): Promise<Map<string, CollectionType>> => {
  // console.log(`collectionList ${collectionListKey(chainId, account)}\n`);

  let collections: Map<string, CollectionType> = new Map();

  const network = getNetwork(chainId);
  if (network && account) {
    let collectionsApi: Map<string, CollectionType> = new Map();
    let collectionsResolver: Map<string, CollectionType> = new Map();

    // GET user collections
    if (alchemyGet(chainId)) {
      collectionsApi = await alchemyCollectionList(chainId, account);
      // console.log("collectionList alchemyCollectionList", collectionsApi);
    } else if (thegraphGet(chainId)) {
      collectionsApi = await thegraphCollectionList(chainId, account);
      // console.log("collectionList thegraphCollectionList", collectionsApi);
    } else if (moralisGet(chainId)) {
      collectionsApi = await moralisCollectionList(chainId, account);
      // console.log("collectionList moralisCollectionList", collectionsApi);
    } else if (covalentGet(chainId)) {
      collectionsApi = await covalentCollectionList(chainId, account);
      // console.log("collectionList covalentCollectionList", collectionsApi);
    }

    const lengthBefore = collectionsApi.size;
    // console.log("collectionsApi  BEFORE", collectionsApi);
    collectionsApi = await resolverFilterCollections(chainId, collectionsApi, provider);
    // console.log("collectionsApi   AFTER", collectionsApi);
    const removed = lengthBefore - collectionsApi.size;
    if (removed > 0 ) console.info("collectionList collectionsApi removed", removed);

    collectionsResolver = await resolverGetCollectionList(chainId, provider, account);
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

  // console.log(`collectionList ${collectionListKey(chainId, account)}\n`, collections);
  return collections;
};

const collectionListKey = (chainId: number, account?: string, mintable = false): string =>
  `collectionList${mintable ? "Mintable" : ""}://${String(chainId)}${account ? "@" + account : ""}`;


export { collectionList, collectionListMerge,collectionListKey };
