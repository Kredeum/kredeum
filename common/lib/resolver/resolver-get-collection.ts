import { constants } from "ethers";

import type { CollectionType } from "@lib/common/types";
import { resolverConvOpenNFTsCollectionInfos } from "@lib/resolver/resolver-conv-collection-infos";
import { resolverGetContract } from "@lib/resolver/resolver-get";
import { keyCollection } from "@lib/common/keys";

const resolverGetCollection = async (
  chainId: number,
  address: string,
  account = constants.AddressZero
): Promise<CollectionType> => {
  console.log("resolverGetCollection", chainId, address, account);

  const nftsResolver = await resolverGetContract(chainId);

  const collectionInfos = await nftsResolver.getOpenNFTsCollectionInfos(address, account);
  // console.log("collectionInfos", collectionInfos);

  return resolverConvOpenNFTsCollectionInfos(chainId, collectionInfos, account);
};

const resolverFilterCollectionsAddress = async (
  chainId: number,
  collections: Array<string>
): Promise<Array<string>> => {
  const checks = await resolverAreCollections(chainId, collections);

  return collections.filter((coll, index) => checks[index]);
};

const resolverFilterCollections = async (
  chainId: number,
  collections: Map<string, CollectionType>
): Promise<Map<string, CollectionType>> => {
  const collectionsAddress = Array.from(collections, ([, coll]) => coll.address);
  const checks = await resolverAreCollections(chainId, collectionsAddress);

  for (let i = 0; i < checks.length; i++) {
    if (!checks[i]) collections.delete(keyCollection(chainId, collectionsAddress[i]));
  }

  return collections;
};

const resolverAreCollections = async (chainId: number, collections: Array<string>): Promise<Array<boolean>> => {
  // console.log("resolverAreCollections", chainId, collections);

  const nftsResolver = await resolverGetContract(chainId);

  const checks = await nftsResolver.isCollections(collections);
  // console.log("resolverAreCollections", collections, checks);

  return checks;
};

const resolverGetCollectionList = async (
  chainId: number,
  account = constants.AddressZero
): Promise<Map<string, CollectionType>> => {
  // console.log(`resolverGetCollectionList ${keyCollectionList(chainId, account)}\n`, chainId, account);

  const collections: Map<string, CollectionType> = new Map();

  const nftsResolver = await resolverGetContract(chainId);

  const collectionInfos = await nftsResolver.getOpenNFTsCollectionsInfos(account);
  // console.log("resolverGetCollectionList openNFTsStructOutput", collectionInfos);

  if (collectionInfos[0].length !== collectionInfos[1].length) {
    console.error("ERROR resolverGetCollectionList", collectionInfos);
  }

  for (let index = 0; index < collectionInfos[0].length; index++) {
    const collection = resolverConvOpenNFTsCollectionInfos(
      chainId,
      [collectionInfos[0][index], collectionInfos[1][index]],
      account
    );
    // console.log("collection", collection);
    collections.set(keyCollection(chainId, collection.address), collection);
  }

  // console.log(`resolverGetCollectionList ${chainId} ${account}\n`, collections);
  return collections;
};

export {
  resolverGetCollectionList,
  resolverGetCollection,
  resolverAreCollections,
  resolverFilterCollections,
  resolverFilterCollectionsAddress
};
