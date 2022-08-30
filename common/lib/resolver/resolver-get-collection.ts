import type { Provider } from "@ethersproject/abstract-provider";
import type {Signer } from "@ethersproject/abstract-signer";
import { constants } from "ethers";

import type { CollectionType } from "@lib/ktypes";
import { collectionListKey, collectionUrl } from "@lib/kconfig";
import { resolverConvOpenNFTsCollectionInfos } from "@lib/resolver/resolver-conv-collection-infos";
import { resolverGetContract } from "@lib/resolver/resolver-get";

const resolverGetCollection = async (
  chainId: number,
  address: string,
  signerOrProvider: Signer | Provider,
  account = constants.AddressZero
): Promise<CollectionType> => {
  console.log("resolverGetCollection", address);

  const nftsResolver = resolverGetContract(chainId, signerOrProvider);

  const collectionInfosStructOutput = await nftsResolver.getOpenNFTsResolverCollectionInfos(address, account);

  return resolverConvOpenNFTsCollectionInfos(chainId, collectionInfosStructOutput, account);
};

const resolverGetCollectionList = async (
  chainId: number,
  signerOrProvider: Signer | Provider,
  account = constants.AddressZero
): Promise<Map<string, CollectionType>> => {
  console.log(`resolverGetCollectionList ${collectionListKey(chainId, account)}\n`, chainId, account);

  const collections: Map<string, CollectionType> = new Map();

  const nftsResolver = resolverGetContract(chainId, signerOrProvider);

  const openNFTsStructOutput = await nftsResolver.getOpenNFTsCollectionsInfos(account);
  console.log("resolverGetCollectionList openNFTsStructOutput", openNFTsStructOutput);

  for (let index = 0; index < openNFTsStructOutput.length; index++) {
    const collection = resolverConvOpenNFTsCollectionInfos(chainId, openNFTsStructOutput[index], account);
    collections.set(collectionUrl(chainId, collection.address), collection);
  }

  console.log(`resolverGetCollectionList ${collectionListKey(chainId, account)}\n`, collections);
  return collections;
};

export { resolverGetCollectionList, resolverGetCollection };
