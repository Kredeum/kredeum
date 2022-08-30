import type { Provider } from "@ethersproject/abstract-provider";
import type { Signer } from "@ethersproject/abstract-signer";
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

  const collectionInfos = await nftsResolver.getOpenNFTsCollectionInfos(address, account);

  return resolverConvOpenNFTsCollectionInfos(chainId, collectionInfos, account);
};

const resolverGetCollectionList = async (
  chainId: number,
  signerOrProvider: Signer | Provider,
  account = constants.AddressZero
): Promise<Map<string, CollectionType>> => {
  console.log(`resolverGetCollectionList ${collectionListKey(chainId, account)}\n`, chainId, account);

  const collections: Map<string, CollectionType> = new Map();

  const nftsResolver = resolverGetContract(chainId, signerOrProvider);

  const collectionInfos = await nftsResolver.getOpenNFTsCollectionsInfos(account);
  console.log("resolverGetCollectionList openNFTsStructOutput", collectionInfos);

  if (collectionInfos[0].length !== collectionInfos[1].length) {
    console.error("ERROR resolverGetCollectionList", collectionInfos);
  }

  for (let index = 0; index < collectionInfos[0].length; index++) {
    const collection = resolverConvOpenNFTsCollectionInfos(
      chainId,
      [collectionInfos[0][index], collectionInfos[1][index]],
      account
    );
    collections.set(collectionUrl(chainId, collection.address), collection);
  }

  console.log(`resolverGetCollectionList ${collectionListKey(chainId, account)}\n`, collections);
  return collections;
};

export { resolverGetCollectionList, resolverGetCollection };
