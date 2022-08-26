import type { Provider } from "@ethersproject/abstract-provider";
import { constants } from "ethers";

import type { CollectionType } from "@lib/ktypes";
import { collectionListKey, collectionUrl } from "@lib/kconfig";
import { resolverConvOpenNFTsCollectionInfos } from "@lib/resolver/resolver-conv-collection-infos";
import { resolverGetContract } from "@lib/resolver/resolver-get";

const resolverGetCollection = async (
  chainId: number,
  address: string,
  provider: Provider,
  account = constants.AddressZero
): Promise<CollectionType> => {
  console.log("resolverGetCollection", address);

  const nftsResolver = resolverGetContract(chainId, provider);

  const collectionInfosStructOutput = await nftsResolver.getOpenNFTsResolverCollectionInfos(address, account);

  return resolverConvOpenNFTsCollectionInfos(chainId, collectionInfosStructOutput, account);
};

const resolverGetCollectionList = async (
  chainId: number,
  provider: Provider,
  account = constants.AddressZero
): Promise<Map<string, CollectionType>> => {
  console.log(`resolverGetCollectionList ${collectionListKey(chainId, account)}\n`, chainId, account);

  const collections: Map<string, CollectionType> = new Map();

  const nftsResolver = resolverGetContract(chainId, provider);

  const openNFTsStructOutput = await nftsResolver.getOpenNFTsResolverCollectionsInfos(account);
  console.log("resolverGetCollectionList openNFTsStructOutput", openNFTsStructOutput);

  for (let index = 0; index < openNFTsStructOutput.length; index++) {
    const collection = resolverConvOpenNFTsCollectionInfos(chainId, openNFTsStructOutput[index], account);
    collections.set(collectionUrl(chainId, collection.address), collection);
  }

  console.log(`resolverGetCollectionList ${collectionListKey(chainId, account)}\n`, collections);
  return collections;
};

export { resolverGetCollectionList, resolverGetCollection };
