import type { Readable } from "svelte/store";
import { derived } from "svelte/store";

import { nftsStore } from "./NftsStore";

const zeroAddress = "0x0";

const localNftsStoreList: Readable<Map<string, Array<string>>> = derived(nftsStore, ($nftsStore) => {
  const mapList: Map<string, Array<string>> = new Map();
  for (const [, value] of $nftsStore) {
    const owner: string = value?.owner || zeroAddress;
    if (!mapList.has(owner)) mapList.set(owner, []);

    mapList.get(owner).push(value.tokenID);
  }
  return mapList;
});
const { subscribe } = localNftsStoreList;

const nftsStoreListCount: Readable<Map<string, number>> = derived(localNftsStoreList, ($localNftsStoreList) => {
  const mapCount: Map<string, number> = new Map();
  for (const [owner, tokenIDs] of $localNftsStoreList) {
    mapCount.set(owner, tokenIDs.length);
  }
  return mapCount;
});

const nftsStoreList = { subscribe };
export { nftsStoreList, nftsStoreListCount };
