import type { DeployFunction } from "hardhat-deploy/types";

const deployOpenNFTsFunction: DeployFunction = async function ({ deployments, ethers }) {
  const deployer = await ethers.getNamedSigner("deployer");

  await deployments.deploy("OpenNFTs", {
    args: [],
    from: deployer.address,
    log: true
  });
};
deployOpenNFTsFunction.tags = ["OpenNFTs"];

export default deployOpenNFTsFunction;
