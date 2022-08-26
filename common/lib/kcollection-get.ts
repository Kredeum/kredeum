import type { Provider } from "@ethersproject/abstract-provider";
import { Contract } from "ethers";

import type { CollectionType, CollectionSupports, ABIS } from "@lib/ktypes";
import { isProviderOnChainId, collectionKey } from "@lib/kconfig";
import { abis } from "@lib/kabis";
import { resolverGetCollection } from "@lib/resolver/resolver-get-collection";

// Cache contracts(chainId,address)
const contractsCache: Map<string, Contract> = new Map();

const collectionGetSupports = async (
  chainId: number,
  address: string,
  provider: Provider
): Promise<CollectionSupports> => {
  const collection = await collectionGet(chainId, address, provider);
  const supports = collection.supports || {};

  return supports;
};

const collectionGetContract = async (
  chainId: number,
  address: string,
  provider: Provider
): Promise<{ contract: Contract; supports: CollectionSupports }> => {
  // console.log(`collectionGetContract  IN ${collectionKey(chainId, address)}\n`);

  const supports = await collectionGetSupports(chainId, address, provider);

  let contract = contractsCache.get(collectionKey(chainId, address));
  let abi: Array<string> = [];

  if (!contract) {
    for (const [key, support] of Object.entries(supports || {})) {
      if (support) {
        const abiKey = abis[key as ABIS];

        if (abiKey) {
          // console.log("collectionGetContract", key, abiKey);
          abi = abi.concat(abis[key as ABIS]);
        } else {
          console.error("collectionGetContract ERROR", key);
        }
      }
    }
    contract = new Contract(address, abi, provider);
    contractsCache.set(collectionKey(chainId, address), contract);
  }

  // console.log(`collectionGetContract OUT ${collectionKey(chainId, address)}\n`);
  return { contract, supports };
};

// Merge 2 collections into 1 (twice the same collection but with different metadata)
const collectionMerge = (col1: CollectionType, col2: CollectionType): CollectionType => {
  const collMerged: CollectionType = Object.assign({ chainId: 1, address: "" }, col1 || {}, col2 || {});

  // collection.balancesOf is a Map => needs specific merge
  if (col1?.balancesOf && col2?.balancesOf) {
    collMerged.balancesOf = new Map([...col1.balancesOf, ...col2.balancesOf]);
  }
  return collMerged;
};

const collectionGet = async (
  chainId: number,
  address: string,
  provider: Provider,
  account?: string
): Promise<CollectionType> => {
  // console.log(`collectionGet ${collectionKey(chainId, address, account)}\n`);
  let collection: CollectionType = { chainId, address };
  if (!(chainId && address && (await isProviderOnChainId(provider, chainId)))) return collection;

  try {
    collection = await resolverGetCollection(chainId, address, provider, account);
  } catch (e) {
    console.error(`ERROR collectionGet  ${collectionKey(chainId, address, account)}\n`, e);
  }
  // console.log(`collectionGet ${collectionKey(chainId, address, account)}\n`, collection);
  return collection;
};

export { collectionGet, collectionMerge, collectionGetContract };
