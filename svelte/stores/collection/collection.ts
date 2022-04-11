import type { Readable } from "svelte/store";
import { derived, get } from "svelte/store";

import { collectionGet as collectionLib } from "lib/kcollection-get";
import { Collection as CollectionType } from "lib/ktypes";
import { collectionMerge } from "lib/kcollection-get";

import { metamaskProvider } from "main/metamask";
import { collectionListStore } from "stores/collection/collectionList";
import { jsonMapStringify } from "helpers/jsonMap";

// STATE CHANGER : SET one Collection
const collectionUpdateOne = (collectionObject: CollectionType): void => {
  const { chainId, address } = collectionObject;
  if (!(chainId && address)) return;

  collectionListStore.update(($collectionList: Map<string, CollectionType>): Map<string, CollectionType> => {
    const key = collectionListStore.getKey(chainId, address);

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
    return $collectionListStore.get(collectionListStore.getKey(chainId, address));
  });

// ACTIONS : SET one Collection, for an optionnal account
const collectionRefresh = async (chainId: number, address: string, account?: string): Promise<void> => {
  if (!chainId) return;
  collectionUpdateOne(await collectionLib(chainId, address, get(metamaskProvider), account));
};

export const collectionStore = {
  updateOne: collectionUpdateOne,
  get: collectionGetStore,
  refresh: collectionRefresh
};
