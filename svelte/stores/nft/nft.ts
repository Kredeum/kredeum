import type { Readable } from "svelte/store";
import { derived, get } from "svelte/store";

import type { NftType } from "lib/ktypes";
import { nftGet as nftLib } from "lib/knft-get";

import { metamaskProvider } from "main/metamask";
import { nftListStore } from "./nftList";
import { collectionListStore } from "../collection/collectionList";
import { collectionStore } from "../collection/collection";

// UTILITY
const nftGetKey = (chainId: number, address: string, tokenID: string): string =>
  `nft://${String(chainId)}/${address}/${tokenID}`;

const nftSetOne = (nft: NftType): void => {
  if (!nft) return;
  // console.log("nftSetOne", nft);

  const { chainId, address, tokenID } = nft;
  if (!(chainId && address && tokenID)) return;
  console.log("nftSetOne", chainId, address, tokenID);

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
  const _coll = get(collectionListStore).get(collectionStore.getKey(chainId, address));
  const _nft = await nftLib(chainId, address, tokenID, get(metamaskProvider), _coll, true);
  console.log("nftRefresh _nft", _nft);
  nftSetOne(_nft);
};

// STATE VIEW : GET one Nft
const nftGetStore = (chainId: number, address: string, tokenID: string): Readable<NftType> =>
  derived(nftListStore, ($nftListStore) => $nftListStore.get(nftGetKey(chainId, address, tokenID)));

export {};

export const nftStore = {
  get: nftGetStore,
  setOne: nftSetOne,
  refresh: nftRefresh,
  getKey: nftGetKey
};
