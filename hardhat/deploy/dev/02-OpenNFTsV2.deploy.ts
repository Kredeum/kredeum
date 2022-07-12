import type { DeployFunction } from "hardhat-deploy/types";
import type { OpenNFTsV2 } from "soltypes/contracts/OpenNFTsV2";

const deployOpenNFTsV2: DeployFunction = async function ({ deployments, ethers }) {
  const deployer = await ethers.getNamedSigner("deployer");

  const deployResult = await deployments.deploy("OpenNFTsV2", {
    from: deployer.address,
    args: [],
    log: true
  });

  if (deployResult.newlyDeployed) {
    const openNFTsV2 = new ethers.Contract(deployResult.address, deployResult.abi) as OpenNFTsV2;
    await openNFTsV2.connect(deployer).initialize("Open NFTs", "NFT");
  }
};
deployOpenNFTsV2.tags = ["OpenNFTsV2"];

export default deployOpenNFTsV2;
