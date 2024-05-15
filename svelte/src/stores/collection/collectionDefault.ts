import type { Readable } from "svelte/store";
import { derived, get, writable } from "svelte/store";

import { ADDRESS_ZERO, getAddresses } from "@kredeum/common/src/common/config";
import { collectionStoreRefresh } from "./collection";
import { keyCollectionDefault } from "@kredeum/common/src/common/keys";
import { localStorageGet, localStorageKeys, localStorageSet } from "@kredeum/common/src/common/local";

// UTILITY : GET OpenNFTs default template
const collectionDefaultGetOpenNFTs = (chainId: number): string =>
  getAddresses(chainId)?.OpenAutoMarket ||
  getAddresses(chainId)?.OpenNFTsV4 ||
  getAddresses(chainId)?.OpenNFTsV4Skale ||
  "";

// LOADER : LOAD Collections from localStorage
const collectionDefaultLoadLocalStorage = (): Map<string, [string, string]> => {
  const collections: Map<string, [string, string]> = new Map();

  localStorageKeys("collectionDefault://").map((key) => collections.set(key, JSON.parse(localStorageGet(key) || "{}")));

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

  if (!(chainId && address && address != ADDRESS_ZERO)) return;

  // Refresh default Collection (async)
  collectionStoreRefresh(chainId, address, account).catch(console.error);

  update(($collectionDefault: Map<string, [string, string]>): Map<string, [string, string]> => {
    const key = keyCollectionDefault(chainId, account);

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

    localStorageSet(key, JSON.stringify(adresses));

    // console.log(`collectionDefaultSetOne ${key}\n[${addressDefault}, ${addressMintable}] ${String(mintable)}`);
    return $collectionDefault.set(key, adresses);
  });
};

// ACTIONS : REFRESH default Collection, for an optionnal account
const collectionDefaultRefresh = (chainId: number, account?: string): void => {
  if (!chainId) return;
  const key = keyCollectionDefault(chainId, account);

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
  const key = keyCollectionDefault(chainId, account);
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
  keyCollectionDefault,
  collectionDefaultGetOpenNFTs
};
