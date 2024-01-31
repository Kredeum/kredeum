import { writable } from "svelte/store";

import type { CollectionType } from "@kredeum/common/lib/common/types";

import { jsonMapParse } from "@kredeum/sveltekit/src/lib/helpers/jsonMap";
import { localStorageGet, localStorageKey, localStorageLength } from "@kredeum/common/lib/common/local";

// LOADER : LOAD Collections from localStorage
const collectionListLoadLocalStorage = (): Map<string, CollectionType> => {
  const collections: Map<string, CollectionType> = new Map();

  const len = localStorageLength();
  for (let index = 0; index < len; index++) {
    const key = localStorageKey(index);

    if (key?.startsWith("collection://")) {
      collections.set(key, jsonMapParse(localStorageGet(key) || "") as CollectionType);
    }
  }
  // console.log("collectionListLoadLocalStorage", collections);
  return collections;
};

// STATE : Collection List : Map with key is chainId/collectionAddress and value is collectionObject
const { subscribe, set, update } = writable(collectionListLoadLocalStorage());

const collectionListStore = {
  subscribe,
  set,
  update
};

export { collectionListStore };
