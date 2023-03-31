import type { DeployFunction, Create2DeployOptions } from "hardhat-deploy/types";

import { setNetwork } from "@utils/setNetwork";
import { getNonce } from "@utils/getNonce";
import config from "@config/config.json";

// import { checkGasDeploy, checkGasMethod } from "@scripts/checkGas";

const contractName = "OpenNFTsFactoryV3";

const deployFunction: DeployFunction = async function ({ ethers, network, deployments }): Promise<void> {
  const deployer = await ethers.getNamedSigner("deployer");

  let nonce = await getNonce(deployer, contractName, "deploy", true);
  const deployArgs = [deployer.address, config.treasury.account, config.treasury.fee];
  const deployOptions: Create2DeployOptions = {
    from: deployer.address,
    args: deployArgs,
    log: true,
    nonce
  };

  // Deterministic expect for these networks
  // if (!["avalanche", "fuji"].includes(network.name)) {
  // deployOptions.salt = hashMessage("01 OpenNFTsFactoryV3");
  // }

  const deployResult = await deployments.deploy(contractName, deployOptions);
  // const deployResult = await checkGasDeploy(hre, contractName, deployOptions);

  if (deployResult.newlyDeployed) {
    await setNetwork(network.name, "nftsFactoryV3", deployResult.address);

    nonce = await getNonce(deployer, contractName, "end");
  }
};

deployFunction.dependencies = [];
deployFunction.tags = [contractName];
deployFunction.id = contractName;

export default deployFunction;
