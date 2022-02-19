import type { DeployFunction } from "hardhat-deploy/types";
import type { OpenNFTsV3 } from "types/OpenNFTsV3";

const deployOpenNFTsV3Function: DeployFunction = async function ({ deployments, ethers }) {
  const deployer = await ethers.getNamedSigner("deployer");

  const deployResult = await deployments.deploy("OpenNFTsV3", {
    from: deployer.address,
    args: [],
    log: true
  });

  if (deployResult.newlyDeployed) {
    const openNFTsV3 = new ethers.Contract(deployResult.address, deployResult.abi) as OpenNFTsV3;
    await openNFTsV3.connect(deployer).initialize("Open NFTs", "NFT", deployer.address, true);
  }
};
deployOpenNFTsV3Function.tags = ["OpenNFTsV3"];

export default deployOpenNFTsV3Function;
