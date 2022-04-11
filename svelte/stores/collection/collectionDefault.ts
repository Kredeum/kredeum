import type { Readable } from "svelte/store";
import { derived, get, writable } from "svelte/store";

import { getNetwork } from "lib/kconfig";

// UTILITY : Get Key
const collectionDefaultGetKey = (chainId: number, account: string): string =>
  `collectionDefault://${String(chainId)}${account ? "@" + account : ""}`;

// UTILITY : Get OpenNFTs default template
const collectionDefaultGetOpenNFTs = (chainId: number): string => getNetwork(chainId)?.defaultOpenNFTs || "";

const collectionDefaultGetOne = (chainId: number, account?: string): string => {
  const ret = get(collectionDefaultStore).get(collectionDefaultGetKey(chainId, account));
  console.log("collectionDefaultGetOne ~ ret", ret);
  return ret;
};

// LOADER : load Collections from localStorage
const collectionDefaultLoadLocalStorage = (): Map<string, string> => {
  const collections: Map<string, string> = new Map();

  for (let index = 0; index < localStorage.length; index++) {
    const key = localStorage.key(index);

    if (key?.startsWith("collectionDefault://")) {
      collections.set(key, localStorage.getItem(key));
    }
  }
  return collections;
};

// STATE : Default Collections : Map with key being chainId or chainId@account, value being collectionAddress
const { subscribe, set, update } = writable(collectionDefaultLoadLocalStorage());

// STATE CHANGER : Set default Collection
const collectionDefaultUpdateOne = (chainId: number, address: string, account?: string): void => {
  // console.log("collectionDefaultUpdateOne", chainId, address, account);

  if (!(chainId && address)) return;

  update(($collectionDefault: Map<string, string>): Map<string, string> => {
    const key = collectionDefaultGetKey(chainId, account);

    if (typeof localStorage !== "undefined") {
      localStorage.setItem(key, address);
    }
    return $collectionDefault.set(key, address);
  });
};

// STATE VIEW : get default Collection
const collectionDefaultGetStore = (chainId: number, account?: string): Readable<string> =>
  derived(collectionDefaultStore, ($collectionDefaultStore) =>
    $collectionDefaultStore.get(collectionDefaultGetKey(chainId, account))
  );

export const collectionDefaultStore = {
  subscribe,
  set,
  update,
  get: collectionDefaultGetStore,
  updateOne: collectionDefaultUpdateOne,
  getOne: collectionDefaultGetOne,
  getKey: collectionDefaultGetKey,
  getOpenNFTs: collectionDefaultGetOpenNFTs
};
