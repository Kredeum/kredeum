import type { Provider } from "@ethersproject/abstract-provider";
import type { Address, NetworkType, CollectionType, NftType } from "./ktypes";

import { Fragment, Interface } from "@ethersproject/abi";
import { providers, utils, BigNumber } from "ethers";
import { factoryGetTemplateAddress } from "./kfactory-get";
import networks from "../config/networks.json";
import config from "../config/config.json";

const DEFAULT_NAME = "No name";
const DEFAULT_SYMBOL = "NFT";

const isProviderOnChainId = async (provider: Provider, chainId: number) =>
  chainId === (await provider?.getNetwork())?.chainId;

const networksMap = new Map(networks.map((network) => [network.chainId, network]));

const getChecksumAddress = (address: Address | string | undefined): Address => {
  if (!address) return "";

  let addr = address;
  try {
    addr = utils.getAddress(String(address));
  } catch (e) {
    console.log("getChecksumAddress ERROR on @ '" + addr + "'");
  }
  return addr;
};

const getChainId = (chainName: string): number | undefined =>
  networks.find((nw) => nw.chainName === chainName)?.chainId;

const getNetwork = (chainId: number | string): NetworkType | undefined => networksMap.get(Number(chainId));

//  GET nftsFactory address
const getNftsFactory = (chainId: number): string => getNetwork(chainId)?.nftsFactoryV2 || "";

//  GET default OpenNFTs address
const getDefaultOpenNFTs = (chainId: number): string => getNetwork(chainId)?.defaultOpenNFTs || "";

//  GET OpenMulti address
const getOpenMulti = (chainId: number): string => getNetwork(chainId)?.openMulti || "";

// GET explorer
const getExplorer = (chainId: number): string => getNetwork(chainId)?.blockExplorerUrls[0] || "";

// GET OpenSeaKredeum
const getOpenSeaKredeum = (chainId: number): string => getNetwork(chainId)?.openSea?.openNFTs || "";

// GET OpenSea
const getOpenSeaAssets = (chainId: number): string => getNetwork(chainId)?.openSea?.assets || "";

// GET Create
const getCreate = (chainId: number): boolean => Boolean(getNetwork(chainId)?.create);

const isTestnet = (chainId: number | string): boolean => Boolean(getNetwork(chainId)?.testnet);

const getEnsName = async (address: string): Promise<string> => {
  let name = "";
  try {
    const ensProvider: Provider = new providers.JsonRpcProvider(
      `https://mainnet.infura.io/v3/${process.env.INFURA_API_KEY || ""}`
    );
    name = (await ensProvider.lookupAddress(address)) || "";
  } catch (e) {
    console.error("NO ENS found");
  }
  return name || address || "";
};

// GET chain Name
const getChainName = (chainId: number): string =>
  chainId > 0 ? getNetwork(chainId)?.chainName || String(chainId) : "";

// nfts url : nfts://chainName/collectionAddress
const collectionUrl = (chainId: number, _collectionAddress: Address): string => {
  const network = getNetwork(chainId);
  return (
    "collection://" +
    (network ? network.chainName : "...") +
    (_collectionAddress ? "/" + getChecksumAddress(_collectionAddress) : "/...")
  );
};

