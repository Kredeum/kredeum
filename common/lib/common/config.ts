import { FunctionFragment, getAddress, hexlify, TransactionResponse } from "ethers";
import { ZeroAddress, Fragment, Interface, isAddress } from "ethers";

import type { NetworkType, CollectionType, NftType, RefPageType } from "@lib/common/types";

import networks from "@config/networks.json";
import config from "@config/config.json";
import { HexString } from "ethers/types/utils/data";

const PAGE_SIZE = 12;
const MAX_FEE = 10000;
const DEFAULT_NAME = "No name";
const DEFAULT_SYMBOL = "NFT";

const copyToClipboard = async (data: string): Promise<void> =>
  await navigator.clipboard.writeText(data).catch(() => console.error("Not copied"));

const tokenIdSplit = (tokenIDs = ""): Array<string> => {
  const tokenIDsSanitize = tokenIDs.replace(/ /g, "");
  const tokenIDsArray = tokenIDsSanitize ? tokenIDsSanitize.split(",") : [];
  return tokenIDsArray;
};
const tokenIdCount = (tokenIDs: string): number => (tokenIDs === "" ? -1 : tokenIdSplit(tokenIDs).length);
const tokenIdSelected = (tokenIDs: string, tokenID: string): boolean =>
  !tokenIDs || tokenIdSplit(tokenIDs).includes(tokenID);

// const networks = networksJson as Array<NetworkType>;
const networksMap = new Map(networks.map((network) => [network.chainId, network]));

const isCollection = (refHash: RefPageType) => isNetwork(refHash.chainId) && isAddressNotZero(refHash.address);

const isAddressNotZero = (account = ""): boolean => isAddress(account) && account != ZeroAddress;

const getChecksumAddress = (address = ""): string => (isAddress(address) ? getAddress(address) : ZeroAddress);

const getChainId = (chainName: string): number | undefined =>
  networks.find((nw) => nw.chainName === chainName)?.chainId;

const isNetwork = (chainId: number | undefined): boolean => networksMap.has(Number(chainId));

const getNetwork = (chainId: number): NetworkType | undefined => networksMap.get(Number(chainId));

const getNetworkRpcUrls = (chainId: number): Array<string> => getNetwork(chainId)?.rpcUrls || [];

//  GET nftsResolver address
const getNftsResolver = (chainId: number): string => getNetwork(chainId)?.nftsResolver || "";

//  GET default OpenNFTs address
const getDefaultOpenNFTs = (chainId: number): string => getNetwork(chainId)?.openNFTs || "";

//  GET OpenMulti address
const getOpenMulti = (chainId: number): string => getNetwork(chainId)?.openMulti || "";

// GET explorer
const getExplorer = (chainId: number): string => getNetwork(chainId)?.blockExplorerUrls[0] || "";

// GET OpenSea
const getOpenSea = (chainId: number): string => getNetwork(chainId)?.openSea || "";
// GET OpenSea Url
const getOpenSeaUrl = (chainId: number, ref: NftType | { address: string; tokenID: string }): string =>
  `${getOpenSea(chainId)}/${ref?.address}/${ref?.tokenID}`;

// GET Blur
const getBlur = (chainId: number): string => getNetwork(chainId)?.blur || "";
// GET Blur Url
const getBlurUrl = (chainId: number, ref: NftType | { address: string; tokenID: string }): string =>
  `${getBlur(chainId)}/${ref?.address?.toLowerCase()}/${ref?.tokenID}`;
const getDappUrl = (chainId: number, ref: NftType | { address: string; tokenID: string }): string =>
  `https://beta.kredeum.com/#/${chainId}/${ref?.address?.toLowerCase()}/${ref?.tokenID}`;

// GET Create
const getCreate = (chainId: number): boolean => Boolean(getNetwork(chainId)?.create);

const isTestnet = (chainId: number): boolean => Boolean(getNetwork(chainId)?.testnet);

// GET chain Name
const getChainName = (chainId: number): string =>
  chainId > 0 ? getNetwork(chainId)?.chainName || String(chainId) : "";

