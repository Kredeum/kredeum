import { getChecksumAddress } from "./config";
import type { CollectionType, NftType } from "./types";

const keyCollection = (chainId: number, address: string, account?: string): string =>
  `collection://${String(chainId)}/${address}${account ? "@" + account : ""}`;

const keyCollections = (chainId: number, account?: string, mintable = false): string =>
  `collectionList${mintable ? "Mintable" : ""}://${String(chainId)}${account ? "@" + account : ""}`;

const keyCollectionInverse = (key: string): CollectionType => {
  const [key1] = key.split("@");
  const [chId, addr] = key1.replace("collection://", "").split("/");
  const chainId = Number(chId);
  const address = getChecksumAddress(addr);
  return { chainId, address };
};

const keyCollectionDefault = (chainId: number, account?: string): string =>
  `collectionDefault://${String(chainId)}${account ? "@" + account : ""}`;

const keyCollectionContract = (chainId: number, address: string, getSigner: boolean): string =>
  keyCollection(chainId, address) + (getSigner ? "/signer" : "/provider");

const keyNft = (chainId: number, address: string, tokenID: string, account?: string): string =>
  `nft://${String(chainId)}/${address}/${tokenID}${account ? "@" + account : ""}`;

const keyStats = (chainId: number): string => `stats://${String(chainId)}`;

const keyNftInverse = (key: string): NftType => {
  const [key1] = key.split("@");
  const [chId, addr, tokenID] = key1.replace("nft://", "").split("/");
  const chainId = Number(chId);
  const address = getChecksumAddress(addr);
  return { chainId, address, tokenID };
};

export {
  keyCollection,
  keyCollections,
  keyCollectionInverse,
  keyCollectionDefault,
  keyCollectionContract,
  keyStats,
  keyNft,
  keyNftInverse
};
