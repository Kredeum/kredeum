import type { DeployFunction } from "hardhat-deploy/types";

const contractName = "OpenBound4973";

const deployFunction: DeployFunction = async function ({ deployments, ethers }) {
  const deployer = await ethers.getNamedSigner("deployer");

  await deployments.deploy(contractName, {
    from: deployer.address,
    args: [contractName, "B4973"],
    log: true
  });
};
deployFunction.tags = [contractName];
deployFunction.id = contractName;

export default deployFunction;
