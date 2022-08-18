import { BigNumber } from "ethers";

import type { CollectionType, NftType } from "./ktypes";
import type { FetchResponse } from "@lib/kfetch";
import { fetchJson, FETCH_LIMIT } from "@lib/kfetch";
import { getChecksumAddress, getNetwork, getChainName, collectionUrl, nftKey } from "@lib/kconfig";

const alchemyCollectionList = async (chainId: number, account: string): Promise<Map<string, CollectionType>> => {
  // console.log(`alchemyCollectionList ${collectionListKey(chainId, account)}\n`);

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
  const AlchemyCollectionsAnswer = (await alchemyFetch(
    chainId,
    `/getNFTs?owner=${account}&withMetadata=false`
  )) as AlchemyCollectionsAnswer;
  // console.log("AlchemyCollectionsAnswer", AlchemyCollectionsAnswer);

  const totalCount = AlchemyCollectionsAnswer.totalCount;
  const ownedNfts = AlchemyCollectionsAnswer.ownedNfts;
  if (!(ownedNfts && totalCount >= 0)) return collections;

  for (let index = 0; index < totalCount; index++) {
    const ownedNft = ownedNfts[index];
    // console.log("alchemyCollectionList", ownedNft);

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
  // console.log("alchemyCollectionList ~ collections", collections);
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
        nid: nftKey(chainId, collection.address, tokenID),
        owner: getChecksumAddress(account)
      };
      nfts.set(nft.nid, nft);
    }
  }

  // console.log("alchemyNftList", nfts);
  return nfts;
};

const alchemyFetch = async (chainId: number, path: string): Promise<unknown> => {
  let alchemyKey = "";
  const alchemyUrl = alchemyGetUrl(chainId);

  if (chainId === 1) alchemyKey = `${process.env.ALCHEMY_API_KEY || ""}`;
  else if (chainId === 137) alchemyKey = `${process.env.ALCHEMY_API_KEY_POLYGON || ""}`;

  if (!(chainId && alchemyUrl && alchemyKey && path)) return;

  const url = `${alchemyUrl}/${alchemyKey}${path}`;
  // console.log("alchemyFetch ~ url", url);
  const config = {
    method: "GET",
    headers: { Accept: "application/json" }
  };

  const alchemyAnswer: FetchResponse = await fetchJson(url, config);
  // console.log("alchemyFetch ~ alchemyAnswer", alchemyAnswer);

  if (alchemyAnswer.error) console.error("alchemyFetch ERROR", alchemyAnswer.error);
  return alchemyAnswer;
};

const alchemyGet = (chainId: number): boolean => Boolean(getNetwork(chainId)?.alchemy?.active);

const alchemyGetUrl = (chainId: number): string =>
  (getNetwork(chainId)?.alchemy?.active && getNetwork(chainId)?.alchemy?.url) || "";

export { alchemyGet, alchemyGetUrl, alchemyFetch, alchemyNftList, alchemyCollectionList };
