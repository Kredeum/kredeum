import { ethers, BigNumber, utils, Signer, Contract } from "ethers";
import { fetchCov, fetchGQL } from "./kfetch";
import { abis, getNetwork, getProvider, getSubgraphUrl, getCovalent, nftsUrl } from "./kconfig";
import type { Network, Collection } from "./kconfig";
import type { NFTsFactory } from "../solidity/artifacts/types/NFTsFactory";
import type {
  Provider,
  TransactionRequest,
  TransactionResponse,
  TransactionReceipt
} from "@ethersproject/abstract-provider";

const getNFTsFactory = (chainId: number, _providerOrSigner?: Signer | Provider): NFTsFactory => {
  // console.log("getNFTsFactory", chainId);
  let nftsFactory: NFTsFactory;

  const network = getNetwork(chainId);
  // console.log("getNFTsFactory", network);

  if (network?.nftsFactory) {
    _providerOrSigner = _providerOrSigner || getProvider(chainId);

    nftsFactory = new Contract(
      network?.nftsFactory || "",
      abis.CloneFactory.concat(abis.NFTsFactory),
      _providerOrSigner
    ) as NFTsFactory;
  }

  return nftsFactory;
};

const listCollectionsFromCovalent = async (
  chainId: number,
  _owner?: string
): Promise<Map<string, Collection>> => {
  let collections: Map<string, Collection> = new Map();
  let path;
  const network = getNetwork(chainId);

  if (network && _owner) {
    const match = `{$or:[{supports_erc:{$elemmatch:"erc721"}},{supports_erc:{$elemmatch:"erc1155"}}]}`;

    path =
      `/${Number(chainId)}/address/${_owner}/balances_v2/` +
      `?nft=true` +
      `&no-nft-fetch=false` +
      `&match=${encodeURIComponent(match)}`;

    const answerCov = await fetchCov(path);
    // console.log(path, answerCov);

    if (answerCov.error) {
      console.error("answerCov.error", answerCov.error);
    } else {
      const collectionsJson = answerCov?.data?.items || [];
      // console.log(collectionsJson[0]);
      // console.log("listCollectionsFromCovalent nbContracts", collectionsJson.length);

      for (let index = 0; index < collectionsJson.length; index++) {
        const collection = collectionsJson[index];
        const chainName = network.chainName;
        const address = collection.contract_address;

        collections.set(nftsUrl(chainId, address), {
          chainId,
          chainName,
          address,
          name: collection.contract_name,
          symbol: collection.contract_ticker_symbol,
          totalSupply: collection.balance
        });
      }
    }
  }
  // console.log("listCollectionsFromCovalent nbContracts ERC721", collections.length);
  // console.log("listCollectionsFromCovalent", collections);

  return collections;
};

const listCollectionsFromTheGraph = async (
  chainId: number,
  _owner?: string
): Promise<Map<string, Collection>> => {
  // console.log("listCollectionsFromTheGraph");
  let collections: Map<string, Collection> = new Map();
  const network = getNetwork(chainId);

  if (_owner) {
    const owner = _owner?.toLowerCase();
    const query = `
        {
          ownerPerTokenContracts(
            where: {
              owner: "${owner}"
              }
          ) {
            contract {
              id
              name
              symbol
            }
            numTokens
          }
        }
    `;
    const answerGQL = await fetchGQL(getSubgraphUrl(chainId), query);
    const currentContracts = answerGQL?.ownerPerTokenContracts || [];
    // console.log(currentContracts[0]);

    let index2 = 0;
    for (let index = 0; index < currentContracts.length; index++) {
      const currentContractResponse = currentContracts[index];
      const { contract, numTokens } = currentContractResponse;
      const { id: address, name, symbol } = contract;
      const chainName = network.chainName;
      const totalSupply = Math.max(numTokens, 0);

      if (currentContractResponse.numTokens > 0) {
        collections.set(nftsUrl(chainId, address), {
          chainId,
          chainName,
          address,
          name,
          symbol,
          totalSupply
        } as Collection);
        index2++;
      }
    }
  }
  // console.log("listcollectionsFromTheGraph", collections);
  return collections;
};

