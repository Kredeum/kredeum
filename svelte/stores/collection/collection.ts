import type { Readable } from "svelte/store";
import { derived } from "svelte/store";
import { constants } from "ethers";

import type { CollectionType } from "@lib/common/types";
import { collectionMerge, collectionGet as collectionLib } from "@lib/collection/collection-get";

import { jsonMapStringify } from "@helpers/jsonMap";
import { collectionListStore } from "@stores/collection/collectionList";

import { keyCollection } from "@lib/common/keys";

// STATE CHANGER : SET one Collection
const collectionStoreSet = (collection: CollectionType): void => {
  const { chainId, address } = collection || {};
  if (!(chainId && address && address != constants.AddressZero)) return;

  collectionListStore.update(($collectionList: Map<string, CollectionType>): Map<string, CollectionType> => {
    const key = keyCollection(chainId, address);
    const newColl = collectionMerge($collectionList.get(key), collection);

    if (typeof localStorage !== "undefined") {
      localStorage.setItem(key, jsonMapStringify(newColl));
    }
    // console.log(`collectionStoreSet ${key}`, collection);
    return $collectionList.set(key, newColl);
  });
};

// ACTIONS : REFRESH one Collection, for an optionnal account
const collectionStoreRefresh = async (
  chainId: number,
  address: string,
  account = constants.AddressZero
): Promise<void> => {
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

  return derived(collectionListStore, ($collectionListStore) => $collectionListStore.get(key));
};

const collectionStoreAndRefresh = (chainId: number, address: string): Readable<CollectionType> => {
  if (!(chainId && address && address != constants.AddressZero)) return;

  // STATE VIEW : sync read cache
  const collection = collectionStore(chainId, address);

  // ACTION : async refresh from lib onchain data
  collectionStoreRefresh(chainId, address).catch(console.error);

  return collection;
};

export { collectionStore, collectionStoreRefresh, collectionStoreAndRefresh, collectionStoreSet };
