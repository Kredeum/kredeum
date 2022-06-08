import type { CollectionType } from "./ktypes";
import type { Provider } from "@ethersproject/abstract-provider";

import { BigNumber } from "ethers";
import { fetchCov, fetchGQL, fetchAlch } from "./kfetch";
import { DEFAULT_NAME, DEFAULT_SYMBOL, getChainName } from "./kconfig";

import { factoryGetContract } from "./kfactory-get";
import { collectionMerge } from "./kcollection-get";

import { getChecksumAddress, getNetwork, getSubgraph, getCovalent, getAlchemy, collectionUrl } from "./kconfig";

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

const collectionListFromCovalent = async (chainId: number, account: string): Promise<Map<string, CollectionType>> => {
  // console.log(`collectionListFromCovalent ${collectionListKey(chainId, account)}\n`);

  const collections: Map<string, CollectionType> = new Map();
  const chainName = getChainName(chainId);

  if (!(chainId && chainName && account)) return collections;

  const match =
    // eslint-disable-next-line quotes
    '{$or:[{supports_erc:{$elemmatch:"erc721"}},{supports_erc:{$elemmatch:"erc1155"}}]}';

  const path =
    `/${Number(chainId)}/address/${account}/balances_v2/` +
    "?nft=true" +
    "&no-nft-fetch=false" +
    `&match=${encodeURIComponent(match)}`;

  type CollectionCov = {
    contract_name: string;
    contract_ticker_symbol: string;
    contract_address: string;
    balance: BigNumber;
  };
  type AnswerCollectionsCov = {
    items?: Array<CollectionCov>;
  };
  const answerCollectionsCov = (await fetchCov(path)) as AnswerCollectionsCov;

  const collectionsCov = answerCollectionsCov?.items;
  if (collectionsCov?.length) {
    // console.log(collectionsCov[0]);
    // console.log("collectionListFromCovalent nbContracts", collectionsCov.length);

    for (let index = 0; index < collectionsCov.length; index++) {
      const collectionCov: CollectionCov = collectionsCov[index];

      const address: string = getChecksumAddress(collectionCov.contract_address);
      const name = collectionCov.contract_name || DEFAULT_NAME;
      const symbol = collectionCov.contract_ticker_symbol || DEFAULT_SYMBOL;
      const balanceOf = Number(collectionCov.balance);

      const collection: CollectionType = {
        chainId,
        chainName,
        address,
        name,
        symbol
      };
      collection.balancesOf = new Map([[account, balanceOf]]);
      collections.set(collectionUrl(chainId, address), collection);
    }
  }

  // console.log(
  //   `collectionListFromCovalent ${collectionListKey(chainId, account)}\n`,
  //   collections.size,
  //   path,
  //   collections
  // );
  return collections;
};

const collectionListFromAlchemy = async (chainId: number, account: string): Promise<Map<string, CollectionType>> => {
  // console.log(`collectionListFromCovalent ${collectionListKey(chainId, account)}\n`);

  const collections: Map<string, CollectionType> = new Map();
  const chainName = getChainName(chainId);

  if (!(chainId && chainName && account)) return collections;

  type CollectionAlch = {
    contract: { address: string };
    id: { tokenId: string };
    balance: string;
  };
  type AnswerCollectionsAlch = {
    ownedNfts?: Array<CollectionAlch>;
    totalCount: number;
  };
  const answerCollectionsAlch = (await fetchAlch(
    chainId,
    `/getNFTs?owner=${account}&withMetadata=false`
  )) as AnswerCollectionsAlch;
  // console.log("answerCollectionsAlch", answerCollectionsAlch);

  const totalCount = answerCollectionsAlch.totalCount;
  const ownedNfts = answerCollectionsAlch.ownedNfts;
  if (!(ownedNfts && totalCount >= 0)) return collections;

  for (let index = 0; index < totalCount; index++) {
    const ownedNft = ownedNfts[index];
    // console.log("collectionListFromAlchemy", ownedNft);

    const address = getChecksumAddress(ownedNft.contract?.address);
    const collUrl = collectionUrl(chainId, address);

    const previousCollection = collections.get(collUrl);
    const count = Number(previousCollection?.balancesOf?.get(account) || 0);
    const collection = {
      chainId,
      owner: account,
      address,
      balancesOf: new Map([[account, count + 1]])
    };

    collections.set(collUrl, collection);
  }
  // console.log("collectionListFromAlchemy ~ collections", collections);
  return collections;
};

const collectionListFromTheGraph = async (chainId: number, account: string): Promise<Map<string, CollectionType>> => {
  // console.log(`collectionListFromTheGraph ${collectionListKey(chainId, account)}\n`);

  const collections: Map<string, CollectionType> = new Map();
  const network = getNetwork(chainId);

  if (account) {
    const query = `
        {
          ownerPerTokenContracts(
            where: {
              owner: "${account.toLowerCase()}"
              }
          ) {
            contract {
              id
              name
              symbol
              numTokens
            }
            numTokens
          }
        }
    `;
    type AnswerCollectionsGQL = {
      ownerPerTokenContracts: Array<{
        contract: { id: string; name: string; symbol: string; numTokens: number };
        numTokens: number;
      }>;
    };
    const answerGQL = (await fetchGQL(chainId, query)) as AnswerCollectionsGQL;
    const currentContracts = answerGQL?.ownerPerTokenContracts || [];
    // console.log(currentContracts[0]);

    for (let index = 0; index < currentContracts.length; index++) {
      const currentContractResponse = currentContracts[index];
      const { contract, numTokens } = currentContractResponse;
      const { id, name, symbol, numTokens: numTokensTotal } = contract;
      const totalSupply = Number(numTokensTotal);
      const address = getChecksumAddress(id);
      const chainName = network?.chainName;
      const balanceOf = Math.max(numTokens, 0);

      if (currentContractResponse.numTokens > 0) {
        const collection: CollectionType = {
          chainId,
          chainName,
          address,
          name,
          symbol,
          totalSupply
        };
        collection.balancesOf = new Map([[account, balanceOf]]);
        collections.set(collectionUrl(chainId, address), collection);
      }
    }
  }
  // console.log(`collectionListFromTheGraph ${collectionListKey(chainId, account)}\n`, collections);
  return collections;
};

const collectionListFromFactory = async (
  chainId: number,
  account: string,
  provider: Provider
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
  account: string,
  provider: Provider,
  mintable?: boolean
): Promise<Map<string, CollectionType>> => {
  // console.log(`collectionList ${collectionListKey(chainId, account)}\n`);

  let collections: Map<string, CollectionType> = new Map();

  const network = getNetwork(chainId);
  if (network && account) {
    let collectionsOwner: Map<string, CollectionType> = new Map();
    let collectionsKredeum: Map<string, CollectionType> = new Map();

    // GET user collections
    if (getAlchemy(chainId)) {
      collectionsOwner = await collectionListFromAlchemy(chainId, account);
    } else if (getSubgraph(chainId)) {
      collectionsOwner = await collectionListFromTheGraph(chainId, account);
    } else if (getCovalent(chainId)) {
      collectionsOwner = await collectionListFromCovalent(chainId, account);
    }
    collectionsKredeum = await collectionListFromFactory(chainId, account, provider);

    // MERGE collectionsOwner and collectionsKredeum
    collections = collectionListMerge(collectionsOwner, collectionsKredeum);
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
  collectionListFromCovalent,
  collectionListFromAlchemy,
  collectionListFromTheGraph,
  collectionListFromFactory
};
