import { writable, get } from "svelte/store";

import { collectionList as collectionListLib } from "lib/kcollection-list";
import { metamaskProvider } from "main/metamask";

import type { Collection as CollectionType } from "lib/ktypes";

// UTILITIES
const getKey = (chainId: number, address: string): string => `${String(chainId)}/${address}`;

// STATE : Collection List : Map with key is chainId/collectionAddress and value is collectionObject
const { subscribe, set, update } = writable(new Map() as Map<string, CollectionType>);

// STATE CHANGER : SET one Collection
const updateOne = (collectionObject: CollectionType): void => {
  const { chainId, address } = collectionObject;
  if (!(chainId && address)) return;

  update(($collectionList) => $collectionList.set(getKey(chainId, address), collectionObject));
};

// ACTIONS : SET all Collections from one nework, from an optionnal account
const updateFilter = async (chainId: number, account?: string): Promise<void> => {
  if (!chainId) return;

  const collectionListFromLib = await collectionListLib(chainId, account, get(metamaskProvider));
  for (const collectionObject of collectionListFromLib.values()) {
    updateOne(collectionObject);
  }
};

export const collectionList = {
  subscribe,
  set,
  update,
  updateOne,
  updateFilter,
  getKey
};
