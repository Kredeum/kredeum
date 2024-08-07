import type { TransactionResponse } from "@ethersproject/abstract-provider";
import { utils, BigNumber, constants, BigNumberish } from "ethers";
import { Fragment, Interface } from "@ethersproject/abi";

import type { CollectionType, NftType, RefPageType, AddressesType } from "../common/types";

import config from "@kredeum/config/dist/config.json";
import addressesRaw from "@kredeum/contracts/addresses.json";

import { formatEther } from "ethers/lib/utils";
import { networks } from "./networks";

const PAGE_SIZE = 12;
const MAX_FEE = 10000;
const DEFAULT_NAME = "No name";
const DEFAULT_SYMBOL = "NFT";
const ADDRESS_ZERO = "0x0000000000000000000000000000000000000000";
const ADDRESS_ONE = "0x0000000000000000000000000000000000000001";
const ADDRESS_DEAD = "0x000000000000000000000000000000000000dEaD";

const copyToClipboard = async (data: string): Promise<void> =>
  await navigator.clipboard.writeText(data).catch(() => console.error("Not copied"));

// Capitalize first letter
const strUpFirst = (str: string | undefined): string =>
  str && str.length >= 1 ? str.charAt(0).toUpperCase() + str.substring(1) : "";

const tokenIdSplit = (tokenIDs = ""): Array<string> => {
  const tokenIDsSanitize = tokenIDs.replace(/ /g, "");
  const tokenIDsArray = tokenIDsSanitize ? tokenIDsSanitize.split(",") : [];
  return tokenIDsArray;
};
const tokenIdCount = (tokenIDs: string): number => (tokenIDs === "" ? -1 : tokenIdSplit(tokenIDs).length);
const tokenIdSelected = (tokenID: string, tokenIDs?: string): boolean =>
  !tokenIDs || tokenIdSplit(tokenIDs).includes(tokenID);

const isCollection = (refHash: RefPageType) => networks.has(refHash.chainId) && isAddressNotZero(refHash.address);

const isAddress = (address = ""): boolean => utils.isAddress(address);
const isAddressZero = (address = ""): boolean => address === ADDRESS_ZERO;
const isAddressNotZero = (address = ""): boolean => isAddress(address) && !isAddressZero(address);

const getChecksumAddress = (address = ""): string => (isAddress(address) ? utils.getAddress(address) : ADDRESS_ZERO);

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
const addresses = JSON.parse(JSON.stringify(addressesRaw));
// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-return
const getAddresses = (chainId: number | string): AddressesType | undefined => addresses[String(chainId)];

const getAddressOpenNFTsTemplate = (chainId: number): string => getAddresses(chainId)?.OpenNFTsV4 || "";
const getAddressOpenAutoMarket = (chainId: number): string => getAddresses(chainId)?.OpenAutoMarket || "";

//  GET OpenMulti address
const getOpenBound = (chainId: number): string => getAddresses(chainId)?.OpenBound || "";
const hasOpenBound = (chainId: number): boolean => isAddress(getOpenBound(chainId));

// GET Dapp Url
const getDappUrl = (chainId: number, ref: RefPageType = {}, base = "."): string => {
  let dappUrl = `${base}/#/${chainId}`;
  if (isAddress(ref.address)) {
    dappUrl += `/${ref.address}`;
    if (isNumeric(ref.tokenID)) dappUrl += `/${ref.tokenID}`;
    if (isAddress(ref.account)) dappUrl += `@${ref.account}`;
    if (ref.action) dappUrl += `|${ref.action}`;
  }
  return dappUrl;
};

// GET Autoswarm Url
const getAutoswarmUrl = (chainId: number, ref: NftType | { address?: string; tokenID?: string } = {}): string => {
  let autoswarmUrl = `${config.autoswarm}/${chainId}`;
  if (isAddress(ref.address)) {
    autoswarmUrl += `/${ref.address}`;
    if (isNumeric(ref.tokenID)) autoswarmUrl += `/${ref.tokenID}`;
  }
  return autoswarmUrl;
};

