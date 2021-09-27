import type { DeployFunction } from "hardhat-deploy/types";
import { networkInterfaces } from "os";

const deployCloneFactoryFunction: DeployFunction = async function ({
  deployments,
  getChainId,
  ethers
}) {
  const deployer = await ethers.getNamedSigner("deployer");
  const contractProbe = (await ethers.getContract("ContractProbe")).address;

  const deployment = await deployments.deploy("CloneFactory", {
    args: [contractProbe],
    from: deployer.address,
    log: true
  });
};
deployCloneFactoryFunction.tags = ["CloneFactory"];
deployCloneFactoryFunction.dependencies = ["ContractProbe"];
deployCloneFactoryFunction.skip = async ({ getChainId }) => {
  return Number(getChainId) == 31337;
};

export default deployCloneFactoryFunction;
