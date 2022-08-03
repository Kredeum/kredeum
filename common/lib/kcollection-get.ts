import type { Provider } from "@ethersproject/abstract-provider";
import type { CollectionType, CollectionSupports, ABIS } from "./ktypes";

import { Contract } from "ethers";
import { collectionGetOtherData, collectionGetSupports } from "./kcollection-get-metadata";
import { isProviderOnChainId, collectionKey } from "./kconfig";

import { abis } from "lib/kabis";

// Cache contracts(chainId,address)
const contractsCache: Map<string, Contract> = new Map();

const collectionContractGet = async (
  chainId: number,
  address: string,
  provider: Provider,
  collection: CollectionType = { chainId, address }
): Promise<{ contract: Contract; supports: CollectionSupports }> => {
  console.log(`collectionContractGet  IN ${collectionKey(chainId, address)}\n`);

  const supports = await collectionGetSupports(chainId, address, provider, collection);

  let contract = contractsCache.get(collectionKey(chainId, address));
  if (!contract) {
    let abi: Array<string> = [];
    for (const [key, support] of Object.entries(supports || {})) {
      if (support) {
        const abiKey = abis[key as ABIS];
        console.log("collectionContractGet", key, abiKey);

        if (abiKey) {
          abi = abi.concat(abis[key as ABIS]);
        } else {
          console.error("collectionContractGet ERROR", key);
        }
      }
    }
    contract = new Contract(address, abi, provider);
    contractsCache.set(collectionKey(chainId, address), contract);
  }

  console.log(`collectionContractGet OUT ${collectionKey(chainId, address)}\n`);
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
  account?: string,
  collection: CollectionType = { chainId, address }
): Promise<CollectionType> => {
  // console.log(`collectionGet ${collectionKey(chainId, address, account)}\n`);

  if (!(chainId && address && (await isProviderOnChainId(provider, chainId)))) return collection;

  try {
    collection.supports = await collectionGetSupports(chainId, address, provider, collection);
    await collectionGetOtherData(chainId, address, provider, account, collection);
  } catch (e) {
    console.error(`ERROR collectionGet  ${collectionKey(chainId, address, account)}\n`, e);
  }
  // console.log(`collectionGet ${collectionKey(chainId, address, account)}\n`, collection);
  return collection;
};

export { collectionGet, collectionMerge, collectionContractGet, collectionGetSupports };
