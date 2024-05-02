import type { CollectionType } from "../common/types";
import { resolverConvOpenNFTsCollectionInfos } from "../resolver/resolver-conv-collection-infos";
import { resolverGetContract } from "../resolver/resolver-get";
import { keyCollection } from "../common/keys";
import { ADDRESS_ZERO } from "../common/config";
// import { keyCollections } from "../common/keys";

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

// const resolverGetCollections = async (chainId: number): Promise<CollectionType[]> => {
//   console.log("resolverGetCollections >", chainId);
//   const collections: CollectionType[] = [];

//   const nftsResolver = await resolverGetContract(chainId);
//   const colls = await nftsResolver.getCo();

//   console.log("resolverGetCollections <", collections);
//   return collections;
// };

const resolverGetCollectionsAddresses = async (chainId: number): Promise<string[]> => {
  // console.log("resolverGetCollectionsAddresses", chainId);

  const nftsResolver = await resolverGetContract(chainId);

  const addresses = await nftsResolver.getAddresses();
  // console.log("resolverGetCollectionsInfos openNFTsStructOutput", collectionInfos);

  // console.log("resolverGetCollectionsAddresses", chainId, addresses);
  return addresses;
};

const resolverGetCollectionsInfos = async (
  chainId: number,
  account = ADDRESS_ZERO
): Promise<Map<string, CollectionType>> => {
  console.log("resolverGetCollectionsInfos >", chainId, account);

  const collections: Map<string, CollectionType> = new Map();

  const nftsResolver = await resolverGetContract(chainId);

  const collectionsInfos = await nftsResolver.getOpenNFTsCollectionsInfos(account);
  console.log("resolverGetCollectionsInfos openNFTsStructOutput", collectionsInfos);

  if (collectionsInfos[0].length !== collectionsInfos[1].length) {
    console.error("ERROR resolverGetCollectionsInfos", collectionsInfos);
  }

  for (let index = 0; index < collectionsInfos[0].length; index++) {
    const collection = resolverConvOpenNFTsCollectionInfos(
      chainId,
      [collectionsInfos[0][index], collectionsInfos[1][index]],
      account
    );
    console.log("collection", collection);
    collections.set(keyCollection(chainId, collection.address), collection);
  }

  console.log("resolverGetCollectionsInfos <", collections);
  return collections;
};

const resolverCountCollections = async (chainId: number): Promise<number | undefined> => {
  const nftsResolver = await resolverGetContract(chainId);
  return Number(await nftsResolver.countAddresses());
};

export {
  resolverCountCollections,
  resolverGetCollectionsInfos,
  resolverGetCollectionsAddresses,
  resolverGetCollection,
  resolverAreCollections,
  resolverFilterCollections,
  resolverFilterCollectionsAddress
};
