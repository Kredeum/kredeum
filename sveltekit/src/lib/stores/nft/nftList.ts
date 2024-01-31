import { writable } from "svelte/store";

import type { NftType } from "@kredeum/common/lib/common/types";
import { jsonMapParse } from "@kredeum/sveltekit/src/lib/helpers/jsonMap";
import { localStorageGet, localStorageKey, localStorageLength } from "@kredeum/common/lib/common/local";

// LOADER : LOAD Nfts from localStorage
const nftListLoadLocalStorage = (): Map<string, NftType> => {
  const nfts: Map<string, NftType> = new Map();

  const len = localStorageLength();
  for (let index = 0; index < len; index++) {
    const key = localStorageKey(index);

    if (key?.startsWith("nft://")) {
      nfts.set(key, jsonMapParse(localStorageGet(key)) as NftType);
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
