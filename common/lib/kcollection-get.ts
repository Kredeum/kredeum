import type { ERC165 } from "../types/ERC165";
import type { OpenNFTsV3 } from "../types/OpenNFTsV3";

import type { Provider } from "@ethersproject/abstract-provider";
import type { Collection, CollectionSupports, ABIS } from "./ktypes";
import { interfaceId } from "./kconfig";

import { Signer, Contract } from "ethers";

import IERC165 from "abis/erc/IERC165.json";
import IERC721 from "abis/erc/IERC721.json";
import IERC721Enumerable from "abis/erc/IERC721Enumerable.json";
import IERC721Metadata from "abis/erc/IERC721Metadata.json";
import IERC1155 from "abis/erc/IERC1155.json";
import IERC1155MetadataURI from "abis/erc/IERC1155MetadataURI.json";

import IOpenNFTs from "abis/new/IOpenNFTs.json";
import IOpenNFTsV1 from "abis/deployed/IOpenNFTsV1.json";
import IOpenNFTsV2 from "abis/deployed/IOpenNFTsV2.json";
import IOpenNFTsV3 from "abis/new/IOpenNFTsV3.json";

const abis = {
  IERC165,
  IERC721,
  IERC721Enumerable,
  IERC721Metadata,
  IERC1155,
  IERC1155MetadataURI,
  IOpenNFTs,
  IOpenNFTsV1,
  IOpenNFTsV2,
  IOpenNFTsV3
};

const collectionGetSupportedInterfaces = async (
  chainId: number,
  collectionOrAddress: Collection | string,
  signerOrProvider: Signer | Provider
): Promise<CollectionSupports> => {
  // console.log(`collectionGetSupportedInterfaces ${chainId}`, collectionOrAddress);

  const openNFTsV1Addresses = [
    "0x82a398243EBc2CB26a4A21B9427EC6Db8c224471",
    "0xbEaAb0f00D236862527dcF5a88dF3CEd043ab253",
    "0xF6d53C7e96696391Bb8e73bE75629B37439938AF"
  ];
  const supports: CollectionSupports = {};
  let collectionAddress: string;

  // TODO : Get supported interfaces via onchain proxy smartcontract
  if (chainId && collectionOrAddress && signerOrProvider) {
    let contract: ERC165;

    // Suppose supports ERC165, should revert otherwise
    supports.IERC165 = true;

    if (typeof collectionOrAddress === "string") {
      collectionAddress = collectionOrAddress;
    } else {
      collectionAddress = collectionOrAddress.address;
    }

    try {
      contract = new Contract(collectionAddress, IERC165, signerOrProvider) as ERC165;

      const waitERC721 = contract.supportsInterface(interfaceId(IERC721));
      const waitERC1155 = contract.supportsInterface(interfaceId(IERC1155));
      [supports.IERC721, supports.IERC1155] = await Promise.all([waitERC721, waitERC1155]);

      if (supports.IERC721) {
        const waitMetadata = contract.supportsInterface(interfaceId(IERC721Metadata));
        const waitEnumerable = contract.supportsInterface(interfaceId(IERC721Enumerable));
        const waitOpenNFTsV2 = contract.supportsInterface(interfaceId(IOpenNFTsV2));
        const waitOpenNFTsV3 = contract.supportsInterface(interfaceId(IOpenNFTsV3));

        [supports.IERC721Metadata, supports.IERC721Enumerable, supports.IOpenNFTsV2, supports.IOpenNFTsV3] =
          await Promise.all([waitMetadata, waitEnumerable, waitOpenNFTsV2, waitOpenNFTsV3]);
      } else if (supports.IERC1155) {
        supports.IERC1155MetadataURI = await contract.supportsInterface(interfaceId(IERC1155MetadataURI));
      }
      if (supports.IOpenNFTsV3) {
        supports.IOpenNFTs = true;
      }
      supports.IOpenNFTsV1 = Boolean(openNFTsV1Addresses.includes(contract.address));
    } catch (e) {
      console.error(`ERROR collectionGetSupportedInterfaces : ${chainId} ${collectionAddress}\n`, e);
    }
  }
  // console.log("collectionGetSupportedInterfaces", supports);
  return supports;
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
      collection.supports = await collectionGetSupportedInterfaces(chainId, collection.address, signerOrProvider);
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
    : await collectionGetSupportedInterfaces(chainId, collection.address, signerOrProvider);
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

export { collectionGet, collectionGetContract, collectionGetSupportedInterfaces };
