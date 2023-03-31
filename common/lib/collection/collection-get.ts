import { Contract, Provider, Signer, Typed, ZeroAddress } from "ethers";

import type { CollectionType, ABIS } from "@lib/common/types";
import { abis } from "@lib/common/abis";
import { resolverGetCollection } from "@lib/resolver/resolver-get-collection";
import { providerGetSignerOrProvider } from "@lib/common/provider-get";
import { keyCollectionContract, keyCollection } from "@lib/common/keys";
import { getChecksumAddress, isAddressNotZero } from "@lib/common/config";
import { isAddress } from "ethers";

// Cache contracts(chainId,address,getSigner)
const contractsCache: Map<string, Contract> = new Map();

const collectionGetContract = async (
  chainId: number,
  address: string,
  getSigner = false
): Promise<{ contract?: Contract; collection: CollectionType; signer?: string }> => {
  // console.log(`collectionGetContract  IN ${keyCollection(chainId, address)}\n`);
  let signerOrProvider: Signer | Provider | undefined;
  let signer: string = ZeroAddress;

  const collection = await collectionGet(chainId, address);
  if (!(chainId && address && address != ZeroAddress)) return { collection };

  if (getSigner) {
    signerOrProvider = (await providerGetSignerOrProvider(chainId, true)) as Signer;
    signer = getChecksumAddress(await signerOrProvider?.getAddress());
  }
  // console.log("signerOrProvider1:", signerOrProvider);
  // console.log("collectionGetContract:", signer);

  let contract = contractsCache.get(keyCollectionContract(chainId, address, signer));
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
    signerOrProvider ||= await providerGetSignerOrProvider(chainId);
    contract = new Contract(address, abi, signerOrProvider);

    contractsCache.set(keyCollectionContract(chainId, address, signer), contract);
  }

  // console.log(`collectionGetContract OUT ${keyCollectionContract(chainId, address, signer)}\n`, collection, contract);
  return { contract, collection, signer };
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

const collectionGet = async (chainId: number, address: string, account = ZeroAddress): Promise<CollectionType> => {
  let collection: CollectionType = { chainId, address };
  if (!(chainId && isAddressNotZero(address) && isAddress(account))) return collection;

  // console.log(`collectionGet ${keyCollection(chainId, address, account)}\n`);
  // console.log(`collectionGet ${account}\n`);

  type TxError = { reason: string };
  try {
    collection = await resolverGetCollection(chainId, address, account);
  } catch (err: unknown) {
    if ((err as TxError).reason == "Not ERC165")
      console.info(`COLLECTION NOT ERC165 ${keyCollection(chainId, address, account)}`);
    else
      console.error(
        `ERROR collectionGet ${(err as TxError).reason} ${keyCollection(chainId, address, account)}\n`,
        err
      );
  }
  // console.log(`collectionGet ${keyCollection(chainId, address, account)}\n`, collection);
  return collection;
};

const collectionBurnable = async (chainId: number, address: string): Promise<string> => {
  const { collection } = await collectionGetContract(chainId, address);

  return collection?.version === 4 ? "burn" : "";
};

export { collectionGet, collectionMerge, collectionGetContract, collectionBurnable };