// nft url : nft://chainName/collectionAddress/tokenID
const nftUrl3 = (chainId: number, address: Address, tokenID = "", n = 999): string => {
  const network = getNetwork(chainId);

  if (!(chainId && address && tokenID && network)) return "";
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
const ipfsGateway = "https://ipfs.io/ipfs/";

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

const numberToHexString = (num = 0): string => "0x" + Number(num).toString(16);

const urlToLink = (url: string, label?: string): string => `<a href="${url}" target="_blank">${label || url}</a>`;
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
const ipfsToUrlHttp = (url: string): string => (url.startsWith("ipfs://") ? ipfsGatewayUrl(url) : url);

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
const ipfsGatewayUrl = (ipfs: string): string => `${ipfsGateway}${ipfsLinkToCid(ipfs)}`;

/////////////////////////////////////////////////////////////////////////////////////////////////////
// ipfs uri : ipfs://bafkreieivwe2vhxx72iqbjibxabk5net4ah5lo3khekt6ojyn7cucek624
// => gateway link <a href="https://ipfs.io/ipfs/bafkreieivwe2vhxx72iqbjibxabk5net4ah5lo3khekt6ojyn7cucek624" target="_blank">bafk...cek624</a>
/////////////////////////////////////////////////////////////////////////////////////////////////////
const ipfsGatewayLink = (ipfs: string): string => urlToLink(ipfsGatewayUrl(ipfs), textShort(ipfs));
/////////////////////////////////////////////////////////////////////////////////////////////////////

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

// NFTS_FACTORY URL
const explorerNFTsFactoryUrl = (chainId: number): string =>
  // https://blockscout.com/xdai/mainnet/address/0x86246ba8F7b25B1650BaF926E42B66Ec18D96000/read-contract
  // https://etherscan.io/address/0x4b7992F03906F7bBE3d48E5Fb724f52c56cFb039#readContract
  explorerContractUrl(chainId, getNftsFactory(chainId));

// OPEN_NFTS URL
const explorerOpenNFTsUrl = async (chainId: number, provider: Provider): Promise<string> =>
  // https://etherscan.io/address/0x82a398243EBc2CB26a4A21B9427EC6Db8c224471#readContract
  explorerContractUrl(chainId, await factoryGetTemplateAddress(chainId, "OpenNFTsV3", provider));

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
  `./#/${getChainName(nft.chainId)}/${nft?.address}/${nft?.tokenID}`;

// NFT URL
const explorerNftUrl = (chainId: number, nft: NftType): string => {
  let url = "";
  if (getExplorer(chainId)?.includes("chainstacklabs.com") || getExplorer(chainId)?.includes("blockscout.com")) {
    // https://blockscout.com/xdai/mainnet/token/0x22C1f6050E56d2876009903609a2cC3fEf83B415/instance/3249859/metadata
    url = explorerUrl(chainId, `/tokens/${nft?.address}/instance/${nft?.tokenID}/metadata`);
    url = explorerUrl(chainId, `/token/${nft?.address}/instance/${nft?.tokenID}/metadata`);
  } else {
    // https://etherscan.io/token/0x82a398243EBc2CB26a4A21B9427EC6Db8c224471?a=1
    url = explorerUrl(chainId, `/token/${nft?.address}?a=${nft?.tokenID}`);
  }
  return url;
};

/////////////////////////////////////////////////////////////////////////////////////////////////////
// EXPLORER LINK helpers
/////////////////////////////////////////////////////////////////////////////////////////////////////
const explorerLink = (chainId: number, path: string, label: string): string =>
  urlToLink(explorerUrl(chainId, path), label);

const explorerAddressLink = (chainId: number, address: string, n?: number): string =>
  urlToLink(explorerAddressUrl(chainId, address), getShortAddress(address, n));

const explorerTxLink = (chainId: number, tx: string): string =>
  urlToLink(explorerTxUrl(chainId, tx), getShortAddress(tx));

const explorerNftLink = (chainId: number, nft: NftType, label?: string): string =>
  urlToLink(explorerNftUrl(chainId, nft), label || nftName(nft));

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

// NFT helpers
const nftExplorerLink = (nft: NftType, n?: number): string =>
  urlToLink(explorerNftUrl(nft?.chainId, nft), nftUrl(nft, n));

const nftOpenSeaUrl = (chainId: number, nft: NftType): string => {
  const openSeaAssets = getOpenSeaAssets(chainId);
  return `${openSeaAssets}/${nft?.address}/${nft?.tokenID}`;
};

const nftName = (nft: NftType): string => nft?.name || `${nft?.contractName || DEFAULT_NAME} #${nft?.tokenID}`;

const nftDescription = (nft: NftType): string => (nft?.name != nft?.description && nft?.description) || nftName(nft);

const nftDescriptionShort = (nft: NftType, n = 16): string => textShort(nftDescription(nft), n, 0);
/////////////////////////////////////////////////////////////////////////////////////////////////////

/////////////////////////////////////////////////////////////////////////////////////////////////////
const interfaceId = (abi: Array<string>): string => {
  const iface = new Interface(abi);

  let id = BigNumber.from(0);
  iface.fragments.forEach((f: Fragment): void => {
    if (f.type === "function") {
      id = id.xor(BigNumber.from(iface.getSighash(f)));
    }
  });
  return utils.hexlify(id);
};
/////////////////////////////////////////////////////////////////////////////////////////////////////

const nftKey = (chainId: number, address: string, tokenID: string, account?: string): string =>
  `nft://${String(chainId)}/${address}/${tokenID}${account ? "@" + account : ""}`;

const nftListKey = (chainId: number, address: string, account?: string): string =>
  `nftList://${String(chainId)}/${address}${account ? "@" + account : ""}`;

const collectionKey = (chainId: number, address: string, account?: string): string =>
  `collection://${String(chainId)}/${address}${account ? "@" + account : ""}`;

const collectionListKey = (chainId: number, account?: string, mintable = false): string =>
  `collectionList${mintable ? "Mintable" : ""}://${String(chainId)}${account ? "@" + account : ""}`;

/////////////////////////////////////////////////////////////////////////////////////////////////////

export {
  addressSame,
  collectionName,
  collectionSymbol,
  blockscanUrl,
  explorerLink,
  explorerAddressUrl,
  explorerAddressLink,
  explorerContractUrl,
  explorerTxUrl,
  explorerTxLink,
  explorerCollectionUrl,
  explorerCollectionLink,
  kredeumNftUrl,
  explorerNftUrl,
  explorerAccountUrl,
  explorerNftLink,
  explorerNFTsFactoryUrl,
  explorerOpenNFTsUrl,
  isTestnet,
  getChainId,
  isProviderOnChainId,
  getChainName,
  getShortAddress,
  getChecksumAddress,
  getNetwork,
  getNftsFactory,
  getDefaultOpenNFTs,
  getOpenMulti,
  getEnsName,
  getOpenSeaKredeum,
  getOpenSeaAssets,
  getCreate,
  getExplorer,
  ipfsToUrlHttp,
  ipfsCidToLink,
  ipfsLinkToCid,
  ipfsGetLink,
  ipfsGatewayUrl,
  ipfsGatewayLink,
  interfaceId,
  collectionKey,
  collectionListKey,
  nftKey,
  nftListKey,
  nftUrl3,
  nftUrl,
  collectionUrl,
  nftDescription,
  nftDescriptionShort,
  nftExplorerLink,
  nftName,
  nftsSupply,
  nftsBalanceAndName,
  nftOpenSeaUrl,
  networks,
  normalizedSoloNftUrl,
  numberToHexString,
  sleep,
  textShort,
  urlToLink,
  config,
  DEFAULT_NAME,
  DEFAULT_SYMBOL
};
