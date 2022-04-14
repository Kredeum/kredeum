import type { Readable } from "svelte/store";
import { derived } from "svelte/store";

import type { NftType } from "lib/ktypes";
import { nftListStore } from "./nftList";

// STATE VIEW : GET Collection fitered list
const nftListGetStore = (chainId: number, address: string, account?: string): Readable<Map<string, NftType>> =>
  derived(nftListStore, ($nftListStore) => {
    if (!(chainId && address)) return new Map() as Map<string, NftType>;

    return new Map(
      [...$nftListStore].filter(
        ([, nft]) => nft.chainId === chainId && nft.address === address && (!account || nft.owner === account)
      )
    );
  });

export { nftListGetStore };
