import type { Provider } from "@ethersproject/abstract-provider";
import type { ABIS, Address, Network, Nft } from "./ktypes";

import { ipfsLinkToCid } from "./knfts";
import networks from "../config/networks.json";
import config from "../config/config.json";
import abisJson from "./abis.json";

import { providers, utils } from "ethers";
import { collectionGetNFTsFactory } from "./kcollection-get";

const abis = abisJson as ABIS;
const version = config.version;

const networksMap = new Map(networks.map((network) => [network.chainId, network]));

const textShort = (s: string, n = 16, p = n): string => {
  const ipfsStr: string = s?.toString() || "";
  const str: string = ipfsLinkToCid(ipfsStr);
  const l: number = str.length || 0;
  return str.substring(0, n) + (l < n ? "" : "..." + (p > 0 ? str.substring(l - p, l) : ""));
};

const getChecksumAddress = (address: Address | string | undefined): Address => {
  return address ? utils.getAddress(address) : "";
};

const getShortAddress = (address = "?", n = 8): string =>
  address.endsWith(".eth") ? textShort(address, 2 * n, 0) : textShort(getChecksumAddress(address), n, n);

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

// GET chain name
const getChainName = (chainId: number): string => {
  const network = getNetwork(chainId);
  return network?.chainName || "";
};

// GET explorer
const getExplorer = (chainId: number): string => {
  const network = getNetwork(chainId);
  return network?.blockExplorerUrls[0] || "";
};

// GET openNFTs via onchain call
const getOpenNFTsAddress = async (chainId: number, provider: Provider): Promise<Address | undefined> => {
  const nftsFactory = collectionGetNFTsFactory(chainId, provider);
  const template = await nftsFactory.template();
  return template ? template : "";
};

// GET NFTs Factory
const collectionGetNFTsFactoryAddress = (chainId: number): Address | undefined =>
  getChecksumAddress(getNetwork(chainId)?.nftsFactory);

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

// GET NftsFactory
const getNftsFactory = (chainId: number): string => {
  const network = getNetwork(chainId);
  return network?.nftsFactory || "";
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

export {
  version,
  abis,
  textShort,
  networks,
  getChainName,
  getShortAddress,
  getChecksumAddress,
  getNetwork,
  getEnsName,
  getSubgraphUrl,
  getOpenSeaKredeum,
  getOpenSeaAssets,
  getCreate,
  getNftsFactory,
  getOpenNFTsAddress,
  collectionGetNFTsFactoryAddress,
  getCovalent,
  getExplorer,
  nftUrl3,
  nftUrl,
  nftsUrl,
  urlOwner
};
