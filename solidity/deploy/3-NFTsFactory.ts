import type { DeployFunction } from "hardhat-deploy/types";

const deployNFTsFactoryFunction: DeployFunction = async function ({ deployments, ethers }) {
  const deployer = await ethers.getNamedSigner("deployer");
  const contractProbe = (await ethers.getContract("ContractProbe")).address;

  const deployment = await deployments.deploy("NFTsFactory", {
    args: [contractProbe],
    from: deployer.address,
    log: true
  });

  if (deployment.newlyDeployed) {
    const openNFTs = await ethers.getContract("OpenNFTs");
    const nftsFactory = await ethers.getContract("NFTsFactory", deployer);
    await (await nftsFactory.setDefaultTemplate(openNFTs.address)).wait();
  }
};
deployNFTsFactoryFunction.tags = ["NFTsFactory"];
deployNFTsFactoryFunction.dependencies = ["ContractProbe", "OpenNFTs"];

export default deployNFTsFactoryFunction;
