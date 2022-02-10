import * as fs from "fs/promises";
import networks from "../../config/networks.json";
import type { DeployFunction } from "hardhat-deploy/types";
import type { NFTsFactory } from "../types/NFTsFactory";

const deployNFTsFactoryFunction: DeployFunction = async function ({ deployments, ethers, getChainId }) {
  const deployer = await ethers.getNamedSigner("deployer");

  const deployResult = await deployments.deploy("NFTsFactory", {
    from: deployer.address,
    args: [],
    log: true
  });

  if (deployResult.newlyDeployed) {
    const nftsFactory = new ethers.Contract(deployResult.address, deployResult.abi, deployer) as NFTsFactory;
    const contractProbeAddress = (await ethers.getContract("ContractProbe")).address;
    const openNFTsAddress = (await ethers.getContract("OpenNFTs")).address;

    await nftsFactory.connect(deployer).setContractProbe(contractProbeAddress);
    await nftsFactory.connect(deployer).setDefaultTemplate(openNFTsAddress);

    const chainId = Number(await getChainId());
    const index = networks.findIndex((network) => network.chainId === chainId);
    networks[index].nftsFactory = deployResult.address;

    await fs
      .writeFile(`${__dirname}/../../config/networks.json`, JSON.stringify(networks, null, 2))
      .catch((err) => console.log(err));
  }
};
deployNFTsFactoryFunction.tags = ["NFTsFactory"];
deployNFTsFactoryFunction.dependencies = ["ContractProbe", "OpenNFTs"];

export default deployNFTsFactoryFunction;
