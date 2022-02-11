import type { IERC165 } from "../types/IERC165";
import type { OpenNFTs } from "../types/OpenNFTs";

import type { Provider } from "@ethersproject/abstract-provider";
import type { Collection, CollectionSupports, AbiType, ErcKeys, OpenNFTsKeys } from "./ktypes";

import { Signer, Contract } from "ethers";
import { abis } from "./kconfig";

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
    let contract: IERC165;

    // Suppose supports ERC165, should revert otherwise
    supports.ERC165 = true;

    if (typeof collectionOrAddress === "string") {
      collectionAddress = collectionOrAddress;
    } else {
      collectionAddress = collectionOrAddress.address;
    }

    try {
      contract = new Contract(collectionAddress, abis.ERC165.abi, signerOrProvider) as IERC165;

      const waitERC721 = contract.supportsInterface(abis.ERC721.interfaceId || "");
      const waitERC1155 = contract.supportsInterface(abis.ERC1155.interfaceId || "");
      [supports.ERC721, supports.ERC1155] = await Promise.all([waitERC721, waitERC1155]);

      if (supports.ERC721) {
        const waitMetadata = contract.supportsInterface(abis.ERC721Metadata.interfaceId || "");
        const waitEnumerable = contract.supportsInterface(abis.ERC721Enumerable.interfaceId || "");
        const waitOpenNFTsV2 = contract.supportsInterface(abis.OpenNFTsV2.interfaceId || "");
        const waitOpenNFTsV3 = contract.supportsInterface(abis.OpenNFTsV3.interfaceId || "");

        [supports.ERC721Metadata, supports.ERC721Enumerable, supports.OpenNFTsV2, supports.OpenNFTsV3] =
          await Promise.all([waitMetadata, waitEnumerable, waitOpenNFTsV2, waitOpenNFTsV3]);
      } else if (supports.ERC1155) {
        supports.ERC1155Metadata_URI = await contract.supportsInterface(abis.ERC1155Metadata_URI.interfaceId || "");
      }
      supports.OpenNFTsV1 = Boolean(openNFTsV1Addresses.includes(contract.address));

      supports.OpenNFTs = supports.OpenNFTsV1 || supports.OpenNFTsV2 || supports.OpenNFTsV3;
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

  let collection: Collection;

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
  signerOrProvider?: Signer | Provider
): Promise<OpenNFTs | undefined> => {
  // console.log(`collectionGetContract ${chainId}`, collectionOrAddress);

  let collection: Collection;
  let contract: OpenNFTs | undefined;
  let abi: Array<string> = [];

  if (chainId && collectionOrAddress && signerOrProvider) {
    if (typeof collectionOrAddress === "string") {
      collection = { chainId, address: collectionOrAddress };
    } else {
      collection = collectionOrAddress;
    }

    const collectionSupports = collection.supports
      ? collection.supports
      : await collectionGetSupportedInterfaces(chainId, collection.address, signerOrProvider);

    for (const [key, supports] of Object.entries(collectionSupports)) {
      if (supports) {
        abi = abi.concat(abis[key as ErcKeys | OpenNFTsKeys].abi);
      }

      try {
        contract = new Contract(collection.address, abi, signerOrProvider) as OpenNFTs;
      } catch (e) {
        console.error(`ERROR collectionGetContract : ${chainId} ${collection.address}\n`, e);
      }
    }
  }
  // console.log("collectionGetContract", contract);
  return contract;
};

export { collectionGet, collectionGetContract, collectionGetSupportedInterfaces };
