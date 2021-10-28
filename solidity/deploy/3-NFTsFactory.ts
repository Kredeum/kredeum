import type { DeployFunction } from "hardhat-deploy/types";
import { getNetwork } from "../../lib/kconfig";

const deployNFTsFactoryFunction: DeployFunction = async function ({
  deployments,
  ethers,
  getChainId
}) {
  const network = getNetwork(await getChainId());

  const deployer = await ethers.getNamedSigner("deployer");

  const costClone = ethers.utils.parseEther(`${network?.costClone || 0}`);
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
