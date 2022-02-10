import type { DeployFunction } from "hardhat-deploy/types";

const deployContractProbeFunction: DeployFunction = async function ({ deployments, ethers }) {
  const deployer = await ethers.getNamedSigner("deployer");

  await deployments.deploy("ContractProbe", {
    args: [],
    from: deployer.address,
    log: true
  });
};
deployContractProbeFunction.tags = ["ContractProbe"];
deployContractProbeFunction.skip = async ({ getChainId }) => {
  return Number(await getChainId()) === 1;
};

export default deployContractProbeFunction;
