import { contracts, Contract } from "../config/types/contracts";
import { networks, Network } from "../config/types/networks";
import { abis } from "../config/types/abis";
import { ethers } from "ethers";

function getNetwork(_chainId: string) {
  return networks.find((network: Network) => Number(network.chainId) === Number(_chainId));
}

const getProvider = function (network: Network) {
  let provider;

  if (network) {
    const url = network.rpcUrls[0];
    const apiKey = url.includes("infura.io")
      ? process.env.INFURA_API_KEY
      : url.includes("etherscan.io")
      ? process.env.ETHERSCAN_API_KEY
      : url.includes("maticvigil.com")
      ? process.env.MATICVIGIL_API_KEY
      : "";
    provider = new ethers.providers.JsonRpcProvider(`${url}/${apiKey}`);
  }
  return provider;
};

export { abis, contracts, networks, getNetwork, getProvider };
export type { Contract, Network };