// nft url : nft://chainName/collectionAddress/tokenID
const nftUrl3 = (chainId: number, address: string, tokenID = "", n = 999): string => {
  const network = getNetwork(chainId);

  if (!(chainId && address && address != ZeroAddress && tokenID && network)) return "";
  const ret =
    "nft://" +
    (network
      ? network.chainName +
        (address ? "/" + (getShortAddress(address, n) + (tokenID ? "/" + textShort(tokenID, 8) : "")) : "")
      : "");
  // console.log("nftUrl3", chainId, _contract, _tokenId, plus, ret);
  return ret;
};
const nftUrl = (nft: NftType, n?: number): string => nftUrl3(nft.chainId, nft.address, nft.tokenID, n);

// Build normalized url for one nft with get parameters
const normalizedSoloNftUrl = (chainId: number, nft: NftType): string => {
  const network = getNetwork(chainId);
  const ret =
    "/?chainId=" +
    (network
      ? network.chainName +
        "&collection=" +
        (nft ? `${nft?.address}` + "&tokenID=" + (nft ? `${nft?.tokenID}` : "") : "")
      : "");
  // console.log("normalizedSoloNftUrl", chainId, collection, _tokenId, plus, ret);

  return ret;
};

// CONSTANT
// const IPFS_GATEWAY_DOMAIN = config.storage.ipfs.gatewayDomain;
const IPFS_GATEWAY = config.storage.ipfs.gateway.replace(/\/$/, "");
const SWARM_GATEWAY = config.storage.swarm.gateway.replace(/\/$/, "");

const textShort = (s: string, n = 16, p = n): string => {
  const ipfsStr: string = s?.toString() || "";
  const str: string = ipfsLinkToCid(ipfsStr);
  const l: number = str.length || 0;
  return str.substring(0, n) + (l < n ? "" : "..." + (p > 0 ? str.substring(l - p, l) : ""));
};

const getShortAddress = (address: string, n = 8): string =>
  address
    ? address.endsWith(".eth")
      ? textShort(address, 2 * n, 0)
      : textShort(getChecksumAddress(address), n, n)
    : "?";

// GENERIC helpers
const sleep = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));

const addressSame = (a: string, b: string): boolean => a?.toLowerCase() === b?.toLowerCase();

const numberToHexString = (num = 0): HexString => "0x" + Number(num).toString(16);

const urlToLink = (url: string, label?: string): string =>
  `<a href="${url}" class="link" target="_blank" rel="noreferrer">${label || url}</a>`;

const isNumeric = (stringNum: string): boolean => !isNaN(Number(stringNum)) && !isNaN(parseFloat(stringNum));
/////////////////////////////////////////////////////////////////////////////////////////////////////

/////////////////////////////////////////////////////////////////////////////////////////////////////
// IPFS helpers
/////////////////////////////////////////////////////////////////////////////////////////////////////
// uri : https://ipfs.io/ipfs/bafkreieivwe2vhxx72iqbjibxabk5net4ah5lo3khekt6ojyn7cucek624
// => ipfs uri : ipfs://bafkreieivwe2vhxx72iqbjibxabk5net4ah5lo3khekt6ojyn7cucek624
/////////////////////////////////////////////////////////////////////////////////////////////////////
const ipfsGetLink = (uri: string | undefined): string => {
  if (!uri) return "";

  let ipfsLink = "";
  let cid = "";

  if (uri.startsWith("Qm") || uri.startsWith("ba")) {
    cid = uri;
  } else if (uri.startsWith("ipfs://")) {
    if (uri.startsWith("ipfs://ipfs/")) {
      cid = uri.replace(/^ipfs:\/\/(ipfs\/)/, "");
    } else {
      ipfsLink = uri;
    }
  } else {
    // find cid in uri
    const res = uri.match(/^.*\/ipfs\/(.*)$/i);
    cid = (res && res[1]) || "";
    // console.log("ipfsGetLink ~ uri res cid", uri, res, cid);
  }
  if (cid) {
    // reconstruct ipfs uri
    ipfsLink = ipfsCidToLink(cid);
  }
  // console.log("ipfsGetLink", uri, "=>", ipfsLink, cid);
  return ipfsLink;
};

