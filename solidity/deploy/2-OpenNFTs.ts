import type { DeployFunction } from "hardhat-deploy/types";

const deployOpenNFTsFunction: DeployFunction = async function ({ deployments, ethers }) {
  const deployer = await ethers.getNamedSigner("deployer");

  const deployment = await deployments.deploy("OpenNFTs", {
    args: [],
    from: deployer.address,
    log: true
  });

  if (deployment.newlyDeployed) {
    const openNFTs = await ethers.getContract("OpenNFTs", deployer);
    await (await openNFTs.connect(deployer).initialize("Original Open NFTs", "NFT")).wait();
  }
};
deployOpenNFTsFunction.tags = ["OpenNFTs"];

export default deployOpenNFTsFunction;
