import type { Readable } from "svelte/store";
import { derived, get, writable } from "svelte/store";

import { ADDRESS_ZERO, getAddresses } from "@common/common/config";
import { collectionStoreRefresh } from "./collection";
import { keyCollectionDefault } from "@common/common/keys";
import { localStorageGet, localStorageKey, localStorageLength, localStorageSet } from "@common/common/local";
import { Address } from "viem";

type CollectionDefaultType = [Address, Address];
type CollectionDefaultMapType = Map<string, CollectionDefaultType>;

// UTILITY : GET OpenNFTs default template
const collectionDefaultGetOpenNFTs = (chainId: number): Address =>
  getAddresses(chainId)?.OpenAutoMarket || ADDRESS_ZERO;

// LOADER : LOAD Collections from localStorage
const collectionDefaultLoadLocalStorage = (): CollectionDefaultMapType => {
  const collections: CollectionDefaultMapType = new Map();

  const len = localStorageLength();
  for (let index = 0; index < len; index++) {
    const key = localStorageKey(index);

    if (key?.startsWith("collectionDefault://")) {
      collections.set(key, JSON.parse(localStorageGet(key) || "{}") as CollectionDefaultType);
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
  address: Address = collectionDefaultGetOpenNFTs(chainId),
  mintable: boolean = false,
  account?: string
): void => {
  // console.log("collectionDefaultSetOne", chainId, address, account);

  if (!(chainId && address && address != ADDRESS_ZERO)) return;

  // Refresh default Collection (async)
  collectionStoreRefresh(chainId, address, account).catch(console.error);

  update(($collectionDefault: CollectionDefaultMapType): CollectionDefaultMapType => {
    const key = keyCollectionDefault(chainId, account);

    let addressDefault: Address;
    let addressMintable: Address;

    if (mintable) {
      addressMintable = address;
      [addressDefault] = $collectionDefault.get(key) || [ADDRESS_ZERO, ADDRESS_ZERO];
    } else {
      addressDefault = address;
      [, addressMintable] = $collectionDefault.get(key) || [ADDRESS_ZERO, ADDRESS_ZERO];
    }
    const adresses: CollectionDefaultType = [addressDefault, addressMintable];

    localStorageSet(key, JSON.stringify(adresses));

    // console.log(`collectionDefaultSetOne ${key}\n[${addressDefault}, ${addressMintable}] ${String(mintable)}`);
    return $collectionDefault.set(key, adresses);
  });
};

// ACTIONS : REFRESH default Collection, for an optionnal account
const collectionDefaultRefresh = (chainId: number, account?: Address): void => {
  if (!chainId) return;
  const key = keyCollectionDefault(chainId, account);

  let [addressDefault, addressMintable] = get(collectionDefaultStore).get(key) || [ADDRESS_ZERO, ADDRESS_ZERO];
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
const collectionDefaultSubStore = (
  chainId: number,
  mintable: boolean = false,
  account?: Address
): Readable<Address> => {
  const key = keyCollectionDefault(chainId, account);
  // console.log(`collectionDefaultGetStore ${key} ${String(mintable)}`);

  return derived(collectionDefaultStore, ($collectionDefaultStore): Address => {
    const collDefs = $collectionDefaultStore.get(key) || [ADDRESS_ZERO, ADDRESS_ZERO];
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
