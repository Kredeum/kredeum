import * as fs from "fs/promises";
import networks from "../../config/networks.json";
import type { DeployFunction } from "hardhat-deploy/types";

const deployNFTsFactoryFunction: DeployFunction = async function ({ deployments, ethers, getChainId }) {
  const deployer = await ethers.getNamedSigner("deployer");

  const openNFTs = (await ethers.getContract("OpenNFTs")).address;
  const contractProbe = (await ethers.getContract("ContractProbe")).address;

  const deployResult = await deployments.deploy("NFTsFactory", {
    from: deployer.address,
    args: [openNFTs, contractProbe],
    log: true
  });

  if (deployResult.newlyDeployed) {
    const chainId = Number(await getChainId());
    const index = networks.findIndex(network => network.chainId === chainId);
    networks[index].nftsFactory = deployResult.address;
    await fs.writeFile("./config/networks.json", JSON.stringify(networks, null, 2)).catch(err => console.log(err));
  }
};
deployNFTsFactoryFunction.tags = ["NFTsFactory"];
deployNFTsFactoryFunction.dependencies = ["ContractProbe", "OpenNFTs"];

export default deployNFTsFactoryFunction;
