import configNetworksAll from "../config/networks.json";
import configContracts from "../config/contracts.json";
import abis from "../config/abis.json";
import { ethers } from "ethers";

const chainIds = "0x1,0x38,0x89,0xfa";
const configNetworks = configNetworksAll.filter((network) => chainIds.includes(network.chainId));

function getNetwork(_chainId) {
  return configNetworksAll.find((network) => Number(network.chainId) === Number(_chainId));
}

const getProvider = function (network) {
  const infuraKey = "0d6ba3a76f284eb39bef4e7fb2c8c002";
  const maticvigilKey = "9be3c456ae90b3eea0c4743c483c0dfc9696f2ae";
  const url = network.rpcUrls[0];

  const apiKey = url.includes("maticvigil.com")
    ? maticvigilKey
    : url.includes("infura.io")
    ? infuraKey
    : "";
  return new ethers.providers.JsonRpcProvider(`${url}/${apiKey}`);
};

export { configNetworks, configContracts, abis, getProvider, getNetwork };
