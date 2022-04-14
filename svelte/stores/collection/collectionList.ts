import { get, writable } from "svelte/store";

import type { CollectionType } from "lib/ktypes";
import { collectionList as collectionListLib } from "lib/kcollection-list";

import { metamaskProvider } from "main/metamask";

import { collectionStore } from "stores/collection/collection";
import { collectionListGetStore } from "stores/collection/collectionListGet";
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

// ACTIONS : Refresh all Collections from one nework, from an optional account
const collectionListRefresh = async (chainId: number, account?: string, mintable = false): Promise<void> => {
  if (!chainId) return;

  const collectionListFromLib = await collectionListLib(chainId, account, get(metamaskProvider), mintable);
  for (const collectionObject of collectionListFromLib.values()) {
    collectionStore.setOne(collectionObject);
  }
  console.log(
    `collectionListRefresh collection://${chainId}${account ? "@" + account : ""} ${String(mintable)}\n`,
    collectionListFromLib
  );
};

export const collectionListStore = {
  subscribe,
  set,
  update,
  getSubList: collectionListGetStore,
  refresh: collectionListRefresh
};
