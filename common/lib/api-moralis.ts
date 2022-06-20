import Moralis from "moralis";

import type { CollectionType, NftType } from "./ktypes";
import { getNetwork, getChainName } from "lib/kconfig";
import { FETCH_LIMIT } from "lib/kfetch";
import { collectionListKey } from "lib/kconfig";

const moralisNftList = async (
  chainId: number,
  collection: CollectionType,
  account?: string,
  limit: number = FETCH_LIMIT
): Promise<Map<string, NftType>> => {
  console.log("moralisNftList  IN", chainId, collection.address, account, limit);

  const nfts: Map<string, NftType> = new Map();
  const network = getNetwork(chainId);

  if (network && collection) {
    //
  }
  // console.log("moralisNftList OUT", nfts.length);
  console.log("moralisNftList OUT", nfts);

  return nfts;
};

const moralisCollectionList = async (chainId: number, account: string): Promise<Map<string, CollectionType>> => {
  console.log(`moralisCollectionList  IN ${collectionListKey(chainId, account)}\n`);

  const collections: Map<string, CollectionType> = new Map();

  if (account) {
    // const chain = getChainName(chainId);
    // const address = account;

    const serverUrl = "";
    const appId = "";
    await Moralis.start({ serverUrl, appId });

    // Get NFTs for user
    // const Nfts = await Moralis.Web3API.account.getNFTs({ chain, address });
    // console.log("moralisCollectionList ~ Nfts", Nfts);

    //
  }
  console.log(`moralisCollectionList OUT ${collectionListKey(chainId, account)}\n`, collections);
  return collections;
};

const moralisGet = (chainId: number): boolean => Boolean(getNetwork(chainId)?.moralis?.active);
const moralisGetUrl = (chainId: number): string =>
  (getNetwork(chainId)?.moralis?.active && getNetwork(chainId)?.moralis?.url) || "";

export { moralisCollectionList, moralisGet, moralisNftList, moralisGetUrl };
