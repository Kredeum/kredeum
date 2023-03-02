const keyCollectionContract = (chainId: number, address: string, getSigner: boolean): string =>
  keyCollection(chainId, address) + (getSigner ? "/signer" : "/provider");

const keyCollection = (chainId: number, address: string, account?: string): string =>
  `collection://${String(chainId)}/${address}${account ? "@" + account : ""}`;

// UTILITY : GET Key
const keyCollectionDefault = (chainId: number, account: string): string =>
  `collectionDefault://${String(chainId)}${account ? "@" + account : ""}`;

const keyCollections = (chainId: number, account?: string, mintable = false): string =>
  `collectionList${mintable ? "Mintable" : ""}://${String(chainId)}${account ? "@" + account : ""}`;

const keyNft = (chainId: number, address: string, tokenID: string, account?: string): string =>
  `nft://${String(chainId)}/${address}/${tokenID}${account ? "@" + account : ""}`;

const keyNftList = (chainId: number, address: string, account?: string): string =>
  `nftList://${String(chainId)}/${address}${account ? "@" + account : ""}`;

export { keyNft, keyNftList, keyCollection, keyCollectionDefault, keyCollections, keyCollectionContract };
