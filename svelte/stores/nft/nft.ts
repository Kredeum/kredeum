import type { Readable } from "svelte/store";
import { derived, get } from "svelte/store";

import type { NftType } from "@lib/ktypes";
import { nftGet as nftLib } from "@lib/knft-get";

import { metamaskProvider } from "@main/metamask";

import { nftListStore } from "./nftList";
import { nftSubListStore, nftSubListRefresh } from "./nftSubList";

import { collectionStore } from "../collection/collection";

// UTILITY
const nftGetKey = (chainId: number, address: string, tokenID: string): string =>
  `nft://${String(chainId)}/${address}/${tokenID}`;

// UTILITY : Merge 2 Nfts into 1 (twice the same Nft but with different metadata)
const nftMerge = (nft1: NftType, nft2: NftType): NftType =>
  Object.assign({ chainId: 1, address: "", tokenID: "" }, nft1 || {}, nft2 || {});

const nftSetOne = (nft: NftType): void => {
  if (!nft) return;
  // console.log("nftSetOne", nft);

  const { chainId, address, tokenID } = nft;
  if (!(chainId && address && tokenID)) return;
  // console.log("nftSetOne", chainId, address, tokenID);

  nftListStore.update(($nftListStore: Map<string, NftType>): Map<string, NftType> => {
    const key = nftGetKey(chainId, address, tokenID);
    const oldNft = $nftListStore.get(key);
    const mergedNft = nftMerge(oldNft, nft);

    if (typeof localStorage !== "undefined") {
      localStorage.setItem(key, JSON.stringify(mergedNft));
    }
    return $nftListStore.set(key, mergedNft);
  });
};

// ACTIONS : REFRESH one Nft, for an optionnal account
const nftRefresh = async (chainId: number, address: string, tokenID: string): Promise<void> => {
  // console.log("nftRefresh", chainId, address, tokenID);

  if (!(chainId && address && tokenID)) return;
  // const key = nftGetKey(chainId, address, tokenID);
  // console.log("nftRefresh ~ key", key);

  const _coll = get(collectionStore.getListStore).get(collectionStore.getKey(chainId, address));
  // console.log("nftRefresh ~ _coll", _coll);

  const _nftOld = get(nftListStore).get(nftGetKey(chainId, address, tokenID));
  const _nftLib = await nftLib(chainId, address, tokenID, get(metamaskProvider), _coll, true);

  Object.assign(_nftLib, _nftOld);

  // console.log("nftRefresh _nft", _nft);
  nftSetOne(_nftLib);
};

// STATE VIEW : GET one Nft
const nftGetStore = (chainId: number, address: string, tokenID: string): Readable<NftType> =>
  derived(nftListStore, ($nftListStore) => $nftListStore.get(nftGetKey(chainId, address, tokenID)));

// Remove one nft from store & localstorage
const nftRemoveOne = (chainId: number, address: string, tokenID: string) => {
  nftListStore.update(($nftListStore: Map<string, NftType>): Map<string, NftType> => {
    const keyToRemove = nftGetKey(chainId, address, tokenID);

    if (typeof localStorage !== "undefined") {
      localStorage.removeItem(keyToRemove);
    }

    return ($nftListStore = new Map([...$nftListStore].filter(([key, nft]) => key != keyToRemove)));
  });
};

export {};

export const nftStore = {
  getKey: nftGetKey,
  getOneStore: nftGetStore,
  refreshOne: nftRefresh,
  setOne: nftSetOne,
  nftRemoveOne,

  getListStore: nftListStore,

  getSubListStore: nftSubListStore,
  refreshSubList: nftSubListRefresh
};
