import { getExplorer, getOpenSea, getOpenNFTsAddress, nftUrl } from "./kconfig";
import type { Collection, Nft } from "./kconfig";

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

const numberToHexString = (num: number): string => `0x${num.toString(16)}`;
const textShort = (s = "", n = 16, p?: number): string => {
  p = p === undefined ? n : p;
  const l = s?.toString().length;
  return s?.substring(0, n) + (l < n ? "" : "..." + (p > 0 ? s?.substring(l - p, l) : ""));
};
const addressShort = (a = "", n = 8): string =>
  a.endsWith(".eth") ? textShort(a, 2 * n, 0) : textShort(a, n, n);

const urlToLink = (url: string, label?: string): string =>
  `<a href="${url}" target="_blank">${label || url}</a>`;

// IPFS helpers
const ipfsUrl = (cid: string): string => `ipfs://${cid}`;
const ipfsGatewayUrl = (cid: string): string => `${ipfsGateway}${cid}`;
const ipfsGatewayLink = (cid: string): string => urlToLink(ipfsGatewayUrl(cid), addressShort(cid));

// EXPLORER helpers
const explorerUrl = (chainId: number, path: string): string =>
  getExplorer(chainId) + "/" + path.replace(/^\//, "");
const explorerLink = (chainId: number, path: string, label: string): string =>
  urlToLink(explorerUrl(chainId, path), label);
const explorerAddressUrl = (chainId: number, address: string): string =>
  explorerUrl(chainId, `/address/${address}`);
const explorerAddressLink = (chainId: number, address: string): string =>
  explorerLink(chainId, `/address/${address}`, addressShort(address));
const explorerTxUrl = (chainId: number, tx: string): string => explorerUrl(chainId, `/tx/${tx}`);
const explorerTxLink = (chainId: number, tx: string): string =>
  urlToLink(explorerTxUrl(chainId, tx), addressShort(tx));

// COLLECTION helpers
const collectionName = (collection: Collection): string => collection?.name || "No name";
const collectionSymbol = (collection: Collection): string => collection?.symbol || "NFT";
const collectionOpenSeaLink = (chainId: number): string => getOpenSea(chainId)?.kredeum;

const explorerCollectionUrl = (chainId: number, collAddress: string): string =>
  getExplorer(chainId)?.includes("chainstacklabs.com")
    ? explorerUrl(chainId, `/collection/${collAddress}/tokens`)
    : explorerUrl(chainId, `/token/${collAddress}`);
const explorerCollectionLink = (chainId: number, collAddress: string): string =>
  urlToLink(explorerCollectionUrl(chainId, collAddress), addressShort(collAddress));
const explorerOpenNFTsUrl = (chainId: number): string =>
  explorerCollectionUrl(chainId, getOpenNFTsAddress(chainId));
const explorerCollectionInventoryLink = (chainId: number, collAddress: string): string =>
  urlToLink(explorerCollectionInventoryUrl(chainId, collAddress), addressShort(collAddress));
const explorerCollectionInventoryUrl = (chainId: number, collAddress: string): string =>
  getExplorer(chainId)?.includes("chainstacklabs.com") ||
  getExplorer(chainId)?.includes("cchain.explorer")
    ? explorerUrl(chainId, `/tokens/${collAddress}/inventory`)
    : explorerUrl(chainId, `/token/${collAddress}#inventory`);

// NFTS helpers
const nftsSupply = (nfts: Array<Nft>): number => nfts.length || 0;
const nftsSupplyAndName = (nfts: Array<Nft>, collection: Collection): string =>
  `${nftsSupply(nfts)} ${collectionSymbol(collection)}${nftsSupply(nfts) > 1 ? "s" : ""}`;

// NFT helpers
const nftExplorerLink = (nft: Nft): string =>
  urlToLink(explorerNftUrl(nft.chainId, nft), nftUrl(nft.chainId, nft.collection, nft.tokenID));
const nftImageLink = (nft: Nft): string => ipfsReplace(nft.image);

const nftOpenSeaUrl = (chainId: number, nft: Nft): string => {
  const openSea = getOpenSea(chainId);
  return `${openSea?.assets}/${nft.collection}/${nft.tokenID}`;
};

const nftName = (nft: Nft): string => nft.name || `${nft.contractName} #${nft.tokenID}`;
const nftDescription = (nft: Nft): string =>
  (nft.name != nft.description && nft.description) || nftName(nft);
const nftDescriptionShort = (nft: Nft, n = 16): string => textShort(nftDescription(nft), n, 0);

const explorerNftUrl = (chainId: number, nft: Nft): string =>
  getExplorer(chainId)?.includes("chainstacklabs.com")
    ? explorerUrl(chainId, `/tokens/${nft.collection}/instance/${nft.tokenID}/metadata`)
    : explorerUrl(chainId, `/token/${nft.collection}?a=${nft.tokenID}`);
const explorerNftLink = (chainId: number, nft: Nft, label?: string): string =>
  urlToLink(explorerNftUrl(chainId, nft), label || nftName(nft));

export {
  sleep,
  numberToHexString,
  urlToLink,
  textShort,
  ipfsUrl,
  ipfsGatewayUrl,
  ipfsGatewayLink,
  addressSame,
  addressShort,
  collectionName,
  collectionSymbol,
  collectionOpenSeaLink,
  nftUrl,
  nftImageLink,
  nftDescription,
  nftDescriptionShort,
  nftExplorerLink,
  nftName,
  nftsSupplyAndName,
  nftOpenSeaUrl,
  explorerOpenNFTsUrl,
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
