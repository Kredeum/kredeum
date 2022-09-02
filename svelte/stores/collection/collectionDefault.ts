import type { Readable } from "svelte/store";
import { derived, get, writable } from "svelte/store";

import { getNetwork } from "@lib/common/kconfig";
import { collectionDefaultKey } from "@lib/collection/kcollection-get";
import { collectionStore } from "./collection";

// UTILITY : GET OpenNFTs default template
const collectionDefaultGetOpenNFTs = (chainId: number): string => getNetwork(chainId)?.openNFTs || "";

// LOADER : LOAD Collections from localStorage
const collectionDefaultLoadLocalStorage = (): Map<string, [string, string]> => {
  const collections: Map<string, [string, string]> = new Map();

  for (let index = 0; index < localStorage.length; index++) {
    const key = localStorage.key(index);

    if (key?.startsWith("collectionDefault://")) {
      collections.set(key, JSON.parse(localStorage.getItem(key)) as [string, string]);
    }
  }
  // console.log("collectionDefaultLoadLocalStorage", collections);
  return collections;
};

// STATE : Default Collections : Map with key being chainId or chainId@account, value being addressDefault
const { subscribe, set, update } = writable(collectionDefaultLoadLocalStorage());

// STATE CHANGER : SET default Collection
const collectionDefaultSetOne = (
  chainId: number,
  address: string = collectionDefaultGetOpenNFTs(chainId),
  mintable: boolean = false,
  account?: string
): void => {
  // console.log("collectionDefaultSetOne", chainId, address, account);

  if (!(chainId && address)) return;

  // Refresh default Collection (async)
  collectionStore.refreshOne(chainId, address, account).catch(console.error);

  update(($collectionDefault: Map<string, [string, string]>): Map<string, [string, string]> => {
    const key = collectionDefaultKey(chainId, account);

    let addressDefault: string;
    let addressMintable: string;

    if (mintable) {
      addressMintable = address;
      [addressDefault] = $collectionDefault.get(key) || ["", ""];
    } else {
      addressDefault = address;
      [, addressMintable] = $collectionDefault.get(key) || ["", ""];
    }
    const adresses: [string, string] = [addressDefault, addressMintable];

    if (typeof localStorage !== "undefined") {
      localStorage.setItem(key, JSON.stringify(adresses));
    }
    // console.log(`collectionDefaultSetOne ${key}\n[${addressDefault}, ${addressMintable}] ${String(mintable)}`);
    return $collectionDefault.set(key, adresses);
  });
};

// ACTIONS : REFRESH default Collection, for an optionnal account
const collectionDefaultRefresh = (chainId: number, account?: string): void => {
  if (!chainId) return;
  const key = collectionDefaultKey(chainId, account);

  let [addressDefault, addressMintable] = get(collectionDefaultStore).get(key) || ["", ""];
  if (!addressMintable) {
    addressMintable = collectionDefaultGetOpenNFTs(chainId);
    collectionDefaultSetOne(chainId, addressMintable, true, account);
  }
  if (!addressDefault) {
    addressDefault = addressMintable;
    collectionDefaultSetOne(chainId, addressDefault, false, account);
  }
  // console.log(`collectionDefaultRefresh ${key}\n[${addressDefault}, ${addressMintable}]`);
};

// STATE VIEW : GET default Collection
const collectionDefaultSubStore = (chainId: number, mintable: boolean = false, account?: string): Readable<string> => {
  const key = collectionDefaultKey(chainId, account);
  // console.log(`collectionDefaultGetStore ${key} ${String(mintable)}`);

  return derived(collectionDefaultStore, ($collectionDefaultStore): string => {
    const collDefs = $collectionDefaultStore.get(key) || ["", ""];
    return mintable ? collDefs[1] : collDefs[0];
  });
};

const collectionDefaultStore = {
  subscribe,
  set,
  update
};

export {
  collectionDefaultStore,
  collectionDefaultSubStore,
  collectionDefaultSetOne,
  collectionDefaultRefresh,
  collectionDefaultKey,
  collectionDefaultGetOpenNFTs
};
