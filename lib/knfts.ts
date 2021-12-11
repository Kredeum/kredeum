import {
  getExplorer,
  getOpenSeaAssets,
  getOpenNFTsAddress,
  getNFTsFactoryAddress,
  getShortAddress,
  textShort,
  nftUrl
} from "./kconfig";
import type { Collection, Nft } from "./ktypes";

// CONSTANT
const ipfsGateway = "https://ipfs.io/ipfs/";

const ipfsReplace = (url = ""): string => {
  url = url.replace("ipfs://ipfs/", ipfsGateway);
  url = url.replace("ipfs://", ipfsGateway);
  url = url.replace("https://gateway.pinata.cloud/ipfs/", ipfsGateway);
  return url;
};

// GENERIC helpers
const sleep = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));

const addressSame = (a: string, b: string): boolean => a.toLowerCase() === b.toLowerCase();

const numberToHexString = (num = 0): string => "0x" + Number(num).toString(16);

const urlToLink = (url: string, label?: string): string =>
  `<a href="${url}" target="_blank">${label || url}</a>`;

// IPFS helpers
const ipfsUrl = (cid: string): string => `ipfs://${cid}`;

const ipfsGatewayUrl = (cid: string): string => `${ipfsGateway}${cid}`;

const ipfsGatewayLink = (cid: string): string => urlToLink(ipfsGatewayUrl(cid), textShort(cid));

// EXPLORER helpers
const explorerUrl = (chainId: number, path: string): string =>
  getExplorer(chainId) + "/" + path.replace(/^\//, "");

const explorerLink = (chainId: number, path: string, label: string): string =>
  urlToLink(explorerUrl(chainId, path), label);

const explorerAddressUrl = (chainId: number, address: string): string =>
  explorerUrl(chainId, `/address/${address}`);

const explorerAddressLink = (chainId: number, address: string, n?: number): string =>
  explorerLink(chainId, `/address/${address}`, getShortAddress(address, n));

const explorerTxUrl = (chainId: number, tx: string): string => explorerUrl(chainId, `/tx/${tx}`);

const explorerTxLink = (chainId: number, tx: string): string =>
  urlToLink(explorerTxUrl(chainId, tx), getShortAddress(tx));

// COLLECTION helpers
const collectionName = (collection: Collection): string => collection?.name || "No name";

const collectionSymbol = (collection: Collection): string => collection?.symbol || "NFT";

const explorerCollectionUrl = (chainId: number, collAddress = ""): string =>
  getExplorer(chainId)?.includes("chainstacklabs.com")
    ? explorerUrl(chainId, `/collection/${collAddress}/tokens`)
    : explorerUrl(chainId, `/token/${collAddress}`);

const explorerCollectionLink = (chainId: number, collAddress: string): string =>
  urlToLink(explorerCollectionUrl(chainId, collAddress), getShortAddress(collAddress));

const explorerOpenNFTsUrl = (chainId: number): string =>
  explorerCollectionUrl(chainId, getOpenNFTsAddress(chainId));

const explorerNFTsFactoryUrl = (chainId: number): string =>
  explorerCollectionUrl(chainId, getNFTsFactoryAddress(chainId));

const explorerCollectionInventoryLink = (chainId: number, collAddress: string): string =>
  urlToLink(explorerCollectionInventoryUrl(chainId, collAddress), getShortAddress(collAddress));

const explorerCollectionInventoryUrl = (chainId: number, collAddress: string): string =>
  getExplorer(chainId)?.includes("chainstacklabs.com") ||
    getExplorer(chainId)?.includes("cchain.explorer")
    ? explorerUrl(chainId, `/tokens/${collAddress}/inventory`)
    : explorerUrl(chainId, `/token/${collAddress}#inventory`);

// NFTS helpers
const nftsSupply = (nfts: Map<string, Nft>): number => nfts.size || 0;

const nftsBalanceAndName = (collection: Collection): string =>
  `${collection?.balanceOf} ${collectionSymbol(collection)}${(collection?.balanceOf || 0) > 1 ? "s" : ""
  }`;

// NFT helpers
const nftExplorerLink = (nft: Nft, n?: number): string =>
  urlToLink(explorerNftUrl(nft?.chainId, nft), nftUrl(nft, n));

const nftImageLink = (nft: Nft): string => ipfsReplace(nft?.image);

const nftOpenSeaUrl = (chainId: number, nft: Nft): string => {
  const openSeaAssets = getOpenSeaAssets(chainId);
  return `${openSeaAssets}/${nft?.collection}/${nft?.tokenID}`;
};

const nftName = (nft: Nft): string =>
  nft?.name || `${nft?.contractName || "No name"} #${nft?.tokenID}`;

const nftDescription = (nft: Nft): string =>
  (nft?.name != nft?.description && nft?.description) || nftName(nft);

const nftDescriptionShort = (nft: Nft, n = 16): string => textShort(nftDescription(nft), n, 0);

const explorerNftUrl = (chainId: number, nft: Nft): string =>
  getExplorer(chainId)?.includes("chainstacklabs.com")
    ? explorerUrl(chainId, `/tokens/${nft?.collection}/instance/${nft?.tokenID}/metadata`)
    : explorerUrl(chainId, `/token/${nft?.collection}?a=${nft?.tokenID}`);

const explorerNftLink = (chainId: number, nft: Nft, label?: string): string =>
  urlToLink(explorerNftUrl(chainId, nft), label || nftName(nft));

export {
  sleep,
  textShort,
  numberToHexString,
  urlToLink,
  ipfsUrl,
  ipfsGatewayUrl,
  ipfsGatewayLink,
  addressSame,
  getShortAddress,
  collectionName,
  collectionSymbol,
  nftImageLink,
  nftDescription,
  nftDescriptionShort,
  nftExplorerLink,
  nftName,
  nftsSupply,
  nftsBalanceAndName,
  nftOpenSeaUrl,
  explorerOpenNFTsUrl,
  explorerNFTsFactoryUrl,
  explorerLink,
  explorerAddressUrl,
  explorerAddressLink,
  explorerTxUrl,
  explorerTxLink,
  explorerCollectionInventoryUrl,
  explorerCollectionInventoryLink,
  explorerCollectionUrl,
  explorerCollectionLink,
  explorerNftUrl,
  explorerNftLink
};
