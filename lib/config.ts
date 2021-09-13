import { contracts, Contract } from "../config/contracts";
import { networks, Network } from "../config/networks";
import abis from "../config/abis.json";
import { ethers } from "ethers";

function getNetwork(_chainId: string) {
  return networks.find((network) => Number(network.chainId) === Number(_chainId));
}

const getProvider = function (network: Network) {
  const infuraKey = "fc2d1a3eead04bdf9dd64a8b7be9f701";
  const maticvigilKey = "9be3c456ae90b3eea0c4743c483c0dfc9696f2ae";
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

export { abis, contracts, networks, getNetwork, getProvider, Contract, Network };
