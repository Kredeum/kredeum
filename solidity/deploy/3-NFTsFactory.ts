import type { DeployFunction } from "hardhat-deploy/types";
import { getNetwork } from "../../lib/kconfig";

const deployNFTsFactoryFunction: DeployFunction = async function ({ deployments, ethers }) {
  const deployer = await ethers.getNamedSigner("deployer");

  const openNFTs = (await ethers.getContract("OpenNFTs")).address;
  const contractProbe = (await ethers.getContract("ContractProbe")).address;

  await deployments.deploy("NFTsFactory", {
    from: deployer.address,
    args: [openNFTs, contractProbe],
    log: true
  });
};
deployNFTsFactoryFunction.tags = ["NFTsFactory"];
deployNFTsFactoryFunction.dependencies = ["ContractProbe", "OpenNFTs"];

export default deployNFTsFactoryFunction;
