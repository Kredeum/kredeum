import { Readable } from "svelte/store";
import { derived, get } from "svelte/store";
import { collectionDefaultStore } from "stores/collection/collectionDefault";

import { getNetwork } from "lib/kconfig";

// UTILITY : Get OpenNFTs default template
const collectionDefaultGetOpenNFTs = (chainId: number): string => getNetwork(chainId)?.defaultOpenNFTs || "";

const collectionDefaultGetOne = (chainId: number, account?: string): string =>
  get(collectionDefaultStore).get(collectionDefaultStore.getKey(chainId, account));

// STATE VIEW : get default Collection
const collectionDefaultGetStore = (chainId: number, account?: string): Readable<string> =>
  derived(collectionDefaultStore, ($collectionDefaultStore) =>
    $collectionDefaultStore.get(collectionDefaultStore.getKey(chainId, account))
  );

export { collectionDefaultGetStore, collectionDefaultGetOpenNFTs, collectionDefaultGetOne };
