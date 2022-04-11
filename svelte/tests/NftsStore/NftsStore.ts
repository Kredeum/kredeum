import type { Writable } from "svelte/store";
import { writable, get } from "svelte/store";

type NftType = { tokenID: string; image: string; owner: string };

const localNftsStore: Writable<Map<string, NftType>> = writable(new Map() as Map<string, NftType>);
const { subscribe } = localNftsStore;

const getNft = (tokenID: string): NftType => get(localNftsStore).get(tokenID);

const setNft = (tokenID: string, owner = "zero"): void => {
  get(localNftsStore).set(tokenID, { tokenID, image: `https://picsum.photos/id/${tokenID}/150`, owner });
  localNftsStore.set(get(localNftsStore));
};

const nftsStore = { subscribe, setNft, getNft };

export { nftsStore };
export type { NftType };
