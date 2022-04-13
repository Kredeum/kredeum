import type { CollectionType } from "./ktypes";
import type { Provider } from "@ethersproject/abstract-provider";

import { BigNumber } from "ethers";
import { fetchCov, fetchGQL } from "./kfetch";
import { factoryGetContract } from "./kfactory-get";
import { collectionMerge } from "./kcollection-get";

import { getChecksumAddress, getNetwork, getSubgraphUrl, getCovalent, collectionUrl } from "./kconfig";

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
  // console.log("collectionListFromCovalent", chainId, account);

  const collections: Map<string, CollectionType> = new Map();
  let path = "";
  const network = getNetwork(chainId);

  if (network && account) {
    const match =
      // eslint-disable-next-line quotes
      '{$or:[{supports_erc:{$elemmatch:"erc721"}},{supports_erc:{$elemmatch:"erc1155"}}]}';

    path =
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

        const chainName: string = network?.chainName;
        const address: string = getChecksumAddress(collectionCov.contract_address);
        const name = collectionCov.contract_name || "";
        const symbol = collectionCov.contract_ticker_symbol || "";
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
  }
  // console.log("collectionListFromCovalent", path, collections.size, collections);
  return collections;
};

const collectionListFromTheGraph = async (chainId: number, account: string): Promise<Map<string, CollectionType>> => {
  // console.log("collectionListFromTheGraph", chainId, account);

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
    const answerGQL = (await fetchGQL(getSubgraphUrl(chainId), query)) as AnswerCollectionsGQL;
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
  // console.log("listcollectionsFromTheGraph", collections);
  return collections;
};

const collectionListFromFactory = async (
  chainId: number,
  account: string,
  provider: Provider
): Promise<Map<string, CollectionType>> => {
  // console.log("collectionListFromFactory", chainId, account);
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
      const name: string = balance[3];
      const symbol: string = balance[4];
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

  // console.log("collectionListFromFactory", collections);
  return collections;
};

const collectionList = async (
  chainId: number,
  account: string,
  provider: Provider,
  metadata?: boolean
): Promise<Map<string, CollectionType>> => {
  // console.log("collectionList", chainId, account);

  let collections: Map<string, CollectionType> = new Map();

  const network = getNetwork(chainId);
  if (network && account) {
    let collectionsOwner: Map<string, CollectionType> = new Map();
    let collectionsKredeum: Map<string, CollectionType> = new Map();

    // GET user collections
    if (getSubgraphUrl(chainId)) {
      collectionsOwner = await collectionListFromTheGraph(chainId, account);
    } else if (getCovalent(chainId)) {
      collectionsOwner = await collectionListFromCovalent(chainId, account);
    }
    collectionsKredeum = await collectionListFromFactory(chainId, account, provider);

    // MERGE collectionsOwner and collectionsKredeum
    collections = collectionListMerge(collectionsOwner, collectionsKredeum);
    // console.log("collectionList", collections);
  }
  // console.log("collectionList", collections);
  return collections;
};

export {
  collectionList,
  collectionListMerge,
  collectionListFromCovalent,
  collectionListFromTheGraph,
  collectionListFromFactory
};
