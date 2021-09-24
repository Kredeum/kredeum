import type { HardhatRuntimeEnvironment } from "hardhat/types";
import type { DeployFunction } from "hardhat-deploy/types";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, ethers } = hre;
  const deployer = await ethers.getNamedSigner("deployer");

  deployments.log(`OpenNFTs deployer: ${deployer.address}`);

  const tx = await deployments.deploy("OpenNFTs", {
    args: [],
    from: deployer.address,
    log: true
  });

  if (tx.newlyDeployed) {
    const openNFTs = await ethers.getContract("OpenNFTs", deployer);
    await openNFTs.connect(deployer).initialize();
  }
};
func.tags = ["OpenNFTs"];

export default func;
