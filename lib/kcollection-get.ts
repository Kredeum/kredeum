import type { NFTsFactory } from "../solidity/types/NFTsFactory";
import type { IERC165 } from "../solidity/types/IERC165";
import type { OpenNFTs } from "../solidity/types/OpenNFTs";

import type { Provider } from "@ethersproject/abstract-provider";
import type { Collection, CollectionSupports, AbiType, Address } from "./ktypes";

import { Signer, Contract } from "ethers";
import { abis, getChecksumAddress, getNetwork, explorerContractUrl } from "./kconfig";

const nftsFactories: Map<number, NFTsFactory> = new Map();

// GET openNFTs via onchain call
const getOpenNFTsAddress = async (chainId: number, provider: Provider): Promise<Address | undefined> => {
  const nftsFactory = collectionGetNFTsFactory(chainId, provider);
  const template = await nftsFactory.template();
  return template ? template : "";
};

// GET NFTs Factory
const collectionGetNFTsFactoryAddress = (chainId: number): Address | undefined =>
  getChecksumAddress(getNetwork(chainId)?.nftsFactory);

const collectionGetNFTsFactory = (chainId: number, signerOrProvider: Signer | Provider): NFTsFactory | undefined => {
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

// NFTS_FACTORY URL
const explorerNFTsFactoryUrl = (chainId: number): string =>
  // https://blockscout.com/xdai/mainnet/address/0x86246ba8F7b25B1650BaF926E42B66Ec18D96000/read-contract
  // https://etherscan.io/address/0x4b7992F03906F7bBE3d48E5Fb724f52c56cFb039#readContract
  explorerContractUrl(chainId, collectionGetNFTsFactoryAddress(chainId));

// OPEN_NFTS URL
const explorerOpenNFTsUrl = async (chainId: number, provider: Provider): Promise<string> =>
  // https://etherscan.io/address/0x82a398243EBc2CB26a4A21B9427EC6Db8c224471#readContract
  explorerContractUrl(chainId, await getOpenNFTsAddress(chainId, provider));
/////////////////////////////////////////////////////////////////////////////////////////////////////

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
        collection = await collectionGetSupportedInterfaces(chainId, collection, signerOrProvider);
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

const collectionGetSupportedInterfaces = async (
  chainId: number,
  collection: Collection,
  signerOrProvider: Signer | Provider
): Promise<Collection> => {
  // console.log("collectionGetSupportedInterfaces", chainId, collection);

  const openNFTsV1 = {
    1: ["0x82a398243EBc2CB26a4A21B9427EC6Db8c224471"],
    137: ["0xbEaAb0f00D236862527dcF5a88dF3CEd043ab253", "0xF6d53C7e96696391Bb8e73bE75629B37439938AF"]
  };

  // TODO : Get supported interfaces via onchain proxy smartcontract
  if (chainId && collection && signerOrProvider) {
    try {
      const supports: CollectionSupports = {};

      const contract = new Contract(collection.address, abis.ERC165.abi, signerOrProvider) as IERC165;

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
          [supports.ERC721Metadata, supports.ERC721Enumerable, supports.OpenNFTsV2, supports.OpenNFTsV3] =
            await Promise.all([waitMetadata, waitEnumerable, waitOpenNFTsV2, waitOpenNFTsV3]);
        } else if (supports.ERC1155) {
          supports.ERC1155Metadata_URI = await contract.supportsInterface(abis.ERC1155Metadata_URI.interfaceId);
        }
        const adresses = (openNFTsV1[chainId] || []) as Array<string>;
        supports.OpenNFTsV1 = Boolean(adresses.includes(collection.address));

        collection.supports = supports;
      }
    } catch (e) {
      console.error(`ERROR collectionGetContract : ${chainId} ${collection.address}\n`, e);
    }
  }
  // console.log("collectionGetSupportedInterfaces", collection);
  return collection;
};

export {
  collectionGetContract,
  collectionGetSupportedInterfaces,
  collectionGet,
  collectionGetNFTsFactory,
  collectionGetNFTsFactoryAddress,
  explorerOpenNFTsUrl,
  explorerNFTsFactoryUrl,
  getOpenNFTsAddress
};
export type { NFTsFactory };