// nft url : nft://chainName/collectionAddress/tokenID
const nftUrl3 = (chainId: number, address: string, tokenID = "", n = 999): string => {
  const network = networks.get(chainId);

  if (!(chainId && address && address != ADDRESS_ZERO && tokenID && network)) return "";
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
  const network = networks.get(chainId);
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

const getShortAddress = (address: string, n = 4): string =>
  address
    ? address.endsWith(".eth")
      ? textShort(address, 2 * n, 0)
      : textShort(getChecksumAddress(address), n + 2, n)
    : "?";

// GENERIC helpers
const sleep = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));

const addressSame = (a: string, b: string): boolean => a?.toLowerCase() === b?.toLowerCase();

const numberToHexString = (num = 0): string => "0x" + Number(num).toString(16);

const urlToLink = (url: string, label?: string): string =>
  `<a href="${url}" class="link" target="_blank" rel="noreferrer">${label || url}</a>`;

const isNumeric = (stringNum: string | undefined): boolean =>
  stringNum !== undefined && !isNaN(Number(stringNum)) && !isNaN(parseFloat(stringNum));
/////////////////////////////////////////////////////////////////////////////////////////////////////

/////////////////////////////////////////////////////////////////////////////////////////////////////
// EXPLORER URL helpers
/////////////////////////////////////////////////////////////////////////////////////////////////////
// BASIC URL
const explorerUrl = (chainId: number, path: string): string =>
  // https://etherscan.io/gastracker
  networks.getExplorer(chainId) + "/" + path.replace(/^\//, "");

// GENERIC MULTICHAIN URL
const blockscanUrl = (path: string): string =>
  // https://blockscan.com/address/0x4b7992F03906F7bBE3d48E5Fb724f52c56cFb039
  "https://blockscan.com/" + path.replace(/^\//, "");

// ADDRESS URL
const explorerAddressUrl = (chainId: number, address = ""): string =>
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
    if (
      networks.getExplorer(chainId)?.includes("chainstacklabs.com") ||
      networks.getExplorer(chainId)?.includes("blockscout.com")
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
  } else {
    blockscanUrl(`/address/${address}`);
  }
  return url;
};

// CONTRACT URL
const explorerContractUrl = (chainId: number, address: string): string => {
  let url = "";
  if (
    networks.getExplorer(chainId)?.includes("chainstacklabs.com") ||
    networks.getExplorer(chainId)?.includes("blockscout.com")
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
    networks.getExplorer(chainId)?.includes("chainstacklabs.com") ||
    networks.getExplorer(chainId)?.includes("blockscout.com")
  ) {
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
  if (
    networks.getExplorer(chainId)?.includes("chainstacklabs.com") ||
    networks.getExplorer(chainId)?.includes("blockscout.com")
  ) {
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
const uriShort = (uri: string): string => {
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
const displayEther = (chainId: number, price: BigNumberish): string =>
  `${formatEther(price)} ${networks.getCurrency(chainId)}`;
/////////////////////////////////////////////////////////////////////////////////////////////////////

/////////////////////////////////////////////////////////////////////////////////////////////////////
const feeAmount = (price = BigNumber.from(0), fee = 0): BigNumber => price.mul(fee).div(MAX_FEE);
/////////////////////////////////////////////////////////////////////////////////////////////////////
const treasuryAccount = (): string => config?.treasury?.account || ADDRESS_ZERO;
const treasuryFee = (): number => config?.treasury?.fee || 0;
const treasuryAmount = (price = BigNumber.from(0)): BigNumber => feeAmount(price, treasuryFee());
/////////////////////////////////////////////////////////////////////////////////////////////////////

export {
  strUpFirst,
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
  isCollection,
  isAddress,
  isAddressZero,
  isAddressNotZero,
  isNumeric,
  getShortAddress,
  getChecksumAddress,
  getAddresses,
  getAddressOpenNFTsTemplate,
  getAddressOpenAutoMarket,
  getOpenBound,
  hasOpenBound,
  getDappUrl,
  getAutoswarmUrl,
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
  config,
  ADDRESS_ZERO,
  ADDRESS_ONE,
  ADDRESS_DEAD,
  PAGE_SIZE,
  MAX_FEE,
  DEFAULT_NAME,
  DEFAULT_SYMBOL
};
