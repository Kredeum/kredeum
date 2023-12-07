import type { TransactionResponse } from "@ethersproject/abstract-provider";
import { utils, BigNumber, constants, BigNumberish } from "ethers";
import { Fragment, Interface } from "@ethersproject/abi";

import type { NetworkType, CollectionType, NftType, RefPageType, AddressesType } from "@lib/common/types";

import networks from "@config/networks.json";
import config from "@config/config.json";
import addressesRaw from "@contracts/addresses.json";

import { formatEther } from "ethers/lib/utils";

const PAGE_SIZE = 12;
const MAX_FEE = 10000;
const DEFAULT_NAME = "No name";
const DEFAULT_SYMBOL = "NFT";
const ADDRESS_ZERO = "0x0000000000000000000000000000000000000000";
const ADDRESS_ONE = "0x0000000000000000000000000000000000000001";
const ADDRESS_DEAD = "0x000000000000000000000000000000000000dEaD";

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

const isAddress = (address = ""): boolean => utils.isAddress(address);
const isAddressNotZero = (account = ""): boolean => utils.isAddress(account) && account != constants.AddressZero;

const getChecksumAddress = (address = ""): string =>
  isAddress(address) ? utils.getAddress(address) : constants.AddressZero;

const getChainId = (chainName: string): number | undefined =>
  networks.find((nw) => nw.chainName === chainName)?.chainId;

const isNetwork = (chainId: number | string | undefined): boolean => networksMap.has(Number(chainId));

const isEip1559 = (chainId: number | string): boolean => Boolean(getNetwork(chainId)?.eip1559);

const getNetwork = (chainId: number | string): NetworkType | undefined => networksMap.get(Number(chainId));

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
const addresses = JSON.parse(JSON.stringify(addressesRaw));
// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-return
const getAddresses = (chainId: number | string): AddressesType | undefined => addresses[String(chainId)];

//  GET OpenMulti address
const getOpenBound = (chainId: number): string => getAddresses(chainId)?.OpenBound || "";
const hasOpenBound = (chainId: number): boolean => isAddress(getOpenBound(chainId));

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

// GET Dapp Url
const getDappUrl = (chainId: number, ref: NftType | { address: string; tokenID: string }): string =>
  `${config.base}/#/${chainId}/${ref?.address?.toLowerCase()}/${ref?.tokenID}`;

// GET Autoswarm Url
const getAutoswarmUrl = (chainId: number, ref: NftType | { address: string; tokenID: string }): string =>
  `${config.storage.swarm.autoSwarm}/${chainId}/${ref?.address}/${ref?.tokenID}`;

// GET Create
const getCreate = (chainId: number): boolean => Boolean(getNetwork(chainId)?.create);

const getLinkedMainnet = (chainId: number | string): number => getNetwork(chainId)?.linkedMainnet || 0;
const getLinkedLayer1 = (chainId: number | string): number => getNetwork(chainId)?.linkedLayer1 || 0;

const isActive = (chainId: number | string): boolean => {
  const network = getNetwork(chainId);
  if (!network) return false;
  if ("active" in network) return network.active || false;
  return true;
};
const isMainnet = (chainId: number | string): boolean => getLinkedMainnet(chainId) == 0;
const isTestnet = (chainId: number | string): boolean => !isMainnet(chainId);
const isLayer1 = (chainId: number | string): boolean => getLinkedLayer1(chainId) == 0;
const isLayer2 = (chainId: number | string): boolean => !isLayer1(chainId);

// GET chain Name
const getChainName = (chainId: number): string =>
  chainId > 0 ? getNetwork(chainId)?.chainName || String(chainId) : "";

