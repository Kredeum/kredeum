import type { DeployFunction } from "hardhat-deploy/types";
import { getNetwork } from "../../lib/kconfig";

const deployOpenNFTsFunction: DeployFunction = async function ({ deployments, ethers }) {
  const deployer = await ethers.getNamedSigner("deployer");

  const deployment = await deployments.deploy("OpenNFTs", {
    args: [],
    from: deployer.address,
    log: true
  });
};
deployOpenNFTsFunction.tags = ["OpenNFTs"];

export default deployOpenNFTsFunction;
