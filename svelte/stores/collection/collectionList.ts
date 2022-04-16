import { writable } from "svelte/store";

import type { CollectionType } from "lib/ktypes";

import { jsonMapParse } from "helpers/jsonMap";

// LOADER : LOAD Collections from localStorage
const collectionListLoadLocalStorage = (): Map<string, CollectionType> => {
  const collections: Map<string, CollectionType> = new Map();

  for (let index = 0; index < localStorage.length; index++) {
    const key = localStorage.key(index);

    if (key?.startsWith("collection://")) {
      collections.set(key, jsonMapParse(localStorage.getItem(key) || "") as CollectionType);
    }
  }
  console.log("collectionListLoadLocalStorage", collections);
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