// nft url : nft://chainName/collectionAddress/tokenID
const nftUrl3 = (chainId: number, address: string, tokenID = "", n = 999): string => {
  const network = getNetwork(chainId);

  if (!(chainId && address && address != constants.AddressZero && tokenID && network)) return "";
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

const textShort = (str: string, n = 16, p = n): string => {
  if (!str) return "";

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

const urlToLink = (url: string, label?: string): string =>
  `<a href="${url}" class="link" target="_blank" rel="noreferrer">${label || url}</a>`;

const isNumeric = (stringNum: string): boolean => !isNaN(Number(stringNum)) && !isNaN(parseFloat(stringNum));
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
// URIs helpers
/////////////////////////////////////////////////////////////////////////////////////////////////////
const uriShort = (uri: string) => {
  const [storage, hash] = uri.split("://");
  if (!(storage && hash && hash.length > 20)) return uri;

  return `${storage}://${hash.slice(0, 8)}...${hash.slice(-8)}`;
};

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
  const balancesOf = collection?.balancesOf || null;
  const bal = balancesOf instanceof Map ? Number(balancesOf.get(account)) : 0;
  return `${bal} ${collectionSymbol(collection)}${bal > 1 ? "s" : ""}`;
};

// NFT helpers
const nftExplorerLink = (nft: NftType, n?: number): string =>
  urlToLink(explorerNftUrl(nft?.chainId, nft), nftUrl(nft, n));

const nftName = (nft: NftType): string => nft?.name || `${nft?.collection?.name || DEFAULT_NAME} #${nft?.tokenID}`;

const nftCollectionName = (nft: NftType): string => `${nft?.collection?.name || DEFAULT_NAME}`;

const nftDescription = (nft: NftType): string => (nft?.name != nft?.description && nft?.description) || nftName(nft);

const nftDescriptionShort = (nft: NftType, n = 16): string => textShort(nftDescription(nft), n, 0);
/////////////////////////////////////////////////////////////////////////////////////////////////////

/////////////////////////////////////////////////////////////////////////////////////////////////////
const interfaceId = (abi: Array<string>): string => {
  const iface = new Interface(abi);

  let id = constants.Zero;
  iface.fragments.forEach((f: Fragment): void => {
    if (f.type === "function") {
      id = id.xor(BigNumber.from(iface.getSighash(f)));
    }
  });
  return utils.hexlify(id);
};
/////////////////////////////////////////////////////////////////////////////////////////////////////

/////////////////////////////////////////////////////////////////////////////////////////////////////
const getCurrency = (chainId: number): string => getNetwork(chainId)?.nativeCurrency.symbol || "";

const displayEther = (chainId: number, price: BigNumberish): string => `${formatEther(price)} ${getCurrency(chainId)}`;
/////////////////////////////////////////////////////////////////////////////////////////////////////

/////////////////////////////////////////////////////////////////////////////////////////////////////
const feeAmount = (price = BigNumber.from(0), fee = 0): BigNumber => price.mul(fee).div(MAX_FEE);
/////////////////////////////////////////////////////////////////////////////////////////////////////
const treasuryAccount = (): string => config?.treasury?.account || constants.AddressZero;
const treasuryFee = (): number => config?.treasury?.fee || 0;
const treasuryAmount = (price = BigNumber.from(0)): BigNumber => feeAmount(price, treasuryFee());
/////////////////////////////////////////////////////////////////////////////////////////////////////

export {
  feeAmount,
  treasuryFee,
  treasuryAccount,
  treasuryAmount,
  displayEther,
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
  explorerUrl,
  explorerNftUrl,
  explorerAccountUrl,
  explorerNftLink,
  isEip1559,
  getLinkedMainnet,
  getLinkedLayer1,
  isActive,
  isTestnet,
  isMainnet,
  isLayer2,
  isLayer1,
  isCollection,
  isNetwork,
  isAddress,
  isAddressNotZero,
  isNumeric,
  getChainId,
  getChainName,
  getShortAddress,
  getChecksumAddress,
  getNetwork,
  getAddresses,
  getOpenBound,
  hasOpenBound,
  getBlur,
  getBlurUrl,
  getDappUrl,
  getAutoswarmUrl,
  getOpenSea,
  getOpenSeaUrl,
  getCreate,
  getExplorer,
  getCurrency,
  uriShort,
  interfaceId,
  nftUrl3,
  nftUrl,
  nftDescription,
  nftDescriptionShort,
  nftExplorerLink,
  nftName,
  nftCollectionName,
  nftsSupply,
  nftsBalanceAndName,
  normalizedSoloNftUrl,
  numberToHexString,
  sleep,
  textShort,
  urlToLink,
  networks,
  config,
  ADDRESS_ZERO,
  ADDRESS_ONE,
  ADDRESS_DEAD,
  PAGE_SIZE,
  MAX_FEE,
  DEFAULT_NAME,
  DEFAULT_SYMBOL
};
