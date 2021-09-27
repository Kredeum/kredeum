import type { DeployFunction } from "hardhat-deploy/types";

const deployContractProbeFunction: DeployFunction = async function ({ deployments, ethers }) {
  const deployer = await ethers.getNamedSigner("deployer");

  const deployment = await deployments.deploy("ContractProbe", {
    args: [],
    from: deployer.address,
    log: true
  });
};
deployContractProbeFunction.tags = ["ContractProbe"];

export default deployContractProbeFunction;
