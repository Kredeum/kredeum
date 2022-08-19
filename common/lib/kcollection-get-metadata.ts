import { Provider } from "@ethersproject/abstract-provider";
import type { CollectionType, CollectionSupports, ABIS } from "./ktypes";
import { isProviderOnChainId, collectionKey } from "./kconfig";
import { resolverGetCollectionSupports } from "./kcollection-get-supports-new";
import { collectionGetSupportsOld } from "./kcollection-get-supports-old";
import { collectionGetOtherDataOld } from "./kcollection-get-other-data-old";

import { resolverGetAddress } from "./kresolver-get";

// Cache supports   (chainId, address)
const supportsCache: Map<string, CollectionSupports> = new Map();

const collectionGetSupports = async (
  chainId: number,
  address: string,
  provider: Provider,
  collection: CollectionType = { chainId, address }
): Promise<CollectionSupports> => {
  if (!(chainId && address && (await isProviderOnChainId(provider, chainId)))) return {};

  let supports: CollectionSupports | undefined = {};

  console.log(`collectionGetSupports IN ${collectionKey(chainId, address)}`);

  supports = supportsCache.get(collectionKey(chainId, address));

  if (!supports) {
    if (resolverGetAddress(chainId)) {
      supports = await resolverGetCollectionSupports(chainId, address, provider);
    } else {
      supports = await collectionGetSupportsOld(chainId, address, provider);
    }

    for (const key in supports) {
      if (!supports[key as ABIS]) delete supports[key as ABIS];
    }
    supportsCache.set(collectionKey(chainId, address), supports);
  }

  console.log(`collectionGetSupports OUT ${collectionKey(chainId, address)}\n`, supports);
  return supports;
};

const collectionGetOtherData = async (
  chainId: number,
  address: string,
  provider: Provider,
  account?: string,
  collection: CollectionType = { chainId, address }
): Promise<CollectionType> => {
  console.log(`collectionGetOtherData  IN ${collectionKey(chainId, address, account)}\n`);

  if (!(chainId && address && collection.supports && (await isProviderOnChainId(provider, chainId)))) return collection;

  // if (resolverGetAddress(chainId)) {
  //   collection = await collectionGetOtherDataOld(chainId, address, provider, account, collection);
  // } else
  {
    await collectionGetOtherDataOld(chainId, address, provider, collection, account);
  }
  console.log("collectionGetOtherData OUT", collection);

  return collection;
};

export { collectionGetOtherData, collectionGetSupports };
