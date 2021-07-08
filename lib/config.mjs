import configContracts from "../config/contracts.json";
import networks from "../config/networks.json";
import abis from "../config/abis.json";
import { ethers } from "ethers";

function getNetwork(_chainId) {
  return networks.find((network) => Number(network.chainId) === Number(_chainId));
}

const getProvider = function (network) {
  const infuraKey = "0d6ba3a76f284eb39bef4e7fb2c8c002";
  const maticvigilKey = "9be3c456ae90b3eea0c4743c483c0dfc9696f2ae";
  let provider;

  if (network) {
    const url = network.rpcUrls[0];
    const apiKey = url.includes("maticvigil.com")
      ? maticvigilKey
      : url.includes("infura.io")
      ? infuraKey
      : "";
    provider = new ethers.providers.JsonRpcProvider(`${url}/${apiKey}`);
  }
  return provider;
};

export { configContracts, abis, networks, getNetwork, getProvider };
