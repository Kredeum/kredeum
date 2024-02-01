import { Contract, Signer } from "ethers";

import type { CollectionType } from "@kredeum/common/lib/common/types";
import type { JsonFragment } from "@ethersproject/abi";
import { getAbi } from "@kredeum/common/lib/common/artifacts";
import { resolverGetCollection } from "@kredeum/common/lib/resolver/resolver-get-collection";
import { providerGetSignerOrProvider } from "@kredeum/common/lib/common/provider-get";
import { keyCollectionContract, keyCollection } from "@kredeum/common/lib/common/keys";
import { ADDRESS_ZERO, explorerAddressUrl, getChecksumAddress, isAddressNotZero } from "@kredeum/common/lib/common/config";
import { isAddress } from "ethers/lib/utils";
import { collectionSupports } from "./collection";

// Cache contracts(chainId,address,getSigner)
const contractsCache: Map<string, Contract> = new Map();
// Cache signers(chainId,address)
const signersCache: Map<string, string> = new Map();

const collectionGetContract = async (
  chainId: number,
  address: string,
  getSigner = false
): Promise<{ contract?: Contract; collection: CollectionType; signer?: string }> => {
  // console.log(`collectionGetContract  IN ${keyCollection(chainId, address)}\n`);

  const collection = await collectionGet(chainId, address);
  if (!(chainId && address && address != ADDRESS_ZERO)) return { collection };

  let signer = "";
  let contract = contractsCache.get(keyCollectionContract(chainId, address, getSigner));
  if (contract && getSigner) {
    signer = signersCache.get(keyCollection(chainId, address)) || "";
  }

  if (!contract) {
    let abi: Array<JsonFragment> = [];

    for (const [key, support] of collectionSupports(collection).entries()) {
      if (support) {
        const abiKey = getAbi(key) as JsonFragment;

        if (abiKey) {
          const keyAbi = key == "IOpenNFTsV3" ? "IOpenNFTsV3Plus" : key;
          // console.log("collectionGetContract", key, abiKey);
          abi = abi.concat(getAbi(keyAbi) as JsonFragment);
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
  if (col1?.balancesOf instanceof Map && col2?.balancesOf instanceof Map) {
    collMerged.balancesOf = new Map([...col1.balancesOf, ...col2.balancesOf]);
  }
  return collMerged;
};

const collectionGet = async (chainId: number, address: string, account = ADDRESS_ZERO): Promise<CollectionType> => {
  let collection: CollectionType = { chainId, address };
  if (!(chainId && isAddressNotZero(address) && isAddress(account))) return collection;
  // console.log(`collectionGet ${explorerAddressUrl(chainId, address)}`);

  type TxError = { reason: string };
  try {
    collection = await resolverGetCollection(chainId, address, account);
  } catch (err: unknown) {
    const reason = (err as TxError).reason || "No explicit reason";
    console.error(`ERROR collectionGet: ${reason} => ${explorerAddressUrl(chainId, address)}\n`);
    // console.log( err);
  }
  // console.log(`collectionGet ${keyCollection(chainId, address, account)}\n`, collection);
  return collection;
};

const collectionBurnable = async (chainId: number, address: string): Promise<string> => {
  const { collection } = await collectionGetContract(chainId, address);

  return collection?.version === 4 ? "burn" : "";
};

export { collectionGet, collectionMerge, collectionGetContract, collectionBurnable };
