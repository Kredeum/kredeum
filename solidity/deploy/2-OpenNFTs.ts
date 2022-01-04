import type { DeployFunction } from "hardhat-deploy/types";
import type { OpenNFTs } from "../types/OpenNFTs";

const deployOpenNFTsFunction: DeployFunction = async function ({ deployments, ethers }) {
  const deployer = await ethers.getNamedSigner("deployer");

  const deployResult = await deployments.deploy("OpenNFTs", {
    args: [],
    from: deployer.address,
    log: true
  });

  if (deployResult.newlyDeployed) {
    const openNFTs = new ethers.Contract(deployResult.address, deployResult.abi) as OpenNFTs;
    await openNFTs.connect(deployer).initialize("Open NFTs", "NFT");
  }
};
deployOpenNFTsFunction.tags = ["OpenNFTs"];

export default deployOpenNFTsFunction;
