import type { DeployFunction } from "hardhat-deploy/types";

const contractName = "Bafkrey";

const deployFunction: DeployFunction = async function ({ deployments, ethers }) {
  const deployer = await ethers.getNamedSigner("deployer");

  await deployments.deploy(contractName, {
    from: deployer.address,
    args: [],
    log: true
  });
};
deployFunction.tags = [contractName];
deployFunction.id = contractName;

export default deployFunction;
