// import type { Network } from "../../lib/ktypes";
// import { ethers, changeNetwork } from "hardhat";
// import { NFTsFactory } from "../types/NFTsFactory";
import networks from "../../config/networks.json";

const ABI = [
  "function implementations(uint256 index) external view returns (address implementation)",
  "function implementationsCount() external view returns (uint256 count)"
];

const main = async (): Promise<boolean> => {
  // const signer = await ethers.getNamedSigner("deployer");

  for await (const network of networks) {
    if (network.mainnet && network.nftsFactory) {
      console.log(network.chainName);
      console.log("nftsFactory", network.nftsFactory);

      // changeNetwork(network.chainName);
      // const nftsFactory: NFTsFactory = await ethers.getContractAt(ABI, network.nftsFactory, signer);
      // console.log("nb implementations", await nftsFactory.implementationsCount());
      console.log();
    }
  }

  return true;
};

main().then(console.log).catch(console.error);
