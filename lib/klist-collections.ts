import { ethers, Signer, Contract, BigNumber } from "ethers";
import { fetchCov, fetchGQL } from "./kfetch";
import {
  abis,
  getChecksumAddress,
  getNetwork,
  getProvider,
  getSubgraphUrl,
  getCovalent,
  nftsUrl,
  urlCache
} from "./kconfig";
import type { Collection } from "./ktypes";
import type { NFTsFactory } from "../solidity/artifacts/types/NFTsFactory";
import type {
  Provider,
  TransactionResponse,
  TransactionReceipt
} from "@ethersproject/abstract-provider";

const getNFTsFactory = (
  chainId: number,
  _providerOrSigner?: Signer | Provider
): NFTsFactory | undefined => {
  // console.log("getNFTsFactory", chainId);

  const network = getNetwork(chainId);
  // console.log("getNFTsFactory", network);

  _providerOrSigner = _providerOrSigner || getProvider(chainId);
  let nftsFactory: NFTsFactory | undefined;

  if (network?.nftsFactory) {
    nftsFactory = new Contract(
      network?.nftsFactory,
      abis.CloneFactory.concat(abis.NFTsFactory),
      _providerOrSigner
    ) as NFTsFactory;
  }

  return nftsFactory;
};

const listCollectionsFromCovalent = async (
  chainId: number,
  owner: string
): Promise<Map<string, Collection>> => {
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
      // console.log("listCollectionsFromCovalent nbContracts", collectionsCov.length);

      for (let index = 0; index < collectionsCov.length; index++) {
        const collectionCov: CollectionCov = collectionsCov[index];
        const chainName: string = network.chainName;
        const address: string = getChecksumAddress(collectionCov.contract_address);

        const collection: Collection = {
          openNFTsVersion: 2,
          chainId,
          chainName,
          address,
          name: collectionCov.contract_name,
          symbol: collectionCov.contract_ticker_symbol,
          balanceOf: Number(collectionCov.balance)
        };
        collections.set(nftsUrl(chainId, address), collection);
      }
    }
  }
  // console.log("listCollectionsFromCovalent", path, collections.size, collections);
  return collections;
};

const listCollectionsFromTheGraph = async (
  chainId: number,
  owner: string
): Promise<Map<string, Collection>> => {
  // console.log("listCollectionsFromTheGraph");
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
      const { id, name, symbol, numTokens: totalSupply } = contract;
      const address = getChecksumAddress(id);
      const chainName = network?.chainName;
      const balanceOf = Math.max(numTokens, 0);

      if (currentContractResponse.numTokens > 0) {
        const collection: Collection = {
          chainId,
          chainName,
          address,
          name,
          symbol,
          balanceOf,
          totalSupply
        };
        collections.set(nftsUrl(chainId, address), collection);
      }
    }
  }
  // console.log("listcollectionsFromTheGraph", collections);
  return collections;
};

const listCollectionsFromFactory = async (
  chainId: number,
  owner: string = ethers.constants.AddressZero,
  _provider?: Provider
): Promise<Map<string, Collection>> => {
  // console.log("listCollectionsFromFactory", chainId, owner);
  const network = getNetwork(chainId);

  const collections: Map<string, Collection> = new Map();
  const nftsFactory: NFTsFactory | undefined = getNFTsFactory(chainId, _provider);
  // console.log("listCollectionsFromFactory nftsFactory ok ?", nftsFactory ? "OK" : "KO");

  if (nftsFactory) {
    type BalanceOf = [string, string, string, BigNumber, string];
    let balances: Array<BalanceOf> = [];
    balances = await nftsFactory.balancesOf(owner);
    // console.log("balances", balances);

    for (let index = 0; index < balances.length; index++) {
      const chainName = network?.chainName;
      const balance: BalanceOf = balances[index];

      const address: string = getChecksumAddress(balance[0]);
      const name: string = balance[1];
      const symbol: string = balance[2];
      const totalSupply = Number(balance[3]);
      const owner: string = getChecksumAddress(balance[4]);

      collections.set(nftsUrl(chainId, address), {
        openNFTsVersion: 2,
        totalSupply,
        chainId,
        chainName,
        name,
        symbol,
        address,
        owner
      });
    }
  }

  // console.log("listCollectionsFromFactory", collections);
  return collections;
};

