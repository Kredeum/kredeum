import networks from "../config/networks.json";
import abis from "../config/abis.json";
import type { Contract, Network, ABIS, NftMetadata, NftData, KredeumKeys, ErcKeys } from "./ktypes";

import { ethers, Signer } from "ethers";

const _networks = new Map(networks.map((network) => [network.chainId, network]));

function getNetwork(_chainId: string): Network {
  return _networks.get(_chainId);
}

const getProvider = function (network: Network) {
  let provider;

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

    provider = new ethers.providers.JsonRpcProvider(`${url}${apiKey}`);
  }
  return provider;
};

const getSubgraphUrl = function (_network: Network): string {
  return (_network?.subgraph?.active && _network?.subgraph?.url) || "";
};

const getCovalent = function (_network: Network) {
  return _network?.covalent?.active;
};

// GET explorer
const getExplorer = function (_network: Network) {
  return _network?.blockExplorerUrls[0] || "";
};

// GET OpenSea
const getOpenSea = function (_network: Network) {
  return _network?.openSea || {};
};

// nfts url : nfts://chainName/contractAddress
const nftsUrl = function (_network: string, _address: string): string {
  return "nfts://" + (_network ? _network + (_address ? "/" + _address : "...") : "...");
};

// nft url : nft://chainName/contractAddress/tokenID
const nftUrl = function (
  _network: string,
  _contract: string,
  _tokenId: string,
  plus: string = "..."
): string {
  const ret =
    "nft://" +
    (_network
      ? _network + (_contract ? "/" + (_contract + (_tokenId ? "/" + _tokenId : plus)) : plus)
      : plus);
  console.log("nftUrl", _network, _contract, _tokenId, plus, ret);
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
