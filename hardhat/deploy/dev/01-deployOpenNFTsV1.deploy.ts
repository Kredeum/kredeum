import type { DeployFunction } from "hardhat-deploy/types";
import type { OpenNFTsV1 } from "types/OpenNFTsV1";

const deployOpenNFTsV1: DeployFunction = async function ({ deployments, ethers }) {
  const deployer = await ethers.getNamedSigner("deployer");

  const deployResult = await deployments.deploy("OpenNFTsV1", {
    from: deployer.address,
    args: [],
    log: true
  });
};
deployOpenNFTsV1.tags = ["OpenNFTsV1"];

export default deployOpenNFTsV1;
