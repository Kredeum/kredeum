import type { HardhatRuntimeEnvironment } from "hardhat/types";
import type { DeployFunction } from "hardhat-deploy/types";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, ethers } = hre;
  const deployer = await ethers.getNamedSigner("deployer");

  deployments.log(`${"NFTsFactory"} deployer: ${deployer.address}`);

  const tx = await deployments.deploy("NFTsFactory", {
    args: [],
    from: deployer.address,
    log: true
  });
  if (tx.newlyDeployed) {
    const openNFTs = await ethers.getContract("OpenNFTs");
    const nftsFactory = await ethers.getContract("NFTsFactory", deployer);
    await nftsFactory.addTemplate(openNFTs.address);
  }
};
func.tags = ["NFTsFactory"];

export default func;
