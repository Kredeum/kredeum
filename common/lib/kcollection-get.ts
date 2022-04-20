import type { Provider } from "@ethersproject/abstract-provider";
import type { CollectionType, ABIS } from "./ktypes";

import { Contract } from "ethers";
import { collectionGetOtherData, collectionGetSupports } from "./kcollection-get-metadata";
import { isProviderOnChainId, collectionKey } from "./kconfig";

import IERC165 from "abis/IERC165.json";
import IERC721 from "abis/IERC721.json";
import IERC721Enumerable from "abis/IERC721Enumerable.json";
import IERC721Metadata from "abis/IERC721Metadata.json";
import IERC1155 from "abis/IERC1155.json";
import IERC1155MetadataURI from "abis/IERC1155MetadataURI.json";
import IERC173 from "abis/IERC173.json";

import IOpenNFTs from "abis/IOpenNFTs.json";
import IOpenNFTsV0 from "abis/IOpenNFTsV0.json";
import IOpenNFTsV1 from "abis/IOpenNFTsV1.json";
import IOpenNFTsV2 from "abis/IOpenNFTsV2.json";
import IOpenNFTsV3 from "abis/IOpenNFTsV3.json";

const abis = {
  IERC165,
  IERC721,
  IERC721Enumerable,
  IERC721Metadata,
  IERC1155,
  IERC173,
  IERC1155MetadataURI,
  IOpenNFTs,
  IOpenNFTsV0,
  IOpenNFTsV1,
  IOpenNFTsV2,
  IOpenNFTsV3
};

const collectionContractGet = async (
  chainId: number,
  address: string,
  provider: Provider,
  collection: CollectionType = { chainId, address }
): Promise<Contract> => {
  // console.log(`collectionContractGet ${collectionKey(chainId, address)}\n`);

  let abi: Array<string> = [];

  if (!("supports" in collection)) await collectionGetSupports(chainId, address, provider, collection);
  // console.log("collectionSupports", collectionSupports);

  for (const [key, supports] of Object.entries(collection.supports || {})) {
    if (supports) {
      // console.log(  key, abis[key as ABIS]);
      abi = abi.concat(abis[key as ABIS]);
    }
  }
  // console.log("abi", abi);
  const contract = new Contract(address, abi, provider);

  console.log(`collectionContractGet ${collectionKey(chainId, address)}\n`, contract);
  return contract;
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
    await collectionGetSupports(chainId, address, provider, collection);
    await collectionGetOtherData(chainId, address, provider, account, collection);
  } catch (e) {
    console.error(`ERROR collectionGet  ${collectionKey(chainId, address, account)}\n`, e);
  }
  // console.log(`collectionGet ${collectionKey(chainId, address, account)}\n`, collection);
  return collection;
};

export { collectionGet, collectionMerge, collectionContractGet };
