// import Moralis from "moralis";

import type Moralis from "moralis";
import type { operations } from "moralis/types/generated/web3Api";

import type { CollectionType, NftType } from "@lib/common/ktypes";
import { getNetwork, nftKey, collectionKey, nftListKey, collectionListKey, getChecksumAddress } from "@lib/common/kconfig";
import { FETCH_LIMIT } from "@lib/common/kfetch";

import { utils } from "ethers";

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
  const options = { chain: utils.hexValue(chainId), address: account } as operations["getNFTs"]["parameters"]["query"] &
    operations["getNFTs"]["parameters"]["path"];

  const nftsMoralist = await moralis.Web3API.account.getNFTs(options);
  // console.log("moralisListAll ~ nftsMoralist", nftsMoralist);

  for (const nftMoralis of nftsMoralist.result || []) {
    // console.log("moralisCollectionList ~ nftMoralis", nftMoralis);
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
      collectionName: nftMoralis.name,
      collectionSymbol: nftMoralis.symbol,
      owner
    };
    const collection: CollectionType = {
      chainId,
      address,
      name: nftMoralis.name,
      symbol: nftMoralis.symbol,
      balancesOf
    };
    nfts.set(nftKey(nft.chainId, nft.address, nft.tokenID), nft);
    collections.set(collectionKey(nft.chainId, nft.address), collection);
  }

  // console.log("moralisListAll OUT", nfts.length);
  // console.log("moralisListAll OUT", nfts, collections);

  return { nfts, collections };
};

const moralisNftList = async (
  chainId: number,
  collection: CollectionType,
  account?: string,
  limit: number = FETCH_LIMIT
): Promise<Map<string, NftType>> => {
  const nfts = (await moralisListAll(chainId, account || "", limit)).nfts;

  // console.log(`moralisNftList OUT ${nftListKey(chainId, collection.address)}\n`, nfts);
  return nfts;
};

const moralisCollectionList = async (chainId: number, account: string): Promise<Map<string, CollectionType>> => {
  const collections = (await moralisListAll(chainId, account || "")).collections;

  // console.log(`moralisCollectionList OUT ${collectionListKey(chainId, account)}\n`, collections);
  return collections;
};

const moralisGet = (chainId: number): boolean => Boolean(getNetwork(chainId)?.moralis?.active);
const moralisGetUrl = (chainId: number): string =>
  (getNetwork(chainId)?.moralis?.active && getNetwork(chainId)?.moralis?.url) || "";

export { moralisCollectionList, moralisGet, moralisNftList, moralisGetUrl, moralisListAll };
