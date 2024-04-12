import type { Readable } from "svelte/store";
import { derived, get } from "svelte/store";

import type { NftType } from "@kredeum/common/src/common/types";
import { nftGet } from "@kredeum/common/src/nft/nft-get";

import { nftListStore } from "./nftList";

import { ADDRESS_ZERO } from "@kredeum/common/src/common/config";
import { isAddressNotZero } from "@kredeum/common/src/common/config";
import { keyCollection, keyNft } from "@kredeum/common/src/common/keys";
import { collectionListStore } from "../collection/collectionList";
import { jsonMapStringify } from "../../helpers/jsonMap";
import { localStorageRemove, localStorageSet } from "@kredeum/common/src/common/local";

const nftStoreSet = (nft?: NftType): void => {
  if (!nft) return;
  const { chainId, address, tokenID } = nft;
  if (!(chainId && address && address != ADDRESS_ZERO && tokenID)) return;
  // console.log("nftStoreSet", chainId, address, tokenID);

  nftListStore.update(($nftListStore: Map<string, NftType>): Map<string, NftType> => {
    const key = keyNft(chainId, address, tokenID);

    localStorageSet(key, jsonMapStringify(nft));

    return $nftListStore.set(key, nft);
  });
};

// ACTIONS : REFRESH one Nft
const nftStoreRefresh = async (chainId: number, address: string, tokenID: string): Promise<void> => {
  // console.log("nftStoreRefresh", chainId, address, tokenID);
  if (!(chainId && isAddressNotZero(address) && tokenID)) return;

  const _coll = get(collectionListStore).get(keyCollection(chainId, address));
  // console.log("nftStoreRefresh ~ _coll", _coll);

  try {
    const _nftOld = get(nftListStore).get(keyNft(chainId, address, tokenID)) || {};
    const _nftLib = await nftGet(chainId, address, tokenID, _coll, true);

    const _nftNew = Object.assign(_nftOld, _nftLib);

    nftStoreSet(_nftNew);
  } catch (err) {
    console.info("nftStoreRefresh known", err);
  }
};

// STATE VIEW : one Nft store
const nftStore = (chainId: number, address: string, tokenID: string): Readable<NftType> =>
  derived(
    nftListStore,
    ($nftListStore) => $nftListStore.get(keyNft(chainId, address, tokenID)) || (new Map() as unknown as NftType)
  );

// Remove one nft from store & localstorage
const nftStoreRemove = (chainId: number, address: string, tokenID: string) => {
  if (!(chainId && address && address != ADDRESS_ZERO && tokenID)) return;

  nftListStore.update(($nftListStore: Map<string, NftType>): Map<string, NftType> => {
    const keyToRemove = keyNft(chainId, address, tokenID);

    localStorageRemove(keyToRemove);

    return ($nftListStore = new Map([...$nftListStore].filter(([key]) => key != keyToRemove)));
  });
};

const nftStoreAndRefresh = (chainId: number, address: string, tokenID: string): Readable<NftType> => {
  // STATE VIEW : sync read cache
  const nft = nftStore(chainId, address, tokenID);

  // ACTION : async refresh from lib onchain data
  nftStoreRefresh(chainId, address, tokenID).catch(console.error);

  return nft;
};

export { nftStore, nftStoreRefresh, nftStoreAndRefresh, nftStoreSet, nftStoreRemove };
