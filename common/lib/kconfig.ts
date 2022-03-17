import type { Provider } from "@ethersproject/abstract-provider";
import type { Address, Network, Collection, Nft } from "./ktypes";

import { Fragment, Interface } from "@ethersproject/abi";
import { providers, utils, BigNumber } from "ethers";
import { factoryGetAddress, factoryGetTemplateAddress } from "./kfactory-get";
import networks from "../config/networks.json";
import config from "../config/config.json";

const networksMap = new Map(networks.map((network) => [network.chainId, network]));

const getChecksumAddress = (address: Address | string | undefined): Address => {
  return address ? utils.getAddress(address) : "";
};

const getChainId = (chainName: string): number | undefined => {
  return networks.find((nw) => nw.chainName === chainName)?.chainId;
};

const getNetwork = (chainId: number | string): Network | undefined => {
  return networksMap.get(Number(chainId));
};

const getEnsName = async (address: string): Promise<string> => {
  let name = "";
  try {
    const ensProvider: Provider = new providers.JsonRpcProvider(
      `https://mainnet.infura.io/v3/${process.env.INFURA_API_KEY}`
    );
    name = (await ensProvider.lookupAddress(address)) || "";
  } catch (e) {
    console.error("NO ENS found");
  }
  return name || address || "";
};

const getSubgraphUrl = (chainId: number): string => {
  const network = getNetwork(chainId);
  return (network?.subgraph?.active && network?.subgraph?.url) || "";
};

const getCovalent = (chainId: number): boolean => {
  const network = getNetwork(chainId);
  return Boolean(network?.covalent?.active);
};

// GET chain Name
const getChainName = (chainId: number): string => {
  const network = getNetwork(chainId);
  return network?.chainName || "";
};

// GET explorer
const getExplorer = (chainId: number): string => {
  const network = getNetwork(chainId);
  return network?.blockExplorerUrls[0] || "";
};

// GET OpenSeaKredeum
const getOpenSeaKredeum = (chainId: number): string => {
  const network = getNetwork(chainId);
  return network?.openSea?.openNFTs || "";
};

// GET OpenSea
const getOpenSeaAssets = (chainId: number): string => {
  const network = getNetwork(chainId);
  return network?.openSea?.assets || "";
};

// GET Create
const getCreate = (chainId: number): boolean => {
  const network = getNetwork(chainId);
  return Boolean(network?.create);
};

// nfts url : nfts://chainName/collectionAddress
const nftsUrl = (chainId: number, _collectionAddress: Address): string => {
  const network = getNetwork(chainId);
  return (
    "nfts://" +
    (network ? network.chainName : "...") +
    (_collectionAddress ? "/" + getChecksumAddress(_collectionAddress) : "...")
  );
};

// url @ owner : url://xyz@ownerAddress
const urlOwner = (_url: string, _ownerAddress: Address): string =>
  _url + (_ownerAddress ? "/" + getChecksumAddress(_ownerAddress) : "");

// nft url : nft://chainName/collectionAddress/tokenID
const nftUrl3 = (chainId: number, _contract: Address, _tokenId = "", n = 999): string => {
  const network = getNetwork(chainId);
  const ret =
    "nft://" +
    (network
      ? network.chainName +
        (_contract ? "/" + (getShortAddress(_contract, n) + (_tokenId ? "/" + textShort(_tokenId, 8) : "")) : "")
      : "");
  // console.log("nftUrl3", chainId, _contract, _tokenId, plus, ret);
  return ret;
};
const nftUrl = (nft: Nft, n?: number): string => nftUrl3(nft.chainId, nft.collection, nft.tokenID, n);

// CONSTANT
const ipfsGateway = "https://ipfs.io/ipfs/";

const textShort = (s: string, n = 16, p = n): string => {
  const ipfsStr: string = s?.toString() || "";
  const str: string = ipfsLinkToCid(ipfsStr);
  const l: number = str.length || 0;
  return str.substring(0, n) + (l < n ? "" : "..." + (p > 0 ? str.substring(l - p, l) : ""));
};

const getShortAddress = (address = "?", n = 8): string =>
  address.endsWith(".eth") ? textShort(address, 2 * n, 0) : textShort(getChecksumAddress(address), n, n);

// GENERIC helpers
const sleep = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));

