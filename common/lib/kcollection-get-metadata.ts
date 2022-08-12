import { Provider } from "@ethersproject/abstract-provider";
import type { CollectionType, CollectionSupports, ABIS } from "./ktypes";
import { isProviderOnChainId, collectionKey } from "./kconfig";
import { collectionGetSupportsNew } from "./kcollection-get-supports-new";
import { collectionGetSupportsOld } from "./kcollection-get-supports-old";
import { collectionGetOtherDataOld } from "./kcollection-get-other-data-old";

import Semaphore from "semaphore-async-await";
import { resolverGetAddress } from "./kresolver-get";

// Cache supports   (chainId, address)
const supportsCache: Map<string, CollectionSupports> = new Map();
const locks: Map<string, Semaphore> = new Map();

const collectionGetSupports = async (
  chainId: number,
  address: string,
  provider: Provider,
  collection: CollectionType = { chainId, address }
): Promise<CollectionSupports> => {
  if (!(chainId && address && (await isProviderOnChainId(provider, chainId)))) return {};

  let supports: CollectionSupports | undefined = {};

  // console.log(`collectionGetSupports IN ${collectionKey(chainId, address)}`);

  const lockPrevious = locks.get(collectionKey(chainId, address));
  if (lockPrevious) {
    await lockPrevious.acquire();
    supports = supportsCache.get(collectionKey(chainId, address));
    lockPrevious.release();

    if (!supports?.IERC165) console.error("collectionGetSupports ERROR IERC165");
    return supports || {};
  }

  const lock = new Semaphore(1);
  locks.set(collectionKey(chainId, address), lock);
  await lock.acquire();

  if (resolverGetAddress(chainId)) {
    supports = await collectionGetSupportsNew(chainId, address, provider);
  } else {
    supports = await collectionGetSupportsOld(chainId, address, provider);
  }

  for (const key in supports) {
    if (!supports[key as ABIS]) delete supports[key as ABIS];
  }

  // console.log(`collectionGetSupports OUT ${collectionKey(chainId, address)}\n`, supports);

  // supportsCache.set(collectionKey(chainId, address), supports);
  // lock.release();

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
