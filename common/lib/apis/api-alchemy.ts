import { BigNumber } from "ethers";

import type { CollectionFilterType, CollectionType, NftType } from "@lib/common/types";
import type { FetchResponse } from "@lib/common/fetch";
import { fetchJson, FETCH_LIMIT } from "@lib/common/fetch";
import { getChecksumAddress, getNetwork, getChainName, isAddressNotZero } from "@lib/common/config";
import { keyCollections, keyNft } from "@lib/common/keys";
import { constants } from "ethers";

const alchemyCollections = async (chainId: number, account: string): Promise<Map<string, CollectionType>> => {
  // console.log(`alchemyCollections ${keyCollections(chainId, account)}\n`);

  const collections: Map<string, CollectionType> = new Map();
  const chainName = getChainName(chainId);

  if (!(chainId && chainName && isAddressNotZero(account))) return collections;

  type AlchemyCollection = {
    contract: { address: string };
    id: { tokenId: string };
    balance: string;
  };
  type AlchemyCollectionsAnswer = {
    ownedNfts?: Array<AlchemyCollection>;
    totalCount: number;
  };
  const alchemyCollectionsAnswer = (await alchemyFetch(
    chainId,
    `/getNFTs?owner=${account}&withMetadata=true`
  )) as AlchemyCollectionsAnswer;
  // console.log("AlchemyCollectionsAnswer", AlchemyCollectionsAnswer);
  if (!alchemyCollectionsAnswer) return collections;

  const totalCount = alchemyCollectionsAnswer.totalCount || 0;
  const ownedNfts = alchemyCollectionsAnswer.ownedNfts;
  if (!(ownedNfts && totalCount > 0)) return collections;

  let index = 0;
  for (const ownedNft of ownedNfts) {
    if (index++ >= 100) break;

    const address = getChecksumAddress(ownedNft.contract?.address);
    const collKey = keyCollections(chainId, address);

    const previousCollection = collections.get(collKey);
    const count = Number(previousCollection?.balancesOf?.get(account) || 0);
    const collection = {
      chainId,
      address,
      balancesOf: new Map([[account, count + 1]])
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
  console.log("alchemyNftList", chainId, address, owner, limit);

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
    const alchemyAnswerNftsCollection = (await alchemyFetch(
      chainId,
      `/getNFTsForCollection?contractAddress=${collection.address}&limit=${limit}&withMetadata=true`
    )) as AlchemyAnwserNftsCollection;

    for (const collectionNft of alchemyAnswerNftsCollection.nfts) {
      const tokenID = BigNumber.from(collectionNft.id?.tokenId).toString();
      const nid = keyNft(chainId, collection.address, tokenID);
      const tokenURI = collectionNft.tokenUri?.gateway;

      nfts.set(nid, { chainId, address, tokenID, tokenURI, nid });
    }
  } else {
    const alchemyAnswerNftsOwner = (await alchemyFetch(
      chainId,
      `/getNFTs?owner=${owner}&contractAddresses[]=${collection.address}&pageSize=${limit}&withMetadata=true`
    )) as AlchemyAnwserNftsOwner;

    for (const ownedNft of alchemyAnswerNftsOwner.ownedNfts) {
      const tokenID = BigNumber.from(ownedNft.id?.tokenId).toString();
      const nid = keyNft(chainId, collection.address, tokenID);
      const tokenURI = ownedNft.tokenUri?.gateway;

      nfts.set(nid, { chainId, address, tokenID, tokenURI, nid, owner });
    }
  }

  console.log("alchemyNftList", nfts);
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
  // console.log("alchemyFetch ~ alchemyAnswer", alchemyAnswer);

  if (alchemyAnswer.error) console.error("alchemyFetch ERROR", alchemyAnswer.error);
  return alchemyAnswer;
};

const alchemyActive = (chainId: number): boolean => Boolean(getNetwork(chainId)?.alchemy?.active);

const alchemyUrl = (chainId: number): string => (alchemyActive(chainId) && getNetwork(chainId)?.alchemy?.url) || "";

export { alchemyActive, alchemyFetch, alchemyNftList, alchemyCollections };
