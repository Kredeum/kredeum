import type { Collection } from "./ktypes";
import type { Provider } from "@ethersproject/abstract-provider";

import { BigNumber } from "ethers";
import { fetchCov, fetchGQL } from "./kfetch";
import { factoryGetContract } from "./kfactory-get";
import { cacheCollectionsList } from "./kcache";

import { getChecksumAddress, getNetwork, getSubgraphUrl, getCovalent, nftsUrl, urlOwner } from "./kconfig";
import { collectionGetSupportedInterfaces } from "lib/kcollection-get-supports";

const collectionListFromCovalent = async (chainId: number, owner: string): Promise<Map<string, Collection>> => {
  // console.log("collectionListFromCovalent", chainId, owner);

  const collections: Map<string, Collection> = new Map();
  let path: string;
  const network = getNetwork(chainId);

  if (network && owner) {
    const match =
      // eslint-disable-next-line quotes
      '{$or:[{supports_erc:{$elemmatch:"erc721"}},{supports_erc:{$elemmatch:"erc1155"}}]}';

    path =
      `/${Number(chainId)}/address/${owner}/balances_v2/` +
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
        const user = owner || "";
        const balanceOf = Number(collectionCov.balance);

        const collection: Collection = {
          chainId,
          chainName,
          address,
          name,
          symbol,
          user,
          balanceOf
        };
        collections.set(nftsUrl(chainId, address), collection);
      }
    }
  }
  // console.log("collectionListFromCovalent", path, collections.size, collections);
  return collections;
};

const collectionListFromTheGraph = async (chainId: number, owner: string): Promise<Map<string, Collection>> => {
  // console.log("collectionListFromTheGraph", chainId, owner);

  const collections: Map<string, Collection> = new Map();
  const network = getNetwork(chainId);

  if (owner) {
    const query = `
        {
          ownerPerTokenContracts(
            where: {
              owner: "${owner.toLowerCase()}"
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
      const user = owner || "";

      if (currentContractResponse.numTokens > 0) {
        const collection: Collection = {
          chainId,
          chainName,
          address,
          name,
          symbol,
          totalSupply,
          user,
          balanceOf
        };
        collections.set(nftsUrl(chainId, address), collection);
      }
    }
  }
  // console.log("listcollectionsFromTheGraph", collections);
  return collections;
};

const collectionListFromFactory = async (
  chainId: number,
  _owner: string,
  provider: Provider
): Promise<Map<string, Collection>> => {
  // console.log("collectionListFromFactory", chainId, _owner);
  const network = getNetwork(chainId);

  const collections: Map<string, Collection> = new Map();

  const nftsFactory = factoryGetContract(chainId, provider);

  if (nftsFactory) {
    type BalanceOf = [string, BigNumber, string, string, string, BigNumber];
    const balances: Array<BalanceOf> = await nftsFactory.balancesOf(_owner);
    // console.log("collectionListFromFactory balances", balances);

    for (let index = 0; index < balances.length; index++) {
      const chainName = network?.chainName;
      const balance: BalanceOf = balances[index];

      const address: string = getChecksumAddress(balance[0]);
      const owner: string = getChecksumAddress(balance[2]);
      const name: string = balance[3];
      const symbol: string = balance[4];
      const totalSupply = Number(balance[5]);
      const user: string = _owner;
      const balanceOf = Number(balance[1]);

      collections.set(nftsUrl(chainId, address), {
        chainId,
        chainName,
        address,
        owner,
        name,
        symbol,
        totalSupply,
        user,
        balanceOf
      });
    }
  }

  // console.log("collectionListFromFactory", collections);
  return collections;
};

const collectionList = async (chainId: number, owner: string, provider: Provider): Promise<Map<string, Collection>> => {
  // console.log("collectionList", chainId, owner);

  let collections: Map<string, Collection> = new Map();

  const network = getNetwork(chainId);
  if (network && owner) {
    let collectionsOwner: Map<string, Collection> = new Map();
    let collectionsKredeum: Map<string, Collection> = new Map();

    // GET user collections
    if (getSubgraphUrl(chainId)) {
      collectionsOwner = await collectionListFromTheGraph(chainId, owner);
    } else if (getCovalent(chainId)) {
      collectionsOwner = await collectionListFromCovalent(chainId, owner);
    }
    collectionsKredeum = await collectionListFromFactory(chainId, owner, provider);

    // MERGE collectionsOwner and collectionsKredeum
    collections = new Map([...collectionsOwner, ...collectionsKredeum]);
    // console.log("collectionList", collections);

    if (typeof localStorage !== "undefined") {
      for (const [nid, collection] of collections) {
        // Get supported interfaces on specific collections
        if (collection.owner == owner || (collection.balanceOf || 0) > 0) {
          const supported = await collectionGetSupportedInterfaces(chainId, collection.address, provider);
          Object.assign(collection, supported);
        }
        localStorage.setItem(urlOwner(nid, owner), JSON.stringify(collection, null, 2));
      }
    }
  }
  // console.log("collectionList", collections);
  return collections;
};

const collectionListFromCache = (chainId?: number, account?: string): Map<string, Collection> =>
  cacheCollectionsList(chainId, account);

export {
  collectionList,
  collectionListFromCovalent,
  collectionListFromTheGraph,
  collectionListFromFactory,
  collectionListFromCache
};
