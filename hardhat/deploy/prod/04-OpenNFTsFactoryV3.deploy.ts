import type { DeployFunction, Create2DeployOptions } from "hardhat-deploy/types";

import type { OpenNFTsResolver } from "@soltypes/contracts/next/OpenNFTsResolver";
import { setNetwork } from "@utils/setNetwork";
import { getNonce } from "@utils/getNonce";

// import { checkGasDeploy, checkGasMethod } from "@scripts/checkGas";

const contractName = "OpenNFTsFactoryV3";

const deployFunction: DeployFunction = async function (hre): Promise<void> {
  const deployer = await hre.ethers.getNamedSigner("deployer");

  let nonce = await getNonce(deployer, contractName, "deploy", true);
  const deployArgs = [deployer.address];
  const deployOptions: Create2DeployOptions = {
    from: deployer.address,
    args: deployArgs,
    log: true,
    nonce
  };

  // Deterministic expect for these networks
  // if (!["avalanche", "fuji"].includes(hre.network.name)) {
  //   deployOptions.salt = hre.ethers.utils.hashMessage("01 OpenNFTsFactoryV3");
  // }

  const deployResult = await hre.deployments.deploy(contractName, deployOptions);
  // const deployResult = await checkGasDeploy(hre, contractName, deployOptions);

  if (deployResult.newlyDeployed) {
    await setNetwork(hre.network.name, "nftsFactoryV3", deployResult.address);

    nonce = await getNonce(deployer, contractName, "end");
  }
};

deployFunction.dependencies = [];
deployFunction.tags = [contractName];
deployFunction.id = contractName;

export default deployFunction;
