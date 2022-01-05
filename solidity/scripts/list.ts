import type { Web3Provider } from "@ethersproject/providers";
import type { EthereumProvider } from "hardhat/types";
import type { NFTsFactory } from "../types/NFTsFactory";

import hre from "hardhat";
import networks from "../../config/networks.json";
import { ethers } from "ethers";

const ABI = [
  "function implementations(uint256 index) external view returns (address implementation)",
  "function implementationsCount() external view returns (uint256 count)"
];

const main = async (): Promise<boolean> => {
  for await (const network of networks) {
    if (network.mainnet && network.nftsFactory) {
      hre.changeNetwork(network.chainName);

      // console.log("nftsFactory", network.nftsFactory);

      const signer = await hre.ethers.getNamedSigner("deployer");

      const nftsFactory: NFTsFactory = await hre.ethers.getContractAt("NFTsFactory", network.nftsFactory, signer);
      const nb = Number(await nftsFactory.implementationsCount());
      console.log(`${network.chainName}: ${nb} collection${nb > 1 ? "s" : ""}`);
    }
  }

  return true;
};

main().then(console.log).catch(console.error);
