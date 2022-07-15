import type { DeployFunction } from "hardhat-deploy/types";
import type { OpenNFTsV3 } from "soltypes/contracts";

const deployOpenNFTsV3: DeployFunction = async function ({ deployments, ethers }) {
  const deployer = await ethers.getNamedSigner("deployer");

  const deployResult = await deployments.deploy("OpenNFTsV3", {
    from: deployer.address,
    args: [],
    log: true
  });

  if (deployResult.newlyDeployed) {
    const openNFTsV3 = new ethers.Contract(deployResult.address, deployResult.abi) as OpenNFTsV3;
    await (await openNFTsV3.connect(deployer).initialize("Open NFTs", "NFT", deployer.address, [false, true])).wait();
  }
};
deployOpenNFTsV3.tags = ["OpenNFTsV3"];

export default deployOpenNFTsV3;
