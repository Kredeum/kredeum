import type { Provider } from "@ethersproject/abstract-provider";
import type { Signer } from "@ethersproject/abstract-signer";
import { constants } from "ethers";

import type { CollectionType } from "@lib/common/ktypes";
import { collectionKey } from "@lib/common/kconfig";
import { resolverConvOpenNFTsCollectionInfos } from "@lib/resolver/resolver-conv-collection-infos";
import { resolverGetContract } from "@lib/resolver/resolver-get";

const resolverGetCollection = async (
  chainId: number,
  address: string,
  signerOrProvider: Signer | Provider,
  account = constants.AddressZero
): Promise<CollectionType> => {
  // console.log("resolverGetCollection", address);

  const nftsResolver = await resolverGetContract(chainId, signerOrProvider);

  const collectionInfos = await nftsResolver.getOpenNFTsCollectionInfos(address, account);

  return resolverConvOpenNFTsCollectionInfos(chainId, collectionInfos, account);
};

const resolverFilterCollectionsAddress = async (
  chainId: number,
  collections: Array<string>,
  signerOrProvider: Signer | Provider
): Promise<Array<string>> => {
  const checks = await resolverAreCollections(chainId, collections, signerOrProvider);

  return collections.filter((coll, index) => checks[index]);
};

const resolverFilterCollections = async (
  chainId: number,
  collections: Map<string, CollectionType>,
  signerOrProvider: Signer | Provider
): Promise<Map<string, CollectionType>> => {
  const collectionsAddress = Array.from(collections, ([, coll]) => coll.address);
  const checks = await resolverAreCollections(chainId, collectionsAddress, signerOrProvider);

  for (let i = 0; i < checks.length; i++) {
    if (!checks[i]) collections.delete(collectionKey(chainId, collectionsAddress[i]));
  }

  return collections;
};

const resolverAreCollections = async (
  chainId: number,
  collections: Array<string>,
  signerOrProvider: Signer | Provider
): Promise<Array<boolean>> => {
  // console.log("resolverAreCollections", chainId, collections);

  const nftsResolver = await resolverGetContract(chainId, signerOrProvider);

  const checks = await nftsResolver.isCollections(collections);
  // console.log("resolverAreCollections", collections, checks);

  return checks;
};

const resolverGetCollectionList = async (
  chainId: number,
  signerOrProvider: Signer | Provider,
  account = constants.AddressZero
): Promise<Map<string, CollectionType>> => {
  // console.log(`resolverGetCollectionList ${collectionListKey(chainId, account)}\n`, chainId, account);

  const collections: Map<string, CollectionType> = new Map();

  const nftsResolver = await resolverGetContract(chainId, signerOrProvider);

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
    collections.set(collectionKey(chainId, collection.address), collection);
  }

  // console.log(`resolverGetCollectionList ${collectionListKey(chainId, account)}\n`, collections);
  return collections;
};

export {
  resolverGetCollectionList,
  resolverGetCollection,
  resolverAreCollections,
  resolverFilterCollections,
  resolverFilterCollectionsAddress
};
