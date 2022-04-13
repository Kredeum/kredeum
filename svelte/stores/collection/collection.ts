import type { Readable } from "svelte/store";
import { derived, get } from "svelte/store";

import { collectionGet as collectionLib } from "lib/kcollection-get";
import { CollectionType } from "lib/ktypes";
import { collectionMerge } from "lib/kcollection-get";

import { metamaskProvider } from "main/metamask";
import { collectionListStore } from "stores/collection/collectionList";
import { jsonMapStringify } from "helpers/jsonMap";

// UTILITY
const collectionGetKey = (chainId: number, address: string): string => `collection://${String(chainId)}/${address}`;

// UTILITY
const collectionGetOne = (chainId: number, address: string): CollectionType =>
  get(collectionListStore).get(collectionGetKey(chainId, address));

// STATE CHANGER : SET one Collection
const collectionUpdateOne = (collectionObject: CollectionType): void => {
  const { chainId, address } = collectionObject;
  if (!(chainId && address)) return;

  collectionListStore.update(($collectionList: Map<string, CollectionType>): Map<string, CollectionType> => {
    const key = collectionGetKey(chainId, address);

    const newColl = collectionMerge($collectionList.get(key), collectionObject);

    if (typeof localStorage !== "undefined") {
      localStorage.setItem(key, jsonMapStringify(newColl));
    }
    return $collectionList.set(key, newColl);
  });
};

// STATE VIEW : GET one Collection
const collectionGetStore = (chainId: number, address: string): Readable<CollectionType> =>
  derived(collectionListStore, ($collectionListStore) => {
    return $collectionListStore.get(collectionGetKey(chainId, address));
  });

// ACTIONS : SET one Collection, for an optionnal account
const collectionRefresh = async (chainId: number, address: string, account?: string): Promise<void> => {
  if (!chainId) return;
  collectionUpdateOne(await collectionLib(chainId, address, get(metamaskProvider), account));
};

export const collectionStore = {
  updateOne: collectionUpdateOne,
  get: collectionGetStore,
  getOne: collectionGetOne,
  refresh: collectionRefresh
};
