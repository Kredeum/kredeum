import type { Provider } from "@ethersproject/abstract-provider";
import type { Collection, ABIS } from "./ktypes";

import { Signer, Contract } from "ethers";
import { collectionGetSupportedInterfaces } from "./kcollection-get-supports";
import { cacheCollectionGet } from "./kcache";

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

const collectionGet = async (
  chainId: number,
  collectionOrAddress: Collection | string,
  signerOrProvider?: Signer | Provider
): Promise<Collection> => {
  // console.log(`collectionGet ${chainId}`, collectionOrAddress);

  let collection: Collection | undefined = undefined;

  // TODO : Get supported interfaces via onchain proxy smartcontract
  if (typeof collectionOrAddress === "string") {
    collection = { chainId, address: collectionOrAddress };
  } else {
    collection = collectionOrAddress;
  }

  if (!collection.supports && signerOrProvider) {
    try {
      const supported = await collectionGetSupportedInterfaces(chainId, collection.address, signerOrProvider);
      Object.assign(collection, supported);
    } catch (e) {
      console.error(`ERROR collectionGet : ${chainId} ${collection.address}\n`, e);
    }
  }
  // console.log(`collectionGet ${chainId}`, collection);
  return collection;
};

const collectionGetContract = async (
  chainId: number,
  collectionOrAddress: Collection | string,
  signerOrProvider: Signer | Provider
): Promise<Contract> => {
  // console.log(`collectionGetContract ${chainId}`, collectionOrAddress);

  let abi: Array<string> = [];
  let collection: Collection;

  if (typeof collectionOrAddress === "string") {
    collection = { chainId, address: collectionOrAddress };
  } else {
    collection = collectionOrAddress;
  }

  const collectionSupports = collection.supports
    ? collection.supports
    : (await collectionGetSupportedInterfaces(chainId, collection.address, signerOrProvider)).supports;
  // console.log("collectionSupports", collectionSupports);

  for (const [key, supports] of Object.entries(collectionSupports)) {
    if (supports) {
      // console.log(  key, abis[key as ABIS]);
      abi = abi.concat(abis[key as ABIS]);
    }
  }
  // console.log("abi", abi);
  const contract = new Contract(collection.address, abi, signerOrProvider);

  // console.log("collectionGetContract", contract);
  return contract;
};

const collectionGetFromCache = (chainId: number, collection: string): Collection =>
  cacheCollectionGet(chainId, collection);

export { collectionGet, collectionGetContract, collectionGetFromCache };
