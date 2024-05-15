import { writable } from "svelte/store";

import type { CollectionType } from "@kredeum/common/src/common/types";

import { jsonMapParse } from "../../helpers/jsonMap";
import { localStorageGet, localStorageKeys } from "@kredeum/common/src/common/local";

// LOADER : LOAD Collections from localStorage
const collectionListLoadLocalStorage = (): Map<string, CollectionType> => {
  const collections: Map<string, CollectionType> = new Map();

  localStorageKeys("collection://").map((key) =>
    collections.set(key, jsonMapParse(localStorageGet(key) || "") as CollectionType)
  );

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
