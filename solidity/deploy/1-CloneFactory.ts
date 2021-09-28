import type { DeployFunction } from "hardhat-deploy/types";

const deployCloneFactoryFunction: DeployFunction = async function ({
  deployments,
  getChainId,
  ethers
}) {
  const deployer = await ethers.getNamedSigner("deployer");
  const contractProbe = (await ethers.getContract("ContractProbe")).address;

  await deployments.deploy("CloneFactory", {
    args: [contractProbe],
    from: deployer.address,
    log: true
  });
};
deployCloneFactoryFunction.tags = ["CloneFactory"];
deployCloneFactoryFunction.dependencies = ["ContractProbe"];
deployCloneFactoryFunction.skip = async ({ getChainId }) => {
  return Number(await getChainId()) != 31337;
};

export default deployCloneFactoryFunction;
