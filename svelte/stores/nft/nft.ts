import { NftType } from "lib/ktypes";
import { nftListStore } from "./nftList";

// UTILITIES
const nftGetKey = (chainId: number, address: string, tokenID: string): string =>
  `nft://${String(chainId)}/${address}/${tokenID}`;

const nftUpdateOne = (nft: NftType) => {
  if (!nft) return "";
  // console.log("nftUpdateOne", nft);

  const { chainId, address, tokenID } = nft;
  if (!(chainId && address && tokenID)) return;
  console.log("nftUpdateOne", chainId, address, tokenID);

  const key = nftGetKey(chainId, address, tokenID);

  if (typeof localStorage !== "undefined") {
    localStorage.setItem(key, JSON.stringify(nft));
  }

  nftListStore.update(($nftListStore: Map<string, NftType>): Map<string, NftType> => {
    return $nftListStore.set(key, nft);
  });
};

export {};

export const nftStore = {
  updateOne: nftUpdateOne,
  // get: nftGetStore,
  // getOne: nftGetOne,
  // refresh: nftRefresh,
  nftGetKey
};
