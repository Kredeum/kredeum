import networks from "../config/networks.json";
import abis from "../config/abis.json";
import type { Contract, Network, ABIS, NftMetadata, NftData, KredeumKeys, ErcKeys } from "./ktypes";

import { ethers, providers, Signer } from "ethers";
import type { Provider } from "@ethersproject/abstract-provider";

const networksMap = new Map(networks.map((network) => [network.chainId, network]));

function getNetwork(chainId: number): Network {
  return networksMap.get(Number(chainId));
}

const getProvider = function (chainId: number): Provider {
  let provider: Provider;
  const network = getNetwork(chainId);

  if (network) {
    const url = network.rpcUrls[0];
    let apiKey = url.includes("infura.io")
      ? process.env.INFURA_API_KEY
      : url.includes("etherscan.io")
      ? process.env.ETHERSCAN_API_KEY
      : url.includes("maticvigil.com")
      ? process.env.MATICVIGIL_API_KEY
      : null;
    apiKey = apiKey ? "/" + apiKey : "";

    provider = new providers.JsonRpcProvider(`${url}${apiKey}`);
  }
  return provider;
};

const getSubgraphUrl = function (chainId: number): string {
  const network = getNetwork(chainId);
  return (network?.subgraph?.active && network?.subgraph?.url) || "";
};

const getCovalent = function (chainId: number) {
  const network = getNetwork(chainId);
  return network?.covalent?.active;
};

// GET explorer
const getExplorer = function (chainId: number) {
  const network = getNetwork(chainId);
  return network?.blockExplorerUrls[0] || "";
};

// GET OpenSea
const getOpenSea = function (chainId: number) {
  const network = getNetwork(chainId);
  return network?.openSea || {};
};

// nfts url : nfts://chainName/contractAddress
const nftsUrl = function (chainId: number, _address: string): string {
  const network = getNetwork(chainId);
  return "nfts://" + (network ? network.chainName + (_address ? "/" + _address : "...") : "...");
};

// nft url : nft://chainName/contractAddress/tokenID
const nftUrl = function (
  chainId: number,
  _contract: string,
  _tokenId: string,
  plus: string = "..."
): string {
  const network = getNetwork(chainId);
  const ret =
    "nft://" +
    (network
      ? network.chainName +
        (_contract ? "/" + (_contract + (_tokenId ? "/" + _tokenId : plus)) : plus)
      : plus);
  console.log("nftUrl", chainId, _contract, _tokenId, plus, ret);
  return ret;
};

export {
  abis,
  networks,
  getNetwork,
  getProvider,
  getSubgraphUrl,
  getCovalent,
  getExplorer,
  nftUrl,
  nftsUrl
};
export type { Contract, Network, ABIS, NftMetadata, NftData, KredeumKeys, ErcKeys };
