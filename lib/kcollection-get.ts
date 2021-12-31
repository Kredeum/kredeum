import type { NFTsFactory } from "../solidity/types/NFTsFactory";
import type { IERC165 } from "../solidity/types/IERC165";
import type { OpenNFTs } from "../solidity/types/OpenNFTs";

import type { Provider } from "@ethersproject/abstract-provider";
import type { Collection, CollectionSupports, AbiType } from "./ktypes";

import { Signer, Contract } from "ethers";
import { abis, collectionGetNFTsFactoryAddress } from "./kconfig";

const nftsFactories: Map<number, NFTsFactory> = new Map();

const collectionGetNFTsFactory = (
  chainId: number,
  signerOrProvider: Signer | Provider
): NFTsFactory | undefined => {
  // console.log("collectionGetNFTsFactory", chainId);

  let nftsFactory: NFTsFactory;

  if (chainId && signerOrProvider) {
    nftsFactory = nftsFactories.get(chainId);
    if (!nftsFactory) {
      const nftsFactoryAddress = collectionGetNFTsFactoryAddress(chainId);
      if (nftsFactoryAddress) {
        nftsFactory = new Contract(
          nftsFactoryAddress,
          abis.CloneFactory.abi.concat(abis.NFTsFactory.abi),
          signerOrProvider
        ) as NFTsFactory;
        nftsFactories.set(chainId, nftsFactory);
      }
    }
  }
  return nftsFactory;
};

const collectionGetContract = async (
  chainId: number,
  collection: Collection,
  signerOrProvider: Signer | Provider
): Promise<OpenNFTs | undefined> => {
  // console.log(`collectionGetContract ${collection}`);

  let contract: OpenNFTs | undefined = undefined;

  // TODO : Get supported interfaces via onchain proxy smartcontract
  if (chainId && collection && signerOrProvider) {
    try {
      if (!collection.supports) {
        collection = await collectionGetMetadata(chainId, collection, signerOrProvider);
      }

      let abi: Array<string> = [];

      Object.keys(collection.supports).forEach((key) => {
        const supports = collection.supports[key] as AbiType;
        if (supports) {
          // console.log("supports", key, supports, abis[key].abi);
          abi = abi.concat(abis[key].abi);
        }
      });
      // console.log(abi);
      contract = new Contract(collection.address, abi, signerOrProvider) as OpenNFTs;
    } catch (e) {
      console.error(`ERROR collectionGetContract : ${chainId} ${collection.address}\n`, e);
    }
  }
  return contract;
};

const collectionGet = (chainId: number, collectionAddress: string): Collection => {
  return { chainId, address: collectionAddress };
};

const collectionGetMetadata = async (
  chainId: number,
  collection: Collection,
  signerOrProvider: Signer | Provider
): Promise<Collection> => {
  // console.log("collectionGetMetadata", chainId, collection);

  // TODO : Get supported interfaces via onchain proxy smartcontract
  if (chainId && collection && signerOrProvider) {
    try {
      const supports: CollectionSupports = {};

      const contract = new Contract(
        collection.address,
        abis.ERC165.abi,
        signerOrProvider
      ) as IERC165;

      if (contract) {
        supports.ERC165 = true;

        const waitERC721 = contract.supportsInterface(abis.ERC721.interfaceId);
        const waitERC1155 = contract.supportsInterface(abis.ERC1155.interfaceId);
        [supports.ERC721, supports.ERC1155] = await Promise.all([waitERC721, waitERC1155]);

        if (supports.ERC721) {
          const waitMetadata = contract.supportsInterface(abis.ERC721Metadata.interfaceId);
          const waitEnumerable = contract.supportsInterface(abis.ERC721Enumerable.interfaceId);
          const waitOpenNFTsV2 = contract.supportsInterface(abis.OpenNFTsV2.interfaceId);
          const waitOpenNFTsV3 = contract.supportsInterface(abis.OpenNFTsV3.interfaceId);
          [
            supports.ERC721Metadata,
            supports.ERC721Enumerable,
            supports.OpenNFTsV2,
            supports.OpenNFTsV3
          ] = await Promise.all([waitMetadata, waitEnumerable, waitOpenNFTsV2, waitOpenNFTsV3]);
        } else if (supports.ERC1155) {
          supports.ERC1155Metadata_URI = await contract.supportsInterface(
            abis.ERC1155Metadata_URI.interfaceId
          );
        }
        collection.supports = supports;
      }
    } catch (e) {
      console.error(`ERROR collectionGetContract : ${chainId} ${collection.address}\n`, e);
    }
  }
  // console.log("collectionGetMetadata", collection);
  return collection;
};

export { collectionGetContract, collectionGetMetadata, collectionGet, collectionGetNFTsFactory };
export type { NFTsFactory };
