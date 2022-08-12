import type { DeployFunction } from "hardhat-deploy/types";
import { getNonce } from "../lib/nonces";

const contractName = "Bafkrey";

const deployFunction: DeployFunction = async function ({ deployments, ethers }) {
  const deployer = await ethers.getNamedSigner("deployer");

  const nonce = await getNonce(deployer, contractName, "deploy", true);

  const deployResult = await deployments.deploy(contractName, {
    from: deployer.address,
    args: [],
    log: true,
    nonce
  });

  if (deployResult.newlyDeployed) {
    await getNonce(deployer, contractName, "end");
  }
};
deployFunction.tags = [contractName];
deployFunction.id = contractName;

export default deployFunction;
