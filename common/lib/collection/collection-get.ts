import { Contract, Signer } from "ethers";

import type { CollectionType, ABIS } from "@lib/common/types";
import { abis } from "@lib/common/abis";
import { resolverGetCollection } from "@lib/resolver/resolver-get-collection";
import { providerGetSignerOrProvider } from "@lib/common/provider-get";
import { keyCollectionContract, keyCollection } from "@lib/common/keys";
import { getChecksumAddress } from "@lib/common/config";

// Cache contracts(chainId,address,getSigner)
const contractsCache: Map<string, Contract> = new Map();
// Cache signers(chainId,address)
const signersCache: Map<string, string> = new Map();

const collectionGetContract = async (
  chainId: number,
  address: string,
  getSigner = false
): Promise<{ contract: Contract; collection: CollectionType; signer?: string }> => {
  // console.log(`collectionGetContract  IN ${keyCollection(chainId, address)}\n`);

  const collection = await collectionGet(chainId, address);

  let signer = "";
  let contract = contractsCache.get(keyCollectionContract(chainId, address, getSigner));
  if (contract && getSigner) {
    signer = signersCache.get(keyCollection(chainId, address)) || "";
  }

  if (!contract) {
    let abi: Array<string> = [];

    for (const [key, support] of Object.entries(collection.supports || {})) {
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
    const signerOrProvider = await providerGetSignerOrProvider(chainId, getSigner);
    contract = new Contract(address, abi, signerOrProvider);

    contractsCache.set(keyCollectionContract(chainId, address, getSigner), contract);

    if (getSigner) {
      signer = getChecksumAddress(await (signerOrProvider as Signer)?.getAddress());
      signersCache.set(keyCollection(chainId, address), signer);
    }
  }

  // console.log(`collectionGetContract OUT ${keyCollection(chainId, address)}\n`, contract, collection);
  return signer ? { contract, collection, signer } : { contract, collection };
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

const collectionGet = async (chainId: number, address: string, account?: string): Promise<CollectionType> => {
  console.log(`collectionGet ${keyCollection(chainId, address, account)}\n`);
  let collection: CollectionType = { chainId, address };

  if (!(chainId && address)) return collection;

  try {
    collection = await resolverGetCollection(chainId, address, account);
  } catch (e) {
    if (e.reason == "Not ERC165") console.info(`COLLECTION NOT ERC165 ${keyCollection(chainId, address, account)}`);
    else console.error(`ERROR collectionGet ${e.reason} ${keyCollection(chainId, address, account)}\n`, e);
  }
  // console.log(`collectionGet ${keyCollection(chainId, address, account)}\n`, collection);
  return collection;
};

const collectionBurnable = async (chainId: number, address: string): Promise<string> => {
  const { collection } = await collectionGetContract(chainId, address);

  return collection.version === 4 ? "burn" : "";
};

export { collectionGet, collectionMerge, collectionGetContract, collectionBurnable };
