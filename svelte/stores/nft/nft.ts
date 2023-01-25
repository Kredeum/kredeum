import type { Readable } from "svelte/store";
import { derived, get } from "svelte/store";

import type { NftType } from "@lib/common/types";
import { nftGet as nftLib } from "@lib/nft/nft-get";

import { nftListStore } from "./nftList";

import { collectionStore } from "../collection/collection";

// UTILITY
const nftGetKey = (chainId: number, address: string, tokenID: string): string =>
  `nft://${String(chainId)}/${address}/${tokenID}`;

const nftSetOne = (nft: NftType): void => {
  // console.log("nftSetOne", chainId, address, tokenID);
  const { chainId, address, tokenID } = nft || {};
  if (!(chainId && address && tokenID)) return;

  nftListStore.update(($nftListStore: Map<string, NftType>): Map<string, NftType> => {
    const key = nftGetKey(chainId, address, tokenID);

    if (typeof localStorage !== "undefined") {
      localStorage.setItem(key, JSON.stringify(nft));
    }
    return $nftListStore.set(key, nft);
  });
};

// ACTIONS : REFRESH one Nft, for an optionnal account
const nftRefresh = async (chainId: number, address: string, tokenID: string): Promise<void> => {
  console.log("nftRefresh", chainId, address, tokenID);
  if (!(chainId && address && tokenID)) return;

  const key = nftGetKey(chainId, address, tokenID);
  console.log("nftRefresh ~ key", key);

  const _coll = get(collectionStore.getListStore).get(collectionStore.getKey(chainId, address));
  console.log("nftRefresh ~ _coll", _coll);

  // if (_coll?.supports?.IERC1155) return;
  try {
    // const _nftOld = get(nftListStore).get(nftGetKey(chainId, address, tokenID));
    const _nftLib = await nftLib(chainId, address, tokenID, _coll, true);

    // Object.assign(_nftLib, _nftOld);

    console.log("nftRefresh _nftLib", _nftLib);
    nftSetOne(_nftLib);
  } catch (err) {
    console.error("nftRefresh", err);
  }
};

// STATE VIEW : GET one Nft
const nftGetStore = (chainId: number, address: string, tokenID: string): Readable<NftType> =>
  derived(nftListStore, ($nftListStore) => $nftListStore.get(nftGetKey(chainId, address, tokenID)));

// Remove one nft from store & localstorage
const nftRemoveOne = (chainId: number, address: string, tokenID: string) => {
  if (!(chainId && address && tokenID)) return;

  nftListStore.update(($nftListStore: Map<string, NftType>): Map<string, NftType> => {
    const keyToRemove = nftGetKey(chainId, address, tokenID);

    if (typeof localStorage !== "undefined") {
      localStorage.removeItem(keyToRemove);
    }

    return ($nftListStore = new Map([...$nftListStore].filter(([key]) => key != keyToRemove)));
  });
};

const nftGetAndRefresh = (chainId: number, address: string, tokenID: string): Readable<NftType> => {
  if (!(chainId && address && tokenID)) return;

  // STATE VIEW : sync read cache
  const nft = nftGetStore(chainId, address, tokenID);

  // ACTION : async refresh from lib onchain data
  nftRefresh(chainId, address, tokenID).catch(console.error);

  return nft;
};

export const nftStore = {
  getKey: nftGetKey,
  getOneStore: nftGetStore,
  refreshOne: nftRefresh,
  getAndRefresh: nftGetAndRefresh,
  setOne: nftSetOne,
  nftRemoveOne,
  getListStore: nftListStore
};