const listCollections = async (
  chainId: number,
  owner: string,
  _provider?: Provider
): Promise<Map<string, Collection>> => {
  // console.log("listCollections");
  const collections: Map<string, Collection> = new Map();

  const network = getNetwork(chainId);
  if (network) {
    let collectionsOwner: Map<string, Collection> = new Map();
    let collectionsKredeum: Map<string, Collection> = new Map();

    // GET user collections
    if (getSubgraphUrl(chainId)) {
      collectionsOwner = await listCollectionsFromTheGraph(chainId, owner);
    } else if (getCovalent(chainId)) {
      collectionsOwner = await listCollectionsFromCovalent(chainId, owner);
    }
    collectionsKredeum = await listCollectionsFromFactory(chainId, owner, _provider);

    // MERGE collectionsOwner and collectionsKredeum
    const collections = new Map([...collectionsOwner, ...collectionsKredeum]);
    console.log("listCollections", collections);

    if (typeof localStorage !== "undefined") {
      for (const [nid, collection] of collections) {
        localStorage.setItem(urlCache(nid, owner), JSON.stringify(collection, null, 2));
      }
    }
  }
  // console.log("listCollections", collections);
  return collections;
};

const listCollectionsFromCache = (owner: string): Map<string, Collection> => {
  // console.log("listCollectionsFromCache", owner);
  const collections: Map<string, Collection> = new Map();

  for (let index = 0; index < localStorage.length; index++) {
    const key = localStorage.key(index);

    if (key?.startsWith("nfts://") && key?.endsWith(`@${owner}`)) {
      collections.set(key, JSON.parse(localStorage.getItem(key) || "") as Collection);
    }
  }
  // console.log("listCollectionsFromCache", collections);
  return collections;
};

const CloneResponse = async (
  chainId: number,
  _contract: string,
  _name: string,
  _cloner: Signer
): Promise<TransactionResponse | undefined> => {
  // console.log("CloneResponse", chainId, _contract, await _cloner.getAddress());

  const network = getNetwork(chainId);

  const nftsFactory = getNFTsFactory(chainId, _cloner);
  let txResp: TransactionResponse | undefined;

  if (nftsFactory) {
    const n: string = (await nftsFactory.implementationsCount()).toString();
    const name = _name || `Open NFTs #${n}`;
    // console.log(`cost ${ethers.utils.formatEther(cost)}`);

    txResp = await nftsFactory.clone(name, `NFT${n}`);
    console.log(`${network?.blockExplorerUrls[0]}/tx/${txResp.hash}`);
  }

  return txResp;
};

const CloneReceipt = async (txResp: TransactionResponse): Promise<TransactionReceipt> => {
  return await txResp.wait();
};

const CloneAddress = (txReceipt: TransactionReceipt): string => {
  let implementation = "";

  // console.log("txReceipt", txReceipt);
  if (txReceipt.logs) {
    const abi = [
      "event NewImplementation(address indexed implementation, address indexed template, address indexed creator)"
    ];
    const iface = new ethers.utils.Interface(abi);
    const log = iface.parseLog(txReceipt.logs[0]);
    ({ implementation } = log.args);
  }

  //  console.log("CloneAddress", implementation);
  return implementation;
};

const Clone = async (
  chainId: number,
  _contract: string,
  _name: string,
  _cloner: Signer
): Promise<string> => {
  const txResp = await CloneResponse(chainId, _contract, _name, _cloner);
  let address = "";
  if (txResp) {
    const txReceipt = await CloneReceipt(txResp);
    address = CloneAddress(txReceipt);
  }
  return address;
};

export {
  Clone,
  CloneResponse,
  CloneReceipt,
  CloneAddress,
  listCollections,
  listCollectionsFromCache,
  listCollectionsFromCovalent,
  listCollectionsFromTheGraph,
  listCollectionsFromFactory,
  getNFTsFactory
};
export type { NFTsFactory };
