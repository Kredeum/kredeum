import type { Readable } from "svelte/store";
import { derived, get } from "svelte/store";

import type { CollectionType } from "@lib/ktypes";
import { collectionGet as collectionLib } from "@lib/kcollection-get";
import { collectionMerge } from "@lib/kcollection-get";

import { metamaskProvider } from "@main/metamask";
import { jsonMapStringify } from "@helpers/jsonMap";
import { collectionListStore } from "@stores/collection/collectionList";
import { collectionSubListStore, collectionSubListRefresh } from "@stores/collection/collectionSubList";
import {
  collectionDefaultStore,
  collectionDefaultSubStore,
  collectionDefaultSetOne,
  collectionDefaultRefresh,
  collectionDefaultGetKey,
  collectionDefaultGetOpenNFTs
} from "@stores/collection/collectionDefault";

// UTILITY
const collectionGetKey = (chainId: number, address: string): string => `collection://${String(chainId)}/${address}`;

// STATE CHANGER : SET one Collection
const collectionSetOne = (collection: CollectionType): void => {
  const { chainId, address } = collection || {};
  if (!(chainId && address)) return;

  collectionListStore.update(($collectionList: Map<string, CollectionType>): Map<string, CollectionType> => {
    const key = collectionGetKey(chainId, address);
    const newColl = collectionMerge($collectionList.get(key), collection);

    if (typeof localStorage !== "undefined") {
      localStorage.setItem(key, jsonMapStringify(newColl));
    }
    // console.log(`collectionSetOne ${key}`, collection);
    return $collectionList.set(key, newColl);
  });
};

// ACTIONS : REFRESH one Collection, for an optionnal account
const collectionRefresh = async (chainId: number, address: string, account?: string): Promise<void> => {
  if (!(chainId && address)) return;
  const collection = await collectionLib(chainId, address, get(metamaskProvider), account);
  // console.log(`collectionRefresh ${collectionGetKey(chainId, address)}\n`, collection);
  collectionSetOne(collection);
};

// TODO : add account param, to get balanceOf account, each time
// STATE VIEW : GET one Collection
const collectionGetStore = (chainId: number, address: string): Readable<CollectionType> => {
  const key = collectionGetKey(chainId, address);
  // console.log(`collectionGetStore ${key}`);

  return derived(collectionListStore, ($collectionListStore) => $collectionListStore.get(key));
};

export const collectionStore = {
  getKey: collectionGetKey,
  getOneStore: collectionGetStore,
  refreshOne: collectionRefresh,
  setOne: collectionSetOne,

  getListStore: collectionListStore,

  getSubListStore: collectionSubListStore,
  refreshSubList: collectionSubListRefresh,

  getDefaultStore: collectionDefaultStore,
  getDefaultSubStore: collectionDefaultSubStore,
  getDefaultKey: collectionDefaultGetKey,
  getDefaultOpenNFTs: collectionDefaultGetOpenNFTs,
  refreshDefault: collectionDefaultRefresh,
  setDefaultOne: collectionDefaultSetOne
};