/////////////////////////////////////////////////////////////////////////////////////////////////////
// http uri : https://ipfs.io/ipfs/bafkreieivwe2vhxx72iqbjibxabk5net4ah5lo3khekt6ojyn7cucek624
// ipfs uri : ipfs://bafkreieivwe2vhxx72iqbjibxabk5net4ah5lo3khekt6ojyn7cucek624
// => gateway url : https://ipfs.io/ipfs/bafkreieivwe2vhxx72iqbjibxabk5net4ah5lo3khekt6ojyn7cucek624
/////////////////////////////////////////////////////////////////////////////////////////////////////
const ipfsLinkToUrlHttp = (link: string): string => (link.startsWith("ipfs://") ? ipfsGatewayUrl(link) : link);

/////////////////////////////////////////////////////////////////////////////////////////////////////
// cid : bafkreieivwe2vhxx72iqbjibxabk5net4ah5lo3khekt6ojyn7cucek624
// => ipfs uri : ipfs://bafkreieivwe2vhxx72iqbjibxabk5net4ah5lo3khekt6ojyn7cucek624
/////////////////////////////////////////////////////////////////////////////////////////////////////
const ipfsCidToLink = (cid: string): string => (cid ? `ipfs://${cid}` : "");

/////////////////////////////////////////////////////////////////////////////////////////////////////
// ipfs uri : ipfs://bafkreieivwe2vhxx72iqbjibxabk5net4ah5lo3khekt6ojyn7cucek624
// => cid : bafkreieivwe2vhxx72iqbjibxabk5net4ah5lo3khekt6ojyn7cucek624
/////////////////////////////////////////////////////////////////////////////////////////////////////
const ipfsLinkToCid = (ipfs: string): string => ipfs.replace(/^ipfs:\/\//, "");

/////////////////////////////////////////////////////////////////////////////////////////////////////
// ipfs uri : ipfs://bafkreieivwe2vhxx72iqbjibxabk5net4ah5lo3khekt6ojyn7cucek624
// => bafkreieivwe2vhxx72iqbjibxabk5net4ah5lo3khekt6ojyn7cucek624
// => gateway url https://ipfs.io/ipfs/bafkreieivwe2vhxx72iqbjibxabk5net4ah5lo3khekt6ojyn7cucek624
/////////////////////////////////////////////////////////////////////////////////////////////////////
const ipfsGatewayUrl = (ipfs: string | undefined): string => (ipfs ? `${IPFS_GATEWAY}/${ipfsLinkToCid(ipfs)}` : "");

// const ipfsGatewayUrl = (ipfs: string | undefined): string =>
//   ipfs
//     ? IPFS_GATEWAY_DOMAIN
//       ? `https://${ipfsLinkToCid(ipfs)}.${IPFS_GATEWAY_DOMAIN}`
//       : `${IPFS_GATEWAY}${ipfsLinkToCid(ipfs)}`
//     : "";

/////////////////////////////////////////////////////////////////////////////////////////////////////
// ipfs uri : ipfs://bafkreieivwe2vhxx72iqbjibxabk5net4ah5lo3khekt6ojyn7cucek624
// => gateway link <a href="https://ipfs.io/ipfs/bafkreieivwe2vhxx72iqbjibxabk5net4ah5lo3khekt6ojyn7cucek624" target="_blank" rel="noreferrer">bafk...cek624</a>
/////////////////////////////////////////////////////////////////////////////////////////////////////
const ipfsGatewayLink = (ipfs: string): string => urlToLink(ipfsGatewayUrl(ipfs), textShort(ipfs));
/////////////////////////////////////////////////////////////////////////////////////////////////////

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// SWARM HELPERS
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////
// uri : https://api.gateway.ethswarm.org/bzz/1fa18cf1aaee4727ecc266a86f1ef0f98b14771c7814d8cfb850a4b1c6d1359f
// => Swarm uri : swarm://1fa18cf1aaee4727ecc266a86f1ef0f98b14771c7814d8cfb850a4b1c6d1359f
/////////////////////////////////////////////////////////////////////////////////////////////////////
const swarmGetLink = (uri: string | undefined): string => {
  if (!uri) return "";

  let swarmLink = "";
  let cid = "";

  if (uri.startsWith("swarm://")) {
    swarmLink = uri;
  } else if (uri.startsWith(SWARM_GATEWAY)) {
    // find cid in uri
    cid = uri.replace(SWARM_GATEWAY, "");

    // console.log("ipfsGetLink ~ uri res cid", uri, res, cid);
  }
  if (cid) {
    // reconstruct ipfs uri
    swarmLink = swarmCidToLink(cid);
  }

  return swarmLink;
};

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// http link : https://api.gateway.ethswarm.org/bzz/1fa18cf1aaee4727ecc266a86f1ef0f98b14771c7814d8cfb850a4b1c6d1359f
// swarm uri : swarm://1fa18cf1aaee4727ecc266a86f1ef0f98b14771c7814d8cfb850a4b1c6d1359f
// => gateway url : https://api.gateway.ethswarm.org/bzz/1fa18cf1aaee4727ecc266a86f1ef0f98b14771c7814d8cfb850a4b1c6d1359f
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const swarmLinkToUrlHttp = (link: string): string => (link.startsWith("swarm://") ? swarmGatewayUrl(link) : link);

/////////////////////////////////////////////////////////////////////////////////////////////////////
// cid : 1fa18cf1aaee4727ecc266a86f1ef0f98b14771c7814d8cfb850a4b1c6d1359f
// => swarm uri : swarm://1fa18cf1aaee4727ecc266a86f1ef0f98b14771c7814d8cfb850a4b1c6d1359f
/////////////////////////////////////////////////////////////////////////////////////////////////////
const swarmCidToLink = (cid: string): string => (cid ? `swarm://${cid}` : "");

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// swarm uri : swarm://1fa18cf1aaee4727ecc266a86f1ef0f98b14771c7814d8cfb850a4b1c6d1359f
// => cid : 1fa18cf1aaee4727ecc266a86f1ef0f98b14771c7814d8cfb850a4b1c6d1359f
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const swarmLinkToCid = (swarm: string): string => swarm.replace(/^swarm:\/\//, "");

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Swarm reference : 1fa18cf1aaee4727ecc266a86f1ef0f98b14771c7814d8cfb850a4b1c6d1359f
// => gateway url https://api.gateway.ethswarm.org/bzz/1fa18cf1aaee4727ecc266a86f1ef0f98b14771c7814d8cfb850a4b1c6d1359f
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const swarmGatewayUrl = (swarm: string | undefined): string =>
  swarm ? `${SWARM_GATEWAY}/${swarmLinkToCid(swarm)}` : "";
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Swarm API Gateway : https://api.gateway.ethswarm.org/bzz/
// => Swarm serveur node Url https://api.gateway.ethswarm.org
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const swarmServer = (swarmGateway: string): string => swarmGateway.replace(/\/bzz\/$/, "");
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Storage cid from ipfs or swarm
// => gataway url of ipfs or swarm
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const storageGatewayUrl = (link: string): string =>
  link.startsWith("ipfs://") ? ipfsGatewayUrl(link) : link.startsWith("swarm://") ? swarmGatewayUrl(link) : link;
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// ipfs or swarm ( uri | http uri )
// => gateway url for ipfs or swarm
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const storageLinkToUrlHttp = (link: string): string =>
  link.startsWith("ipfs://") || link.startsWith(IPFS_GATEWAY)
    ? ipfsLinkToUrlHttp(link)
    : link.startsWith("swarm://") || link.startsWith(SWARM_GATEWAY)
    ? swarmLinkToUrlHttp(link)
    : link;
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/////////////////////////////////////////////////////////////////////////////////////////////////////
// EXPLORER URL helpers
/////////////////////////////////////////////////////////////////////////////////////////////////////
// BASIC URL
const explorerUrl = (chainId: number, path: string): string =>
  // https://etherscan.io/gastracker
  getExplorer(chainId) + "/" + path.replace(/^\//, "");

// GENERIC MULTICHAIN URL
const blockscanUrl = (path: string): string =>
  // https://blockscan.com/address/0x4b7992F03906F7bBE3d48E5Fb724f52c56cFb039
  "https://blockscan.com/" + path.replace(/^\//, "");

// ADDRESS URL
const explorerAddressUrl = (chainId: number, address: string): string =>
  // https://etherscan.io/address/0x4b7992F03906F7bBE3d48E5Fb724f52c56cFb039
  // https://blockscan.com/address/0x4b7992F03906F7bBE3d48E5Fb724f52c56cFb039
  chainId > 0 ? explorerUrl(chainId, `/address/${address}`) : blockscanUrl(`/address/${address}`);

// TX URL
const explorerTxUrl = (chainId: number, tx: string): string =>
  // https://etherscan.io/tx/0xf7a974c93ee811863ce31e642880d9c5883995f8492783227f92fa43c2bee177
  explorerUrl(chainId, `/tx/${tx}`);

// LOG TX.HASH URL
const explorerTxHashLog = (chainId: number, txHash = ""): void =>
  // https://etherscan.io/tx/0xf7a974c93ee811863ce31e642880d9c5883995f8492783227f92fa43c2bee177
  console.info(explorerTxUrl(chainId, txHash));

// LOG TX URL
const explorerTxLog = (chainId: number, tx?: TransactionResponse | undefined): void =>
  explorerTxHashLog(chainId, tx?.hash);

// ACCOUNT URL
const explorerAccountUrl = (chainId: number, address: string): string => {
  let url = "";
  if (chainId > 0) {
    if (getExplorer(chainId)?.includes("chainstacklabs.com") || getExplorer(chainId)?.includes("blockscout.com")) {
      // https://polygon-explorer-mumbai.chainstacklabs.com/address/0x79ae5d3FE295d81342A49aECE586716D60b37C6b/tokens
      // https://blockscout.com/xdai/mainnet/address/0x981ab0D817710d8FFFC5693383C00D985A3BDa38/tokens
      url = explorerUrl(chainId, `/address/${address}/tokens/`);
    } else {
      // https://etherscan.io/address/0x981ab0d817710d8fffc5693383c00d985a3bda38#tokentxnsErc721
      // https://etherscan.io/tokenholdings?a=0x981ab0D817710d8FFFC5693383C00D985A3BDa38
      url = explorerUrl(chainId, `/address/${address}#tokentxnsErc721`);
      // url = explorerUrl(chainId, `/tokenholdings?a=${address}`);
    }
  } else {
    blockscanUrl(`/address/${address}`);
  }
  return url;
};

// CONTRACT URL
const explorerContractUrl = (chainId: number, address: string): string => {
  let url = "";
  if (getExplorer(chainId)?.includes("chainstacklabs.com") || getExplorer(chainId)?.includes("blockscout.com")) {
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
  if (getExplorer(chainId)?.includes("chainstacklabs.com") || getExplorer(chainId)?.includes("blockscout.com")) {
    // https://blockscout.com/xdai/mainnet/token/0x74e596525C63393f42C76987b6A66F4e52733efa
    url = explorerUrl(chainId, `/token/${collAddress}`);
  } else {
    // https://etherscan.io/token/0x82a398243ebc2cb26a4a21b9427ec6db8c224471
    url = explorerUrl(chainId, `/token/${collAddress}`);
  }
  return url;
};

// KREDEUM NFT URL
const kredeumNftUrl = (chainId: number, nft: NftType): string =>
  `#/${getChainName(nft.chainId)}/${nft?.address}/${nft?.tokenID}`;

const kredeumNftHttp = (chainId: number, nft: NftType): string => `${config.domain}/${kredeumNftUrl(chainId, nft)}`;

const kredeumNftWpUrl = (chainId: number, nft: NftType): string =>
  `./admin.php?page=nfts/${kredeumNftUrl(chainId, nft)}`;

const nidTokredeumNftWPUrl = (nid: string): string => `./admin.php?page=nfts/#/${nid.replace("nft://", "")}`;

/////////////////////////////////////////////////////////////////////////////////////////////////////
// EXPLORER LINK helpers
/////////////////////////////////////////////////////////////////////////////////////////////////////
const explorerLink = (chainId: number, path: string, label: string): string =>
  urlToLink(explorerUrl(chainId, path), label);

const explorerAddressLink = (chainId: number, address: string, n?: number): string =>
  urlToLink(explorerAddressUrl(chainId, address), getShortAddress(address, n));

const explorerTxLink = (chainId: number, tx: string): string =>
  urlToLink(explorerTxUrl(chainId, tx), getShortAddress(tx));

/////////////////////////////////////////////////////////////////////////////////////////////////////
// COLLECTION helpers
/////////////////////////////////////////////////////////////////////////////////////////////////////
const collectionName = (collection: CollectionType): string => collection?.name || DEFAULT_NAME;

const collectionSymbol = (collection: CollectionType): string => collection?.symbol || DEFAULT_SYMBOL;

const explorerCollectionLink = (chainId: number, collAddress: string): string =>
  urlToLink(explorerCollectionUrl(chainId, collAddress), getShortAddress(collAddress));

/////////////////////////////////////////////////////////////////////////////////////////////////////
// NFTS helpers
/////////////////////////////////////////////////////////////////////////////////////////////////////
const nftsSupply = (nfts: Map<string, NftType>): number => nfts.size || 0;

const nftsBalanceAndName = (collection: CollectionType, account: string): string => {
  const bal = collection?.balancesOf?.get(account) || 0;
  return `${bal} ${collectionSymbol(collection)}${bal > 1 ? "s" : ""}`;
};

/////////////////////////////////////////////////////////////////////////////////////////////////////
const interfaceId = (abi: Array<string>): string => {
  const iface = new Interface(abi);

  let id = 0n;
  iface.fragments.forEach((fragment: Fragment): void => {
    if (fragment.type === "function") {
      id = id ^ BigInt((fragment as FunctionFragment).selector);
    }
  });
  return hexlify(id.toString(16));
};
/////////////////////////////////////////////////////////////////////////////////////////////////////

const getMax = (a = 0n, b = 0n): bigint => (a > b ? a : b);
const getMin = (a = 0n, b = 0n): bigint => (a < b ? a : b);

/////////////////////////////////////////////////////////////////////////////////////////////////////
const getCurrency = (chainId: number) => getNetwork(chainId)?.nativeCurrency?.symbol;
/////////////////////////////////////////////////////////////////////////////////////////////////////

export {
  copyToClipboard,
  tokenIdSplit,
  tokenIdCount,
  tokenIdSelected,
  addressSame,
  collectionName,
  collectionSymbol,
  blockscanUrl,
  explorerLink,
  explorerAddressUrl,
  explorerAddressLink,
  explorerContractUrl,
  explorerTxUrl,
  explorerTxLog,
  explorerTxLink,
  explorerCollectionUrl,
  explorerCollectionLink,
  kredeumNftUrl,
  kredeumNftHttp,
  kredeumNftWpUrl,
  explorerUrl,
  explorerAccountUrl,
  isTestnet,
  isCollection,
  isNetwork,
  isAddressNotZero,
  isNumeric,
  getChainId,
  getChainName,
  getShortAddress,
  getChecksumAddress,
  getNetwork,
  getNetworkRpcUrls,
  getNftsResolver,
  getDefaultOpenNFTs,
  getOpenMulti,
  getBlur,
  getBlurUrl,
  getDappUrl,
  getOpenSea,
  getOpenSeaUrl,
  getCreate,
  getExplorer,
  getCurrency,
  ipfsLinkToUrlHttp,
  ipfsCidToLink,
  ipfsLinkToCid,
  ipfsGetLink,
  ipfsGatewayUrl,
  ipfsGatewayLink,
  nidTokredeumNftWPUrl,
  swarmGetLink,
  swarmLinkToUrlHttp,
  swarmCidToLink,
  swarmLinkToCid,
  swarmGatewayUrl,
  swarmServer,
  storageGatewayUrl,
  storageLinkToUrlHttp,
  interfaceId,
  nftUrl3,
  nftUrl,
  nftsSupply,
  nftsBalanceAndName,
  networks,
  normalizedSoloNftUrl,
  numberToHexString,
  sleep,
  textShort,
  urlToLink,
  getMax,
  getMin,
  config,
  PAGE_SIZE,
  MAX_FEE,
  DEFAULT_NAME,
  DEFAULT_SYMBOL,
  SWARM_GATEWAY
};
