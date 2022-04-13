import { writable } from "svelte/store";

import { NftType } from "lib/ktypes";

import { nftListRefresh } from "./nftListRefresh";
import { nftListGetStore } from "./nftListGet";

// LOADER : load Nfts from localStorage
const nftListLoadLocalStorage = (): Map<string, NftType> => {
  const nfts: Map<string, NftType> = new Map();

  for (let index = 0; index < localStorage.length; index++) {
    const key = localStorage.key(index);

    if (key?.startsWith("nft://")) {
      nfts.set(key, JSON.parse(localStorage.getItem(key)) as NftType);
    }
  }
  return nfts;
};

// STATE : NFT List : Map with key is chainId/collectionAddress/tokenID and value is NFT
const { subscribe, set, update } = writable(nftListLoadLocalStorage());

const nftListStore = {
  subscribe,
  set,
  update,
  getSubList: nftListGetStore,
  refresh: nftListRefresh
};

export { nftListStore };