const listCollectionsFromFactory = async (
  chainId: number,
  _owner: string = ethers.constants.AddressZero,
  _provider?: Provider
): Promise<Map<string, Collection>> => {
  // console.log("listCollectionsFromFactory", chainId, _owner);
  const network = getNetwork(chainId);

  let collections: Map<string, Collection> = new Map();
  const nftsFactory: NFTsFactory = getNFTsFactory(chainId, _provider);
  // console.log("listCollectionsFromFactory nftsFactory ok ?", nftsFactory ? "OK" : "KO");

  if (nftsFactory) {
    let balances = [];
    balances = await nftsFactory.balancesOf(_owner);
    // console.log("balances", balances);

    for (let index = 0; index < balances.length; index++) {
      const chainName = network.chainName;
      const balance = balances[index];
      const address = utils.getAddress(balance[0]);
      const name = balance[1];
      const symbol = balance[2];
      const totalSupply = Number(balance[3]);
      const owner = utils.getAddress(balance[4]);
      collections.set(`nfts://${chainName}/${address}`, {
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
  _owner?: string,
  _provider?: Provider
): Promise<Array<Collection>> => {
  // console.log("listCollections");
  let collections: Array<Collection> = [];

  const network = getNetwork(chainId);
  if (network) {
    let collectionsOwner: Map<string, Collection> = new Map();
    let collectionsKredeum: Map<string, Collection> = new Map();

    // GET user collections
    if (getSubgraphUrl(chainId)) {
      collectionsOwner = await listCollectionsFromTheGraph(chainId, _owner);
    } else if (getCovalent(chainId)) {
      collectionsOwner = await listCollectionsFromCovalent(chainId, _owner);
    }
    collectionsKredeum = await listCollectionsFromFactory(chainId, _owner, _provider);

    // MERGE collectionsOwner and collectionsKredeum
    const collectionsMap = new Map([...collectionsOwner, ...collectionsKredeum]);
    // console.log("listCollections", collectionsMap);
    collections = [...collectionsMap.values()];

    if (typeof localStorage !== "undefined") {
      collections?.forEach((collection, i) => {
        const address = utils.getAddress(collection.address);
        collections[i].address = address;
        localStorage.setItem(
          `nfts://${network.chainName}/${address}`,
          JSON.stringify(collection, null, 2)
        );
      });
    }
  }
  // console.log("listCollections", collections);
  return collections;
};

const listCollectionsFromCache = (chainId: number): Array<Collection> => {
  const collections = [];

  for (let index = 0; index < localStorage.length; index++) {
    const key = localStorage.key(index);
    // console.log("listCollectionsFromCache", key, index);

    if (key?.startsWith("nfts://")) {
      const collection = JSON.parse(localStorage.getItem(key) || "{}");
      // console.log("listCollectionsFromCache", collection);
      if (chainId && chainId === collection.chainId) {
        collections.push(collection);
      }
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
): Promise<TransactionResponse> => {
  const cloner = await _cloner.getAddress();
  // console.log("CloneResponse", chainId, _contract, cloner);

  let txResp: TransactionResponse;
  const network = getNetwork(chainId);

  const nftsFactory = getNFTsFactory(chainId, _cloner);

  if (nftsFactory) {
    const cost = await nftsFactory.cloneCost();
    const n = await nftsFactory.implementationsCount();
    const name = _name || `Open NFTs #${n}`;
    // console.log(`cost ${ethers.utils.formatEther(cost)}`);

    txResp = await nftsFactory.clone(name, `NFT${n}`, { value: cost });
    console.log(`${network.blockExplorerUrls[0]}/tx/` + txResp.hash);
  }

  return txResp;
};

const CloneReceipt = async (txResp: TransactionResponse): Promise<TransactionReceipt> => {
  return await txResp.wait();
};

const CloneAddress = (txReceipt: TransactionReceipt): string => {
  let implementation: string = "";

  console.log("txReceipt", txReceipt);
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
  const txReceipt = await CloneReceipt(txResp);
  const address = CloneAddress(txReceipt);
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
