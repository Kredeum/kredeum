import { Readable } from "svelte/store";
import { derived } from "svelte/store";
import { collectionList } from "stores/collectionList";
import { Collection as CollectionType } from "lib/ktypes";

// STATE VIEW : GET one Collection
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const collectionGet = (chainId: number, address: string, account?: string): Readable<CollectionType> =>
  derived(collectionList, ($collectionList) => {
    return $collectionList.get(collectionList.getKey(chainId, address));
  });
