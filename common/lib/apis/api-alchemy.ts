import { BigNumber } from "ethers";

import type { CollectionFilterType, CollectionType, NftType } from "@lib/common/types";
import type { FetchResponse } from "@lib/common/fetch";
import { fetchJson, FETCH_LIMIT } from "@lib/common/fetch";
import { getChecksumAddress,  isAddressNotZero } from "@lib/common/config";
import { keyCollections, keyNft } from "@lib/common/keys";
import { constants } from "ethers";
import { networks } from "@lib/common/networks";

const alchemyCollections = async (chainId: number, account: string): Promise<Map<string, CollectionType>> => {
  // console.log(`alchemyCollections ${keyCollections(chainId, account)}\n`);

  const collections: Map<string, CollectionType> = new Map();
  const chainName = networks.getChainName(chainId);

  if (!(chainId && chainName && isAddressNotZero(account))) return collections;

  type AlchemyCollection = {
    address: string;
    contractDeployer: string;
    numDistinctTokensOwned: number;
    totalBalance: number;

    totalSupply?: number;
    name: string;
    symbol: string;
    tokenType: string;

    title: string;
    tokenId: string;
    isSpam: boolean;
  };
  type AlchemyCollectionsAnswer = {
    contracts?: Array<AlchemyCollection>;
    totalCount: number;
  };

  const req = `/getContractsForOwner?owner=${account}&pageSize=100`;
  // const req = `/getContractsForOwner?owner=${account}&pageSize=100&includeFilters=["AIRDROP"]`;

  const alchemyCollectionsAnswer = (await alchemyFetch(chainId, req)) as AlchemyCollectionsAnswer;
  if (!alchemyCollectionsAnswer) return collections;

  const totalCount = alchemyCollectionsAnswer.totalCount || 0;
  const contracts = alchemyCollectionsAnswer.contracts;
  if (!(contracts && totalCount > 0)) return collections;

  let index = 0;
  for (const contract of contracts) {
    // console.log("alchemyCollections ~ contract:", contract);
    if (index++ >= 100) break;

    const address = getChecksumAddress(contract.address);
    const count = contract.numDistinctTokensOwned || 0;
    const owner = getChecksumAddress(contract.contractDeployer);
    const name = contract.name || contract.title || "";
    const symbol = contract.symbol || "";
    const totalSupply = contract.totalSupply || 0;

    const collKey = keyCollections(chainId, address);
    // console.log("alchemyCollections ~ collKey:", collKey);

    const collection = {
      chainId,
      address,
      owner,
      name,
      symbol,
      totalSupply,
      balancesOf: new Map([[account, count]])
    };

    collections.set(collKey, collection);
  }
  // console.log("alchemyCollections OUT", collections);
  return collections;
};

const alchemyNftList = async (
  chainId: number,
  collection: CollectionType,
  filter: CollectionFilterType = {}
): Promise<Map<string, NftType>> => {
  const owner = filter.owner || constants.AddressZero;
  const limit = filter.limit || FETCH_LIMIT;
  const address = getChecksumAddress(collection.address);
  // console.log("alchemyNftList", chainId, address, owner, limit);

  const nfts: Map<string, NftType> = new Map();
  if (!(chainId && address && alchemyActive(chainId))) return nfts;

  type AchemyNfts = {
    id: { tokenId: string };
    tokenUri: { gateway: string };
    balance?: string;
  };
  type AlchemyAnwserNftsOwner = {
    ownedNfts: Array<AchemyNfts>;
    totalCount: number;
    pageKey: string;
  };
  type AlchemyAnwserNftsCollection = {
    nfts: Array<AchemyNfts>;
    nextToken: string;
  };

  if (owner == constants.AddressZero) {
    const req = `/getNFTsForCollection?contractAddress=${collection.address}&limit=${limit}&withMetadata=true`;

    const alchemyAnswerNftsCollection = (await alchemyFetch(chainId, req)) as AlchemyAnwserNftsCollection;

    for (const collectionNft of alchemyAnswerNftsCollection.nfts) {
      const tokenID = BigNumber.from(collectionNft.id?.tokenId).toString();
      const nid = keyNft(chainId, collection.address, tokenID);
      const tokenURI = collectionNft.tokenUri?.gateway;

      nfts.set(nid, { chainId, address, tokenID, tokenURI, nid });
    }
  } else {
    const req = `/getNFTs?owner=${owner}&contractAddresses[]=${collection.address}&pageSize=${limit}&withMetadata=true`;

    const alchemyAnswerNftsOwner = (await alchemyFetch(chainId, req)) as AlchemyAnwserNftsOwner;

    for (const ownedNft of alchemyAnswerNftsOwner.ownedNfts) {
      const tokenID = BigNumber.from(ownedNft.id?.tokenId).toString();
      const nid = keyNft(chainId, collection.address, tokenID);
      const tokenURI = ownedNft.tokenUri?.gateway;

      nfts.set(nid, { chainId, address, tokenID, tokenURI, nid, owner });
    }
  }

  // console.log("alchemyNftList", nfts);
  return nfts;
};

const alchemyFetch = async (chainId: number, path: string): Promise<unknown> => {
  const url = alchemyUrl(chainId);
  if (!(chainId && url && path)) return;

  const urlPath = `${alchemyUrl(chainId)}${path}`;
  // console.log("alchemyFetch ~ urlPath", urlPath);

  const config = {
    method: "GET",
    headers: { Accept: "application/json" }
  };
  const alchemyAnswer: FetchResponse = await fetchJson(urlPath, config);
  // console.log("alchemyFetch ~ alchemyAnswer", urlPath, alchemyAnswer);

  if (alchemyAnswer.error) console.error("alchemyFetch ERROR", alchemyAnswer.error);
  return alchemyAnswer;
};

const alchemyActive = (chainId: number): boolean => Boolean(networks.get(chainId)?.alchemy?.active);

const alchemyUrl = (chainId: number): string => (alchemyActive(chainId) && networks.get(chainId)?.alchemy?.url) || "";

export { alchemyActive, alchemyFetch, alchemyNftList, alchemyCollections };
