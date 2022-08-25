import type { Provider } from "@ethersproject/abstract-provider";
import { Contract, constants } from "ethers";

import type { CollectionType } from "@lib/ktypes";
import { resolverChecksToSupports } from "@lib/kresolver-checks-to-supports";
import {
  collectionListKey,
  collectionUrl,
  getNetwork,
  getChainName,
  getChecksumAddress,
  explorerContractUrl,
  DEFAULT_NAME,
  DEFAULT_SYMBOL
} from "@lib/kconfig";

import type { OpenNFTsResolver } from "@soltypes/contracts/next/OpenNFTsResolver";
import { IOpenNFTsInfos, IERC721Infos } from "@soltypes/contracts/next/OpenNFTsResolver";
import abiOpenNFTsResolver from "@abis/contracts/next/OpenNFTsResolver.sol/OpenNFTsResolver.json";

// Cache nftsResolver contract (chainId)
const _nftsResolversCache: Map<number, Contract> = new Map();

// GET OpenNFTsResolver Contract
const resolverGetContract = (chainId: number, provider: Provider): OpenNFTsResolver => {
  // console.log("resolverGetContract", chainId);

  let nftsResolver = _nftsResolversCache.get(chainId);
  if (!nftsResolver) {
    nftsResolver = new Contract(resolverGetAddress(chainId), abiOpenNFTsResolver, provider);
    _nftsResolversCache.set(chainId, nftsResolver);
  }

  // console.log("nftsResolver", nftsResolver);
  return nftsResolver as OpenNFTsResolver;
};

//  GET nftsResolver address
const resolverGetAddress = (chainId: number): string => getNetwork(chainId)?.nftsResolver || "";

// GET nftsResolver explorer URL
const resolverGetExplorerUrl = (chainId: number): string => explorerContractUrl(chainId, resolverGetAddress(chainId));

const resolverGetCollectionFromCollectionInfos = (
  chainId: number,
  collectionInfos: IERC721Infos.CollectionInfosStructOutput,
  account = constants.AddressZero
): CollectionType => {
  console.log("resolverGetCollectionFromCollectionInfos  IN", chainId, collectionInfos, account);

  const chainName = getChainName(chainId);
  const address: string = getChecksumAddress(collectionInfos[0]);
  const owner: string = getChecksumAddress(collectionInfos[1]);
  const name: string = collectionInfos[2] || DEFAULT_NAME;
  const symbol: string = collectionInfos[3] || DEFAULT_SYMBOL;
  const totalSupply = Number(collectionInfos[4]);
  const balancesOf = new Map([[account, Number(collectionInfos[5])]]);
  const supports = resolverChecksToSupports(collectionInfos[6]);

  const collection = { chainId, chainName, address, owner, name, symbol, totalSupply, balancesOf, supports };

  console.log("resolverGetCollectionFromCollectionInfos OUT", collection);
  return collection;
};

const resolverGetCollectionFromOpenNFTsCollectionInfos = (
  chainId: number,
  openNFTs: IOpenNFTsInfos.OpenNFTsCollectionInfosStructOutput,
  account = constants.AddressZero
): CollectionType => {
  console.log("resolverGetCollectionFromOpenNFTsCollectionInfos openNFTs IN", openNFTs);

  const collection = resolverGetCollectionFromCollectionInfos(chainId, openNFTs[0], account);

  collection.version = Number(openNFTs[1] || -1);
  collection.template = openNFTs[2] || "";
  collection.open = openNFTs[3] || false;

  console.log("resolverGetCollectionFromOpenNFTsCollectionInfos collection OUT", collection);
  return collection;
};

const resolverGetCollectionInfos = async (
  chainId: number,
  address: string,
  provider: Provider,
  account = constants.AddressZero
): Promise<CollectionType> => {
  console.log("resolverGetCollectionInfos", address);

  const nftsResolver = resolverGetContract(chainId, provider);

  const collectionInfosStructOutput = await nftsResolver.getOpenNFTsResolverCollectionInfos(address, account);

  return resolverGetCollectionFromOpenNFTsCollectionInfos(chainId, collectionInfosStructOutput, account);
};

const resolverGetCollectionsInfos = async (
  chainId: number,
  provider: Provider,
  account = constants.AddressZero
): Promise<Array<CollectionType>> => {
  // console.log("resolverGetCollectionsInfos", account);
  const collections: Array<CollectionType> = [];

  const nftsResolver = resolverGetContract(chainId, provider);

  const openNFTsStructOutput = await nftsResolver.getOpenNFTsResolverCollectionsInfos(account);
  console.log("resolverGetCollectionsInfos openNFTsStructOutput", openNFTsStructOutput);

  for (let index = 0; index < openNFTsStructOutput.length; index++) {
    collections[index] = resolverGetCollectionFromOpenNFTsCollectionInfos(
      chainId,
      openNFTsStructOutput[index],
      account
    );
  }

  return collections;
};

const resolverGetCount = async (chainId: number, provider: Provider): Promise<number> => {
  const nftsResolver = resolverGetContract(chainId, provider);

  return Number(await nftsResolver.countAddresses());
};

const resolverGetCollectionList = async (
  chainId: number,
  provider: Provider,
  account = constants.AddressZero
): Promise<Map<string, CollectionType>> => {
  console.log(`resolverGetCollectionList ${collectionListKey(chainId, account)}\n`, chainId, account);

  const collections: Map<string, CollectionType> = new Map();

  const nftsResolver = resolverGetContract(chainId, provider);
  const openNFTsStructOutput: Array<IOpenNFTsInfos.OpenNFTsCollectionInfosStructOutput> =
    await nftsResolver.getOpenNFTsResolverCollectionsInfos(account);

  console.log("resolverGetCollectionList openNFTsStructOutput", openNFTsStructOutput);

  for (let index = 0; index < openNFTsStructOutput.length; index++) {
    const collection = resolverGetCollectionFromOpenNFTsCollectionInfos(chainId, openNFTsStructOutput[index], account);
    collections.set(collectionUrl(chainId, collection.address), collection);
  }

  console.log(`resolverGetCollectionList ${collectionListKey(chainId, account)}\n`, collections);
  return collections;
};

export {
  resolverGetCount,
  resolverGetCollectionList,
  resolverGetCollectionInfos,
  resolverGetCollectionsInfos,
  resolverGetAddress,
  resolverGetContract,
  resolverGetExplorerUrl,
  resolverGetCollectionFromCollectionInfos,
  resolverGetCollectionFromOpenNFTsCollectionInfos
};
