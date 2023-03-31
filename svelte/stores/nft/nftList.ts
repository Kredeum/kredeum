import { writable } from "svelte/store";

import type { NftType } from "@lib/common/types";
import { jsonPlusParse } from "@helpers/jsonPlus";

// LOADER : LOAD Nfts from localStorage
const nftListLoadLocalStorage = (): Map<string, NftType> => {
  const nfts: Map<string, NftType> = new Map();

  for (let index = 0; index < localStorage.length; index++) {
    const key = localStorage.key(index);

    if (key?.startsWith("nft://")) {
      nfts.set(key, jsonPlusParse(localStorage.getItem(key)) as NftType);
    }
  }
  // console.log("nftListLoadLocalStorage", nfts);
  return nfts;
};

// STATE : NFT List : Map with key is chainId/collectionAddress/tokenID and value is NFT
const { subscribe, set, update } = writable(nftListLoadLocalStorage());

const nftListStore = {
  subscribe,
  set,
  update
};

export { nftListStore };
