import { writable } from "svelte/store";

import {
  collectionDefaultGetStore,
  collectionDefaultGetOpenNFTs,
  collectionDefaultGetOne
} from "stores/collectionDefaultGet";

// UTILITY : Get Key
const collectionDefaultGetKey = (chainId: number, account: string): string =>
  `collectionDefault://${String(chainId)}${account ? "@" + account : ""}`;

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
  console.log("collectionDefaultSet ", chainId, address, account);

  if (!(chainId && address)) return;

  update(($collectionDefault: Map<string, string>): Map<string, string> => {
    const key = collectionDefaultGetKey(chainId, account);
    console.log("collectionDefaultUpdateOne ~ key", key);

    if (typeof localStorage !== "undefined") {
      localStorage.setItem(key, address);
    }
    return $collectionDefault.set(key, address);
  });
};

export const collectionDefaultStore = {
  subscribe,
  set,
  update,
  get: collectionDefaultGetStore,
  updateOne: collectionDefaultUpdateOne,
  getKey: collectionDefaultGetKey,
  getOne: collectionDefaultGetOne,
  getOpenNFTs: collectionDefaultGetOpenNFTs
};
