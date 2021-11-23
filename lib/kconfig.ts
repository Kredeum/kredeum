import networks from "../config/networks.json";
import abis from "../config/abis.json";
import type { Collection, Address, Network, ABIS, Nft, KredeumKeys, ErcKeys } from "./ktypes";

import { providers, utils } from "ethers";
import type { Provider } from "@ethersproject/abstract-provider";

const networksMap = new Map(networks.map((network) => [network.chainId, network]));

const getChecksumAddress = (address: Address | string | undefined): Address => {
  return address ? utils.getAddress(address) : "";
};

const getNetwork = (chainId: number | string): Network | undefined => {
  return networksMap.get(Number(chainId));
};

const getProvider = (chainId: number): Provider | undefined => {
  const network = getNetwork(chainId);
  // console.log("getProvider", chainId, "=>", network);

  const url = network?.rpcUrls[0];
  let apiKey = url?.includes("infura.io")
    ? process.env.INFURA_API_KEY
    : url?.includes("etherscan.io")
      ? process.env.ETHERSCAN_API_KEY
      : url?.includes("maticvigil.com")
        ? process.env.MATICVIGIL_API_KEY
        : null;
  apiKey = apiKey ? "/" + apiKey : "";
  const provider = new providers.JsonRpcProvider(`${url}${apiKey}`);

  return provider;
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

// GET openNFTs
const getOpenNFTsAddress = (chainId: number): Address | undefined => {
  const network = getNetwork(chainId);
  return getChecksumAddress(network?.openNFTs);
};

// GET OpenSeaKredeum
const getOpenSeaKredeum = (chainId: number): string => {
  const network = getNetwork(chainId);
  return network?.openSea?.kredeum || "";
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


// nfts url : nfts://chainName/contractAddress
const nftsUrl = (chainId: number, _address: Address): string => {
  const network = getNetwork(chainId);
  return (
    "nfts://" +
    (network ? network.chainName : "...") + (_address ? "/" + getChecksumAddress(_address) : "...")
  );
};

// nfts url  cache: nfts://chainName/contractAddress@address
const urlCache = (url: string, _owner: Address): string => url + (_owner ? "@" + getChecksumAddress(_owner) : "");

// nft url : nft://chainName/contractAddress/tokenID
const nftUrl = (chainId: number, _contract: Address, _tokenId = "", plus = ""): string => {
  const network = getNetwork(chainId);
  const ret =
    "nft://" +
    (network
      ? network.chainName +
      (_contract
        ? "/" + (getChecksumAddress(_contract) + (_tokenId ? "/" + _tokenId : plus))
        : plus)
      : plus);
  // console.log("nftUrl", chainId, _contract, _tokenId, plus, ret);
  return ret;
};

export {
  abis,
  networks,
  getChainName,
  getChecksumAddress,
  getNetwork,
  getEnsName,
  getProvider,
  getSubgraphUrl,
  getOpenSeaKredeum,
  getOpenSeaAssets,
  getCreate,
  getNftsFactory,
  getOpenNFTsAddress,
  getCovalent,
  getExplorer,
  nftUrl,
  nftsUrl,
  urlCache
};
export type { Collection, Network, ABIS, Nft, KredeumKeys, ErcKeys };
