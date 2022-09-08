import type { Provider } from "@ethersproject/abstract-provider";
import { Signer } from "@ethersproject/abstract-signer";
import { Contract } from "ethers";

import type { CollectionType, ABIS } from "@lib/common/ktypes";
import { isProviderOnChainId } from "@lib/common/kconfig";
import { abis } from "@lib/common/kabis";
import { resolverGetCollection } from "@lib/resolver/resolver-get-collection";

// Cache contracts(chainId,address)
const contractsCache: Map<string, Contract> = new Map();

const collectionGetContract = async (
  chainId: number,
  address: string,
  signerOrProvider: Signer | Provider
): Promise<{ contract: Contract; collection: CollectionType }> => {
  // console.log(`collectionGetContract  IN ${collectionKey(chainId, address)}\n`);

  const collection = await collectionGet(chainId, address, signerOrProvider);
  const signerAddress = Signer.isSigner(signerOrProvider) ? await signerOrProvider.getAddress() : "";

  let contract = contractsCache.get(collectionKey(chainId, address, signerAddress));

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
    contract = new Contract(address, abi, signerOrProvider);
    contractsCache.set(collectionKey(chainId, address, signerAddress), contract);
  }

  // console.log(`collectionGetContract OUT ${collectionKey(chainId, address)}\n`);
  return { contract, collection };
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
  signerOrProvider: Signer | Provider,
  account?: string
): Promise<CollectionType> => {
  // console.log(`collectionGet ${collectionKey(chainId, address, account)}\n`);
  let collection: CollectionType = { chainId, address };

  if (!(chainId && address && signerOrProvider && (await isProviderOnChainId(chainId, signerOrProvider))))
    return collection;

  try {
    collection = await resolverGetCollection(chainId, address, signerOrProvider, account);
  } catch (e) {
    console.error(`ERROR collectionGet  ${collectionKey(chainId, address, account)}\n`, e);
  }
  // console.log(`collectionGet ${collectionKey(chainId, address, account)}\n`, collection);
  return collection;
};

const collectionKey = (chainId: number, address: string, account?: string): string =>
  `collection://${String(chainId)}/${address}${account ? "@" + account : ""}`;

// UTILITY : GET Key
const collectionDefaultKey = (chainId: number, account: string): string =>
  `collectionDefault://${String(chainId)}${account ? "@" + account : ""}`;

const collectionBurnable = async (
  chainId: number,
  address: string,
  signerOrProvider: Signer | Provider
): Promise<string> => {
  const { contract, collection } = await collectionGetContract(chainId, address, signerOrProvider);
  let burnFunction = "";

  if (collection.supports.IOpenNFTsV4) {
    burnFunction = "burn";
  } else if (collection.supports.IOpenNFTsV3) {
    if (await contract.burnable()) burnFunction = "burnOpenNFT";
  }

  return burnFunction;
};

export {
  collectionGet,
  collectionMerge,
  collectionGetContract,
  collectionKey,
  collectionDefaultKey,
  collectionBurnable
};
