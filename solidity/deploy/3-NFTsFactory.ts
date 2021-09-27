import type { DeployFunction } from "hardhat-deploy/types";
import { networks, getNetwork } from "../../lib/kconfig";

const deployNFTsFactoryFunction: DeployFunction = async function ({
  deployments,
  ethers,
  getChainId
}) {
  const deployer = await ethers.getNamedSigner("deployer");

  const costClone = ethers.utils.parseEther(`${getNetwork(await getChainId()).costClone}`);
  const openNFTs = (await ethers.getContract("OpenNFTs")).address;
  const contractProbe = (await ethers.getContract("ContractProbe")).address;

  await deployments.deploy("NFTsFactory", {
    from: deployer.address,
    args: [costClone, openNFTs, contractProbe],
    log: true
  });
};
deployNFTsFactoryFunction.tags = ["NFTsFactory"];
deployNFTsFactoryFunction.dependencies = ["ContractProbe", "OpenNFTs"];

export default deployNFTsFactoryFunction;
