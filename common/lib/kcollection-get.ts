import type { Provider } from "@ethersproject/abstract-provider";
import type { CollectionType, CollectionSupports, ABIS } from "./ktypes";

import { Contract } from "ethers";
import { collectionGetOtherData, collectionGetSupports } from "./kcollection-get-metadata";
import { isProviderOnChainId, collectionKey } from "./kconfig";

import abiERC165 from "abis/IERC165.sol/IERC165.json";
import abiERC721 from "abis/IERC721.sol/IERC721.json";
import abiERC721Enumerable from "abis/IERC721Enumerable.sol/IERC721Enumerable.json";
import abiERC721Metadata from "abis/IERC721Metadata.sol/IERC721Metadata.json";
import abiERC1155 from "abis/IERC1155.sol/IERC1155.json";
import abiERC1155MetadataURI from "abis/IERC1155MetadataURI.sol/IERC1155MetadataURI.json";
import abiERC173 from "abis/IERC173.sol/IERC173.json";

import abiOpenNFTs from "abis/IOpenNFTs.sol/IOpenNFTs.json";
import abiOpenNFTsV0 from "abis/IOpenNFTsV0.sol/IOpenNFTsV0.json";
import abiOpenNFTsV1 from "abis/IOpenNFTsV1.sol/IOpenNFTsV1.json";
import abiOpenNFTsV2 from "abis/IOpenNFTsV2.sol/IOpenNFTsV2.json";
import abiOpenNFTsV3 from "abis/IOpenNFTsV3.sol/IOpenNFTsV3.json";
import abiOpenNFTsV4 from "abis/IOpenNFTsV4.sol/IOpenNFTsV4.json";

const abis = {
  IERC165: abiERC165,
  IERC721: abiERC721,
  IERC721Enumerable: abiERC721Enumerable,
  IERC721Metadata: abiERC721Metadata,
  IERC1155: abiERC1155,
  IERC173: abiERC173,
  IERC1155MetadataURI: abiERC1155MetadataURI,
  IOpenNFTs: abiOpenNFTs,
  IOpenNFTsV0: abiOpenNFTsV0,
  IOpenNFTsV1: abiOpenNFTsV1,
  IOpenNFTsV2: abiOpenNFTsV2,
  IOpenNFTsV3: abiOpenNFTsV3,
  IOpenNFTsV4: abiOpenNFTsV4
};
// Cache contracts(chainId,address)
const contractsCache: Map<string, Contract> = new Map();

const collectionContractGet = async (
  chainId: number,
  address: string,
  provider: Provider,
  collection: CollectionType = { chainId, address }
): Promise<{ contract: Contract; supports: CollectionSupports }> => {
  console.log(`collectionContractGet ${collectionKey(chainId, address)}\n`);

  const supports = await collectionGetSupports(chainId, address, provider, collection);

  let contract = contractsCache.get(collectionKey(chainId, address));
  if (!contract) {
    console.log(`collectionContractGet ${collectionKey(chainId, address)}\n`);

    let abi: Array<string> = [];
    for (const [key, support] of Object.entries(supports || {})) {
      if (support) {
        abi = abi.concat(abis[key as ABIS]);
      }
    }
    contract = new Contract(address, abi, provider);
    contractsCache.set(collectionKey(chainId, address), contract);
  }

  // console.log(`collectionContractGet ${collectionKey(chainId, address)}\n`);
  return { contract, supports };
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
    collection.supports = await collectionGetSupports(chainId, address, provider, collection);
    await collectionGetOtherData(chainId, address, provider, account, collection);
  } catch (e) {
    console.error(`ERROR collectionGet  ${collectionKey(chainId, address, account)}\n`, e);
  }
  // console.log(`collectionGet ${collectionKey(chainId, address, account)}\n`, collection);
  return collection;
};

export { collectionGet, collectionMerge, collectionContractGet, collectionGetSupports };
