import type { Provider } from "@ethersproject/providers";
import type { Collection, Nft } from "./ktypes";

import {
  getExplorer,
  getOpenSeaAssets,
  getOpenNFTsAddress,
  collectionGetNFTsFactoryAddress,
  getShortAddress,
  textShort,
  nftUrl
} from "./kconfig";

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
/////////////////////////////////////////////////////////////////////////////////////////////////////

/////////////////////////////////////////////////////////////////////////////////////////////////////
// IPFS helpers
/////////////////////////////////////////////////////////////////////////////////////////////////////
const ipfsUrl = (cid: string): string => `ipfs://${cid}`;

const ipfsGatewayUrl = (cid: string): string => `${ipfsGateway}${cid}`;

const ipfsGatewayLink = (cid: string): string => urlToLink(ipfsGatewayUrl(cid), textShort(cid));
/////////////////////////////////////////////////////////////////////////////////////////////////////

/////////////////////////////////////////////////////////////////////////////////////////////////////
// EXPLORER URL helpers
/////////////////////////////////////////////////////////////////////////////////////////////////////
// BASIC URL
const explorerUrl = (chainId: number, path: string): string =>
  // https://etherscan.io/gastracker
  getExplorer(chainId) + "/" + path.replace(/^\//, "");

// ADDRESS URL
const explorerAddressUrl = (chainId: number, address: string): string =>
  // https://etherscan.io/address/0x4b7992F03906F7bBE3d48E5Fb724f52c56cFb039
  explorerUrl(chainId, `/address/${address}`);

// TX URL
const explorerTxUrl = (chainId: number, tx: string): string =>
  // https://etherscan.io/tx/0xf7a974c93ee811863ce31e642880d9c5883995f8492783227f92fa43c2bee177
  explorerUrl(chainId, `/tx/${tx}`);

// ACCOUNT URL
const explorerAccountUrl = (chainId: number, address: string): string => {
  let url = "";
  if (
    getExplorer(chainId)?.includes("chainstacklabs.com") ||
    getExplorer(chainId)?.includes("blockscout.com")
  ) {
    // https://polygon-explorer-mumbai.chainstacklabs.com/address/0x79ae5d3FE295d81342A49aECE586716D60b37C6b/tokens
    // https://blockscout.com/xdai/mainnet/address/0x981ab0D817710d8FFFC5693383C00D985A3BDa38/tokens
    url = explorerUrl(chainId, `/address/${address}/tokens/`);
  } else {
    // https://etherscan.io/address/0x981ab0d817710d8fffc5693383c00d985a3bda38#tokentxnsErc721
    // https://etherscan.io/tokenholdings?a=0x981ab0D817710d8FFFC5693383C00D985A3BDa38
    url = explorerUrl(chainId, `/address/${address}#tokentxnsErc721`);
    // url = explorerUrl(chainId, `/tokenholdings?a=${address}`);
  }
  return url;
};

// CONTRACT URL
const explorerContractUrl = (chainId: number, address: string): string => {
  let url = "";
  if (
    getExplorer(chainId)?.includes("chainstacklabs.com") ||
    getExplorer(chainId)?.includes("blockscout.com")
  ) {
    // https://polygon-explorer-mumbai.chainstacklabs.com/address/0x601f2A498dAabd94cc4bBb2F04F21aff7f6D9175/contracts
    // https://blockscout.com/xdai/mainnet/address/0x22C1f6050E56d2876009903609a2cC3fEf83B415/contracts
    url = explorerUrl(chainId, `/address/${address}/contracts`);
  } else {
    // https://etherscan.io/address/0x4b7992F03906F7bBE3d48E5Fb724f52c56cFb039#readContract
    url = explorerUrl(chainId, `/address/${address}#readContract`);
  }
  return url;
};

// COLLECTION URL
const explorerCollectionUrl = (chainId: number, collAddress = ""): string => {
  let url = "";
  if (
    getExplorer(chainId)?.includes("chainstacklabs.com") ||
    getExplorer(chainId)?.includes("blockscout.com")
  ) {
    // https://blockscout.com/xdai/mainnet/token/0x74e596525C63393f42C76987b6A66F4e52733efa/inventory
    url = explorerUrl(chainId, `/token/${collAddress}/inventory`);
  } else {
    // https://etherscan.io/token/0x82a398243ebc2cb26a4a21b9427ec6db8c224471#inventory
    url = explorerUrl(chainId, `/token/${collAddress}#inventory`);
  }
  return url;
};

// NFT URL
const explorerNftUrl = (chainId: number, nft: Nft): string => {
  let url = "";
  if (
    getExplorer(chainId)?.includes("chainstacklabs.com") ||
    getExplorer(chainId)?.includes("blockscout.com")
  ) {
    // https://blockscout.com/xdai/mainnet/token/0x22C1f6050E56d2876009903609a2cC3fEf83B415/instance/3249859/metadata
    url = explorerUrl(chainId, `/tokens/${nft?.collection}/instance/${nft?.tokenID}/metadata`);
    url = explorerUrl(chainId, `/token/${nft?.collection}/instance/${nft?.tokenID}/metadata`);
  } else {
    // https://etherscan.io/token/0x82a398243EBc2CB26a4A21B9427EC6Db8c224471?a=1
    url = explorerUrl(chainId, `/token/${nft?.collection}?a=${nft?.tokenID}#inventory`);
  }
  return url;
};

// NFTS_FACTORY URL
const explorerNFTsFactoryUrl = (chainId: number): string =>
  // https://blockscout.com/xdai/mainnet/address/0x86246ba8F7b25B1650BaF926E42B66Ec18D96000/read-contract
  // https://etherscan.io/address/0x4b7992F03906F7bBE3d48E5Fb724f52c56cFb039#readContract
  explorerContractUrl(chainId, collectionGetNFTsFactoryAddress(chainId));

// OPEN_NFTS URL
const explorerOpenNFTsUrl = async (chainId: number, provider: Provider): Promise<string> =>
  // https://etherscan.io/address/0x82a398243EBc2CB26a4A21B9427EC6Db8c224471#readContract
  explorerContractUrl(chainId, await getOpenNFTsAddress(chainId, provider));
/////////////////////////////////////////////////////////////////////////////////////////////////////

/////////////////////////////////////////////////////////////////////////////////////////////////////
// EXPLORER LINK helpers
/////////////////////////////////////////////////////////////////////////////////////////////////////
const explorerLink = (chainId: number, path: string, label: string): string =>
  urlToLink(explorerUrl(chainId, path), label);

const explorerAddressLink = (chainId: number, address: string, n?: number): string =>
  urlToLink(explorerAddressUrl(chainId, address), getShortAddress(address, n));

const explorerTxLink = (chainId: number, tx: string): string =>
  urlToLink(explorerTxUrl(chainId, tx), getShortAddress(tx));

const explorerNftLink = (chainId: number, nft: Nft, label?: string): string =>
  urlToLink(explorerNftUrl(chainId, nft), label || nftName(nft));

/////////////////////////////////////////////////////////////////////////////////////////////////////
// COLLECTION helpers
/////////////////////////////////////////////////////////////////////////////////////////////////////
const collectionName = (collection: Collection): string => collection?.name || "No name";

const collectionSymbol = (collection: Collection): string => collection?.symbol || "NFT";

const explorerCollectionLink = (chainId: number, collAddress: string): string =>
  urlToLink(explorerCollectionUrl(chainId, collAddress), getShortAddress(collAddress));

/////////////////////////////////////////////////////////////////////////////////////////////////////
// NFTS helpers
/////////////////////////////////////////////////////////////////////////////////////////////////////
const nftsSupply = (nfts: Map<string, Nft>): number => nfts.size || 0;

const nftsBalanceAndName = (collection: Collection): string =>
  `${collection?.balanceOf} ${collectionSymbol(collection)}${
    (collection?.balanceOf || 0) > 1 ? "s" : ""
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
/////////////////////////////////////////////////////////////////////////////////////////////////////

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
  collectionGetNFTsFactoryAddress,
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
  explorerCollectionUrl,
  explorerCollectionLink,
  explorerNftUrl,
  explorerAccountUrl,
  explorerNftLink
};