const addressSame = (a: string, b: string): boolean => a.toLowerCase() === b.toLowerCase();

const numberToHexString = (num = 0): string => "0x" + Number(num).toString(16);

const urlToLink = (url: string, label?: string): string => `<a href="${url}" target="_blank">${label || url}</a>`;
/////////////////////////////////////////////////////////////////////////////////////////////////////

/////////////////////////////////////////////////////////////////////////////////////////////////////
// IPFS helpers
/////////////////////////////////////////////////////////////////////////////////////////////////////
// uri : https://ipfs.io/ipfs/bafkreieivwe2vhxx72iqbjibxabk5net4ah5lo3khekt6ojyn7cucek624
// => ipfs://bafkreieivwe2vhxx72iqbjibxabk5net4ah5lo3khekt6ojyn7cucek624
/////////////////////////////////////////////////////////////////////////////////////////////////////
const ipfsGetLink = (uri: string): string => {
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
// uri : https://ipfs.io/ipfs/bafkreieivwe2vhxx72iqbjibxabk5net4ah5lo3khekt6ojyn7cucek624
// uri : ipfs://bafkreieivwe2vhxx72iqbjibxabk5net4ah5lo3khekt6ojyn7cucek624
// => https://ipfs.io/ipfs/bafkreieivwe2vhxx72iqbjibxabk5net4ah5lo3khekt6ojyn7cucek624
/////////////////////////////////////////////////////////////////////////////////////////////////////
const ipfsToUrlHttp = (url: string): string => (url.startsWith("ipfs://") ? ipfsGatewayUrl(url) : url);

/////////////////////////////////////////////////////////////////////////////////////////////////////
// cid : bafkreieivwe2vhxx72iqbjibxabk5net4ah5lo3khekt6ojyn7cucek624
// => ipfs://bafkreieivwe2vhxx72iqbjibxabk5net4ah5lo3khekt6ojyn7cucek624
/////////////////////////////////////////////////////////////////////////////////////////////////////
const ipfsCidToLink = (cid: string): string => (cid ? `ipfs://${cid}` : "");

/////////////////////////////////////////////////////////////////////////////////////////////////////
// ipfs : ipfs://bafkreieivwe2vhxx72iqbjibxabk5net4ah5lo3khekt6ojyn7cucek624
// => bafkreieivwe2vhxx72iqbjibxabk5net4ah5lo3khekt6ojyn7cucek624
/////////////////////////////////////////////////////////////////////////////////////////////////////
const ipfsLinkToCid = (ipfs: string): string => ipfs.replace(/^ipfs:\/\//, "");

/////////////////////////////////////////////////////////////////////////////////////////////////////
// ipfs : ipfs://bafkreieivwe2vhxx72iqbjibxabk5net4ah5lo3khekt6ojyn7cucek624
// => bafkreieivwe2vhxx72iqbjibxabk5net4ah5lo3khekt6ojyn7cucek624
// => https://ipfs.io/ipfs/bafkreieivwe2vhxx72iqbjibxabk5net4ah5lo3khekt6ojyn7cucek624
/////////////////////////////////////////////////////////////////////////////////////////////////////
const ipfsGatewayUrl = (ipfs: string): string => `${ipfsGateway}${ipfsLinkToCid(ipfs)}`;

/////////////////////////////////////////////////////////////////////////////////////////////////////
// ipfs : ipfs://bafkreieivwe2vhxx72iqbjibxabk5net4ah5lo3khekt6ojyn7cucek624
// => <a href="https://ipfs.io/ipfs/bafkreieivwe2vhxx72iqbjibxabk5net4ah5lo3khekt6ojyn7cucek624" target="_blank">bafk...cek624</a>
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

// ADDRESS URL
const explorerAddressUrl = (chainId: number, address: string): string =>
  // https://etherscan.io/address/0x4b7992F03906F7bBE3d48E5Fb724f52c56cFb039
  explorerUrl(chainId, `/address/${address}`);

// TX URL
const explorerTxUrl = (chainId: number, tx: string): string =>
  // https://etherscan.io/tx/0xf7a974c93ee811863ce31e642880d9c5883995f8492783227f92fa43c2bee177
  explorerUrl(chainId, `/tx/${tx}`);

// NFTS_FACTORY URL
const explorerNFTsFactoryUrl = (chainId: number): string =>
  // https://blockscout.com/xdai/mainnet/address/0x86246ba8F7b25B1650BaF926E42B66Ec18D96000/read-contract
  // https://etherscan.io/address/0x4b7992F03906F7bBE3d48E5Fb724f52c56cFb039#readContract
  explorerContractUrl(chainId, factoryGetAddress(chainId));

// OPEN_NFTS URL
const explorerOpenNFTsUrl = async (chainId: number, provider: Provider): Promise<string> =>
  // https://etherscan.io/address/0x82a398243EBc2CB26a4A21B9427EC6Db8c224471#readContract
  explorerContractUrl(chainId, await factoryGetTemplateAddress(chainId, "OpenNFTsV3", provider));

// ACCOUNT URL
const explorerAccountUrl = (chainId: number, address: string): string => {
  let url = "";
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
    // https://blockscout.com/xdai/mainnet/token/0x74e596525C63393f42C76987b6A66F4e52733efa/inventory
    url = explorerUrl(chainId, `/token/${collAddress}/inventory`);
  } else {
    // https://etherscan.io/token/0x82a398243ebc2cb26a4a21b9427ec6db8c224471#inventory
    url = explorerUrl(chainId, `/token/${collAddress}#inventory`);
  }
  return url;
};

// KREDEUM NFT URL
const kredeumNftUrl = (chainId: number, nft: Nft): string =>
  `./#/${getChainName(nft.chainId)}/${nft?.collection}/${nft?.tokenID}`;

// NFT URL
const explorerNftUrl = (chainId: number, nft: Nft): string => {
  let url = "";
  if (getExplorer(chainId)?.includes("chainstacklabs.com") || getExplorer(chainId)?.includes("blockscout.com")) {
    // https://blockscout.com/xdai/mainnet/token/0x22C1f6050E56d2876009903609a2cC3fEf83B415/instance/3249859/metadata
    url = explorerUrl(chainId, `/tokens/${nft?.collection}/instance/${nft?.tokenID}/metadata`);
    url = explorerUrl(chainId, `/token/${nft?.collection}/instance/${nft?.tokenID}/metadata`);
  } else {
    // https://etherscan.io/token/0x82a398243EBc2CB26a4A21B9427EC6Db8c224471?a=1
    url = explorerUrl(chainId, `/token/${nft?.collection}?a=${nft?.tokenID}#inventory`);
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
  `${collection?.balanceOf} ${collectionSymbol(collection)}${(collection?.balanceOf || 0) > 1 ? "s" : ""}`;

// NFT helpers
const nftExplorerLink = (nft: Nft, n?: number): string => urlToLink(explorerNftUrl(nft?.chainId, nft), nftUrl(nft, n));

const nftOpenSeaUrl = (chainId: number, nft: Nft): string => {
  const openSeaAssets = getOpenSeaAssets(chainId);
  return `${openSeaAssets}/${nft?.collection}/${nft?.tokenID}`;
};

const nftName = (nft: Nft): string => nft?.name || `${nft?.contractName || "No name"} #${nft?.tokenID}`;

const nftDescription = (nft: Nft): string => (nft?.name != nft?.description && nft?.description) || nftName(nft);

const nftDescriptionShort = (nft: Nft, n = 16): string => textShort(nftDescription(nft), n, 0);
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

export {
  addressSame,
  collectionName,
  collectionSymbol,
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
  getChainId,
  getChainName,
  getShortAddress,
  getChecksumAddress,
  getNetwork,
  getEnsName,
  getSubgraphUrl,
  getOpenSeaKredeum,
  getOpenSeaAssets,
  getCreate,
  getCovalent,
  getExplorer,
  ipfsToUrlHttp,
  ipfsCidToLink,
  ipfsLinkToCid,
  ipfsGetLink,
  ipfsGatewayUrl,
  ipfsGatewayLink,
  interfaceId,
  nftUrl3,
  nftUrl,
  nftsUrl,
  nftDescription,
  nftDescriptionShort,
  nftExplorerLink,
  nftName,
  nftsSupply,
  nftsBalanceAndName,
  nftOpenSeaUrl,
  networks,
  numberToHexString,
  sleep,
  textShort,
  urlOwner,
  urlToLink,
  config
};
