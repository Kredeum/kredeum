import { BigNumber } from "ethers";

import type { CollectionType, NftType } from "@lib/common/types";
import type { FetchResponse } from "@lib/common/fetch";
import { fetchJson, FETCH_LIMIT } from "@lib/common/fetch";
import { getChecksumAddress, getNetwork, getChainName } from "@lib/common/config";
import { keyCollectionList, keyNft } from "@lib/common/keys";

const alchemyCollectionList = async (chainId: number, account: string): Promise<Map<string, CollectionType>> => {
  // console.log(`alchemyCollectionList ${keyCollectionList(chainId, account)}\n`);

  const collections: Map<string, CollectionType> = new Map();
  const chainName = getChainName(chainId);

  if (!(chainId && chainName && account)) return collections;

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

  for (let index = 0; index < Math.min(100, totalCount); index++) {
    const ownedNft = ownedNfts[index];
    // console.log("alchemyCollectionList", ownedNft);

    const address = getChecksumAddress(ownedNft.contract?.address);
    const collKey = keyCollectionList(chainId, address);

    const previousCollection = collections.get(collKey);
    const count = Number(previousCollection?.balancesOf?.get(account) || 0);
    const collection = {
      chainId,
      address,
      balancesOf: new Map([[account, count + 1]])
    };

    collections.set(collKey, collection);
  }
  // console.log("alchemyCollectionList OUT", collections);
  return collections;
};

const alchemyNftList = async (
  chainId: number,
  collection: CollectionType,
  account?: string,
  limit: number = FETCH_LIMIT
): Promise<Map<string, NftType>> => {
  // console.log("alchemyNftList", chainId, collection, account);

  const nfts: Map<string, NftType> = new Map();
  const network = getNetwork(chainId);

  if (!(chainId && collection && account && network)) return nfts;

  type AchemyNfts = {
    contract: { address: string };
    id: { tokenId: string };
    tokenUri: { gateway: string };
    balance: string;
  };
  type AnswerNftsAlch = {
    ownedNfts?: Array<AchemyNfts>;
    totalCount: number;
  };
  const alchemyAnswerNfts = (await alchemyFetch(
    chainId,
    `/getNFTs?owner=${account}&withMetadata=true&contractAddresses[]=${collection.address}`
  )) as AnswerNftsAlch;
  // console.log("alchemyAnswerNfts", alchemyAnswerNfts);

  const totalCount = alchemyAnswerNfts.totalCount;
  const ownedNfts = alchemyAnswerNfts.ownedNfts;
  if (!(ownedNfts && totalCount >= 0)) return nfts;

  for (let index = 0; index < Math.min(totalCount, limit); index++) {
    const ownedNft = ownedNfts[index];
    // console.log("alchemyNftList TOKEN", _token);

    const tokenID = BigNumber.from(ownedNft.id?.tokenId).toString();
    if (index < limit) {
      const nft = {
        chainId,
        address: getChecksumAddress(collection.address),
        tokenID,
        tokenURI: ownedNft.tokenUri?.gateway,
        nid: keyNft(chainId, collection.address, tokenID),
        owner: getChecksumAddress(account)
      };
      nfts.set(nft.nid, nft);
    }
  }

  // console.log("alchemyNftList", nfts);
  return nfts;
};

const alchemyFetch = async (chainId: number, path: string): Promise<unknown> => {
  const url = alchemyUrl(chainId);
  if (!(chainId && url && path)) return;

  const urlPath = `${alchemyUrl(chainId)}${path}`;
  console.log("alchemyFetch ~ urlPath", urlPath);

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

export { alchemyActive, alchemyFetch, alchemyNftList, alchemyCollectionList };
