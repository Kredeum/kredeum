import type { DeployFunction } from "hardhat-deploy/types";

const contractName = "OpenBound";

const deployFunction: DeployFunction = async function ({ deployments, ethers }) {
  const deployer = await ethers.getNamedSigner("deployer");

  const blockStart = (await ethers.provider.getBlockNumber()) + 1000;
  deployments.log("blockStart", blockStart);

  await deployments.deploy(contractName, {
    from: deployer.address,
    args: [contractName, "BOUND", blockStart],
    log: true
  });
};
deployFunction.tags = [contractName];
deployFunction.id = contractName;

export default deployFunction;
