import { get, writable } from "svelte/store";

import type { Collection as CollectionType } from "lib/ktypes";
import { collectionList as collectionListLib } from "lib/kcollection-list";

import { metamaskProvider } from "main/metamask";

import { collectionStore } from "stores/collection";
import { collectionListGetStore } from "stores/collectionListGet";
import { jsonMapParse } from "helpers/jsonMap";

// UTILITIES
const collectionListGetKey = (chainId: number, address: string): string => `collection://${String(chainId)}/${address}`;

// LOADER : load Collections from localStorage
const collectionListLoadLocalStorage = (): Map<string, CollectionType> => {
  const collections: Map<string, CollectionType> = new Map();

  for (let index = 0; index < localStorage.length; index++) {
    const key = localStorage.key(index);

    if (key?.startsWith("collection://")) {
      collections.set(key, jsonMapParse(localStorage.getItem(key) || "") as CollectionType);
    }
  }
  return collections;
};

// STATE : Collection List : Map with key is chainId/collectionAddress and value is collectionObject
const { subscribe, set, update } = writable(collectionListLoadLocalStorage());

// ACTIONS : SET all Collections from one nework, from an optional account
const collectionListRefresh = async (chainId: number, account?: string): Promise<void> => {
  if (!chainId) return;

  const collectionListFromLib = await collectionListLib(chainId, account, get(metamaskProvider));
  for (const collectionObject of collectionListFromLib.values()) {
    collectionStore.updateOne(collectionObject);
  }
};

export const collectionListStore = {
  subscribe,
  set,
  update,
  getSubList: collectionListGetStore,
  getKey: collectionListGetKey,
  refresh: collectionListRefresh
};

// if (typeof localStorage !== "undefined") {
//   for (const [, collection] of collections) {
//     // Get supported interfaces on specific collections
//     if (metadata) {
//       if (collection.owner == account || (collection?.balancesOf?.get(account) || 0) > 0) {
//         const supported = await collectionGetMetadata(chainId, collection.address, provider, account);
//         Object.assign(collection, supported);
//       }
//     }
//     // storeCollectionSet(collection, account);
//   }
// }
