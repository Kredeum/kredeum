
import type { CollectionType } from "@kredeum/common/lib/common/types";
import { resolverConvOpenNFTsCollectionInfos } from "@kredeum/common/lib/resolver/resolver-conv-collection-infos";
import { resolverGetContract } from "@kredeum/common/lib/resolver/resolver-get";
import { keyCollection } from "@kredeum/common/lib/common/keys";
import { ADDRESS_ZERO } from "../common/config";
// import { keyCollections } from "@kredeum/common/lib/common/keys";

const resolverGetCollection = async (
  chainId: number,
  address: string,
  account = ADDRESS_ZERO
): Promise<CollectionType> => {
  // console.log("resolverGetCollection", chainId, address, account);

  const nftsResolver = await resolverGetContract(chainId);

  const collectionInfos = await nftsResolver.getOpenNFTsCollectionInfos(address, account);

  const collection = resolverConvOpenNFTsCollectionInfos(chainId, collectionInfos, account);
  // console.log("resolverGetCollection collection:", collection);
  return collection;
};

const resolverFilterCollectionsAddress = async (
  chainId: number,
  collections: Array<string>
): Promise<Array<string>> => {
  const checks = await resolverAreCollections(chainId, collections);
  if (!checks) return collections;

  return collections.filter((coll, index) => checks[index]);
};

const resolverFilterCollections = async (
  chainId: number,
  collections: Map<string, CollectionType>
): Promise<Map<string, CollectionType>> => {
  const collectionsAddress = Array.from(collections, ([, coll]) => coll.address);
  const checks = await resolverAreCollections(chainId, collectionsAddress);
  if (!checks) return collections;

  for (let i = 0; i < checks.length; i++) {
    if (!checks[i]) collections.delete(keyCollection(chainId, collectionsAddress[i]));
  }

  return collections;
};

const resolverAreCollections = async (chainId: number, collections: Array<string>): Promise<Array<boolean> | null> => {
  // console.log("resolverAreCollections", chainId, collections);

  const nftsResolver = await resolverGetContract(chainId);
  if (!nftsResolver) return null;

  const checks = await nftsResolver?.isCollections(collections);
  // console.log("resolverAreCollections", collections, checks);

  return checks;
};

const resolverGetCollections = async (
  chainId: number,
  account = ADDRESS_ZERO
): Promise<Map<string, CollectionType>> => {
  // console.log(`resolverGetCollections ${keyCollections(chainId, account)}\n`, chainId, account);

  const collections: Map<string, CollectionType> = new Map();

  const nftsResolver = await resolverGetContract(chainId);

  const collectionInfos = await nftsResolver.getOpenNFTsCollectionsInfos(account);
  // console.log("resolverGetCollections openNFTsStructOutput", collectionInfos);

  if (collectionInfos[0].length !== collectionInfos[1].length) {
    console.error("ERROR resolverGetCollections", collectionInfos);
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

  // console.log(`resolverGetCollections ${chainId} ${account}\n`, collections);
  return collections;
};

export {
  resolverGetCollections,
  resolverGetCollection,
  resolverAreCollections,
  resolverFilterCollections,
  resolverFilterCollectionsAddress
};
