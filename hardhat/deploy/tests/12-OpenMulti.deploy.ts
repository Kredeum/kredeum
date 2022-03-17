import type { HardhatRuntimeEnvironment } from "hardhat/types";

const contractName = "OpenMulti";

const deployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { ethers, deployments } = hre;
  const deployer = await ethers.getNamedSigner("deployer");

  const deployResult = await deployments.deploy(contractName, {
    from: deployer.address,
    args: [],
    log: true
  });

  if (deployResult.newlyDeployed) {
    console.log("Template newly deployed");
  }
};
deployFunction.tags = [contractName];
deployFunction.id = contractName;

export default deployFunction;
