import type { Provider } from "@ethersproject/abstract-provider";
import { Contract, constants } from "ethers";

import type { CollectionSupports, CollectionType } from "@lib/ktypes";
import { abis } from "@lib/kabis";
import {
  getNetwork,
  getChainName,
  getChecksumAddress,
  explorerContractUrl,
  interfaceId,
  DEFAULT_NAME,
  DEFAULT_SYMBOL
} from "@lib/kconfig";

import { resolverGetSupports } from "@lib/kresolver-get-supports";

import type { NFTsResolver } from "@soltypes/contracts/next";
import abiNFTsResolver from "@abis/contracts/next/NFTsResolver.sol/NFTsResolver.json";

import { IERC721Infos } from "@soltypes/contracts/next/NFTsResolver";
import { count } from "console";

// Cache nftsResolver contract (chainId)
const _nftsResolversCache: Map<number, Contract> = new Map();

// GET NFTsResolver Contract
const resolverGetContract = (chainId: number, provider: Provider): NFTsResolver => {
  // console.log("resolverGetContract", chainId);

  let nftsResolver = _nftsResolversCache.get(chainId);
  if (!nftsResolver) {
    nftsResolver = new Contract(resolverGetAddress(chainId), abiNFTsResolver, provider);
    _nftsResolversCache.set(chainId, nftsResolver);
  }

  // console.log("nftsResolver", nftsResolver);
  return nftsResolver as NFTsResolver;
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
  // console.log("resolverGetCollectionFromCollectionInfos  IN", chainId, collectionInfos, account);

  const chainName = getChainName(chainId);
  const address: string = getChecksumAddress(collectionInfos[0]);
  const owner: string = getChecksumAddress(collectionInfos[1]);
  const name: string = collectionInfos[2] || DEFAULT_NAME;
  const symbol: string = collectionInfos[3] || DEFAULT_SYMBOL;
  const totalSupply = Number(collectionInfos[4]);
  const balancesOf = new Map([[account, Number(collectionInfos[5])]]);
  const supports = resolverGetSupports(collectionInfos[6]);

  const collection = { chainId, chainName, address, owner, name, symbol, totalSupply, balancesOf, supports };

  // console.log("resolverGetCollectionFromCollectionInfos OUT", collection);
  return collection;
};

const resolverGetCollectionsInfos = async (
  chainId: number,
  provider: Provider,
  account = constants.AddressZero
): Promise<Array<CollectionType>> => {
  // console.log("resolverGetCollectionInfos", address);
  const collections: Array<CollectionType> = [];

  const nftsResolver = resolverGetContract(chainId, provider);

  const collectionsInfosStructOutput = await nftsResolver.getNFTsResolverCollectionsInfos(account);
  console.log("resolverGetCollectionsInfos collectionsInfosStructOutput", collectionsInfosStructOutput);

  for (let index = 0; index < collectionsInfosStructOutput.length; index++) {
    collections[index] = resolverGetCollectionFromCollectionInfos(
      chainId,
      collectionsInfosStructOutput[index],
      account
    );
  }

  return collections;
};

const resolverGetCount = async (chainId: number, provider: Provider): Promise<number> => {
  const nftsResolver = resolverGetContract(chainId, provider);

  const count = await nftsResolver.countAddresses();

  return Number(count);
};

export {
  resolverGetCount,
  resolverGetCollectionsInfos,
  resolverGetAddress,
  resolverGetContract,
  resolverGetExplorerUrl,
  resolverGetCollectionFromCollectionInfos
};
