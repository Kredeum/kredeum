// import Moralis from "moralis";

import type Moralis from "moralis";
import type { operations } from "moralis/types/generated/web3Api";

import type { CollectionFilterType, CollectionType, NftType } from "@lib/common/types";
import { getNetwork, getChecksumAddress } from "@lib/common/config";
import { FETCH_LIMIT } from "@lib/common/fetch";

import { toBeHex, ZeroAddress } from "ethers";
import { keyCollection, keyNft } from "@lib/common/keys";

const moralisListAll = async (
  chainId: number,
  account: string,
  limit: number = FETCH_LIMIT
): Promise<{ nfts: Map<string, NftType>; collections: Map<string, CollectionType> }> => {
  // console.log("moralisListAll  IN", account, limit);

  const nfts: Map<string, NftType> = new Map();
  const collections: Map<string, CollectionType> = new Map();

  const serverUrl = process.env.MORALIS_SERVER_URL;
  const appId = process.env.MORALIS_APP_ID;
  const moralis: Moralis = (globalThis as typeof globalThis & { Moralis: Moralis }).Moralis;

  if (!moralis) {
    console.error("ERROR : Moralis not found");
    return { nfts, collections };
  }

  await moralis.start({ serverUrl, appId });
  // console.log("moralisListAll ~ moralis.start");

  // Get NFTs for user
  const options = {
    chain: toBeHex(chainId),
    address: account
  } as operations["getNFTs"]["parameters"]["query"] & operations["getNFTs"]["parameters"]["path"];

  const nftsMoralist = await moralis.Web3API.account.getNFTs(options);
  // console.log("moralisListAll ~ nftsMoralist", nftsMoralist);

  let index = 0;
  for (const nftMoralis of nftsMoralist.result || []) {
    if (index++ >= limit) break;

    // console.log("moralisCollections ~ nftMoralis", nftMoralis);
    const address = getChecksumAddress(nftMoralis.token_address);
    const owner = getChecksumAddress(account);
    const balancesOf: Map<string, number> = new Map();
    balancesOf.set(owner, 1);

    const nft: NftType = {
      chainId,
      address,
      tokenID: nftMoralis.token_id,
      tokenURI: nftMoralis.token_uri,
      metadata: nftMoralis.metadata,
      owner
    };
    const collection: CollectionType = {
      chainId,
      address,
      name: nftMoralis.name,
      symbol: nftMoralis.symbol,
      balancesOf
    };
    nfts.set(keyNft(nft.chainId, nft.address, nft.tokenID), nft);
    collections.set(keyCollection(nft.chainId, nft.address), collection);
  }

  // console.log("moralisListAll OUT", nfts.length);
  // console.log("moralisListAll OUT", nfts, collections);

  return { nfts, collections };
};

const moralisNftList = async (
  chainId: number,
  collection: CollectionType,
  filter: CollectionFilterType = {}
): Promise<Map<string, NftType>> => {
  const owner = filter.owner || ZeroAddress;
  const limit = filter.limit || FETCH_LIMIT;
  const nfts = (await moralisListAll(chainId, owner, limit)).nfts;

  // console.log(`moralisNftList OUT ${keyNftList(chainId, collection.address)}\n`, nfts);
  return nfts;
};

const moralisCollections = async (chainId: number, account: string): Promise<Map<string, CollectionType>> => {
  const collections = (await moralisListAll(chainId, account || "")).collections;

  // console.log(`moralisCollections OUT ${keyCollections(chainId, account)}\n`, collections);
  return collections;
};

const moralisActive = (chainId: number): boolean => Boolean(getNetwork(chainId)?.moralis?.active);
const moralisGetUrl = (chainId: number): string =>
  (getNetwork(chainId)?.moralis?.active && getNetwork(chainId)?.moralis?.url) || "";

export { moralisCollections, moralisActive, moralisNftList, moralisGetUrl, moralisListAll };
