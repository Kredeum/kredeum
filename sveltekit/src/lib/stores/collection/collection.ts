import type { Readable } from "svelte/store";
import { derived } from "svelte/store";
import { ADDRESS_ZERO } from "@kredeum/common/lib/common/config";
import type { CollectionType } from "@kredeum/common/lib/common/types";
import { collectionMerge, collectionGet as collectionLib } from "@kredeum/common/lib/collection/collection-get";

import { jsonMapStringify } from "@kredeum/sveltekit/src/lib/helpers/jsonMap";
import { collectionListStore } from "@kredeum/sveltekit/src/lib/stores/collection/collectionList";

import { keyCollection } from "@kredeum/common/lib/common/keys";
import { localStorageSet } from "@kredeum/common/lib/common/local";

// STATE CHANGER : SET one Collection
const collectionStoreSet = (collection: CollectionType): void => {
  const { chainId, address } = collection || {};
  if (!(chainId && address && address != ADDRESS_ZERO)) return;

  collectionListStore.update(($collectionList: Map<string, CollectionType>): Map<string, CollectionType> => {
    const key = keyCollection(chainId, address);
    const oldColl = $collectionList.get(key);
    const newColl = oldColl ? collectionMerge(oldColl, collection) : collection;

    localStorageSet(key, jsonMapStringify(newColl));

    // console.log(`collectionStoreSet ${key}`, collection);
    return $collectionList.set(key, newColl);
  });
};

// ACTIONS : REFRESH one Collection, for an optionnal account
const collectionStoreRefresh = async (chainId: number, address: string, account = ADDRESS_ZERO): Promise<void> => {
  // console.log(`collectionStoreRefresh '${chainId}' '${address}' '${account}'`);

  if (!(chainId && address)) return;
  const collection = await collectionLib(chainId, address, account);

  collectionStoreSet(collection);
};

// TODO : add account param, to get balanceOf account, each time
// STATE VIEW : GET one Collection
const collectionStore = (chainId: number, address: string): Readable<CollectionType> => {
  const key = keyCollection(chainId, address);
  // console.log(`collectionStore ${key}`);

  return derived(
    collectionListStore,
    ($collectionListStore) => $collectionListStore.get(key) || (new Map() as unknown as CollectionType)
  );
};

const collectionStoreAndRefresh = (chainId: number, address: string): Readable<CollectionType> => {
  // STATE VIEW : sync read cache
  const collection = collectionStore(chainId, address);

  // ACTION : async refresh from lib onchain data
  collectionStoreRefresh(chainId, address).catch(console.error);

  return collection;
};

export { collectionStore, collectionStoreRefresh, collectionStoreAndRefresh, collectionStoreSet };
