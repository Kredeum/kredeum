import type { CollectionType } from "./ktypes";
import type { Provider } from "@ethersproject/abstract-provider";

import { BigNumber, constants } from "ethers";
import { DEFAULT_NAME, DEFAULT_SYMBOL, getChainName } from "./kconfig";

import { factoryGetContract } from "./kfactory-get";
import { resolverGetAddress, resolverGetContract } from "./kresolver-get";
import { collectionMerge } from "./kcollection-get";

import { getChecksumAddress, getNetwork, collectionUrl } from "./kconfig";

import { alchemyGet, alchemyCollectionList } from "@lib/api-alchemy";
import { covalentGet, covalentCollectionList } from "@lib/api-covalent";
import { thegraphGet, thegraphCollectionList } from "@lib/api-thegraph";
import { moralisGet, moralisCollectionList } from "@lib/api-moralis";

import { IERC721Infos } from "@soltypes/contracts/next/NFTsResolver";

// Merge 2 collections list into 1
const collectionListMerge = (
  colList1: Map<string, CollectionType>,
  colList2: Map<string, CollectionType>
): Map<string, CollectionType> => {
  const collList = colList2;
  if (colList1) {
    for (const [key, coll1] of colList1.entries()) {
      // console.log(key, coll1);
      const coll2 = colList2.get(key);
      if (coll2) {
        const mergedColl = collectionMerge(coll1, coll2);
        colList2.set(key, mergedColl);
      } else {
        colList2.set(key, coll1);
      }
    }
  }
  return collList;
};

type CollectionInfos = [string, string, string, string, BigNumber, BigNumber];

const collectionListFromResolverOne = (
  chainId: number,
  account: string,
  collectionInfos: CollectionInfos
): CollectionType => {
  console.log("collectionListFromResolverOne  IN", chainId, account, collectionInfos);

  const chainName = getChainName(chainId);
  const address: string = getChecksumAddress(collectionInfos[0]);
  const owner: string = getChecksumAddress(collectionInfos[1]);
  const name: string = collectionInfos[2] || DEFAULT_NAME;
  const symbol: string = collectionInfos[3] || DEFAULT_SYMBOL;
  const totalSupply = Number(collectionInfos[4]);
  const balancesOf = new Map([[account, Number(collectionInfos[5])]]);

  const collection = { chainId, chainName, address, owner, name, symbol, totalSupply, balancesOf };

  console.log("collectionListFromResolverOne OUT", collectionList);
  return collection;
};

const collectionListFromResolver = async (
  chainId: number,
  provider: Provider,
  account = ""
): Promise<Map<string, CollectionType>> => {
  // console.log(`collectionListFromResolver ${collectionListKey(chainId, account)}\n`, chainId, account);

  const collections: Map<string, CollectionType> = new Map();

  const nftsResolver = resolverGetContract(chainId, provider);
  if (nftsResolver) {
    const collectionsInfosStructOutput: Array<IERC721Infos.CollectionInfosStructOutput> = await nftsResolver[
      "getCollectionsInfos(address)"
    ](account);
    console.log("collectionsInfosStructOutput", collectionsInfosStructOutput);
    // const collectionsInfos: Array<CollectionInfos> = await nftsResolver["getCollectionsInfos(address)"](account);
    // console.log("collectionListFromResolver collectionsInfos", collectionsInfos);

    // TODO for (let index = 0; index < collectionsInfos.length; index++) {
    //   const collection = collectionListFromResolverOne(chainId, account, collectionsInfos[index]);
    //   collections.set(collectionUrl(chainId, collection.address), collection);
    // }
  }
  // console.log(`collectionListFromResolver ${collectionListKey(chainId, account)}\n`, collections);
  return collections;
};

const collectionListFromFactory = async (
  chainId: number,
  provider: Provider,
  account = constants.AddressZero
): Promise<Map<string, CollectionType>> => {
  // console.log(`collectionListFromFactory ${collectionListKey(chainId, account)}\n`, chainId, account);

  const network = getNetwork(chainId);

  const collections: Map<string, CollectionType> = new Map();

  const nftsFactory = factoryGetContract(chainId, provider);
  if (nftsFactory) {
    type BalanceOf = [string, BigNumber, string, string, string, BigNumber];
    const balances: Array<BalanceOf> = await nftsFactory.balancesOf(account);
    // console.log("collectionListFromFactory balances", balances);

    for (let index = 0; index < balances.length; index++) {
      const chainName = network?.chainName;
      const balance: BalanceOf = balances[index];

      const address: string = getChecksumAddress(balance[0]);
      const owner: string = getChecksumAddress(balance[2]);
      const name: string = balance[3] || DEFAULT_NAME;
      const symbol: string = balance[4] || DEFAULT_SYMBOL;
      const totalSupply = Number(balance[5]);
      const balanceOf = Number(balance[1]);

      const collection: CollectionType = {
        chainId,
        chainName,
        address,
        owner,
        name,
        symbol,
        totalSupply
      };
      collection.balancesOf = new Map([[account, balanceOf]]);
      collections.set(collectionUrl(chainId, address), collection);
    }
  }
  // console.log(`collectionListFromFactory ${collectionListKey(chainId, account)}\n`, collections);
  return collections;
};

const collectionList = async (
  chainId: number,
  provider: Provider,
  account?: string,
  mintable?: boolean
): Promise<Map<string, CollectionType>> => {
  // console.log(`collectionList ${collectionListKey(chainId, account)}\n`);

  let collections: Map<string, CollectionType> = new Map();

  const network = getNetwork(chainId);
  if (network && account) {
    let collectionsOwner: Map<string, CollectionType> = new Map();
    let collectionsKredeum: Map<string, CollectionType> = new Map();

    // GET user collections
    if (alchemyGet(chainId)) {
      collectionsOwner = await alchemyCollectionList(chainId, account);
      // console.log("collectionList alchemyCollectionList", collectionsOwner);
    } else if (thegraphGet(chainId)) {
      collectionsOwner = await thegraphCollectionList(chainId, account);
      // console.log("collectionList thegraphCollectionList", collectionsOwner);
    } else if (moralisGet(chainId)) {
      collectionsOwner = await moralisCollectionList(chainId, account);
    } else if (covalentGet(chainId)) {
      collectionsOwner = await covalentCollectionList(chainId, account);
      // console.log("collectionList covalentCollectionList", collectionsOwner);
    }

    // console.log("collectionList collectionListKredeum", resolverGetAddress(chainId));
    if (resolverGetAddress(chainId)) {
      collectionsKredeum = await collectionListFromResolver(chainId, provider, account);
    } else {
      collectionsKredeum = await collectionListFromFactory(chainId, provider, account);
    }

    // console.log("collectionList collectionListKredeum", collectionsKredeum);

    // MERGE collectionsOwner and collectionsKredeum
    collections = collectionListMerge(collectionsOwner, collectionsKredeum);
    // console.log("collectionList merge", collections);
  }

  if (mintable) {
    // filter mintable collection
    collections = new Map(
      [...collections].filter(([, coll]) => coll.open || (coll.owner === account && coll.version == 3))
    );
  }

  // console.log(`collectionList ${collectionListKey(chainId, account)}\n`, collections);
  return collections;
};

export {
  collectionList,
  collectionListMerge,
  moralisCollectionList as collectionListMoralis,
  alchemyCollectionList as collectionListAlchemy,
  thegraphCollectionList as collectionListFromTheGraph,
  covalentCollectionList as collectionListFromCovalent,
  collectionListFromFactory
};
