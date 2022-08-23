import type { DeployFunction, Create2DeployOptions } from "hardhat-deploy/types";

import type { NFTsResolver } from "@soltypes/contracts/next/NFTsResolver";
import { setNetwork } from "@utils/setNetwork";
import { getNonce } from "@utils/getNonce";

// import { checkGasDeploy, checkGasMethod } from "@scripts/checkGas";

const contractName = "NFTsFactoryV3";

const deployFunction: DeployFunction = async function (hre): Promise<void> {
  const deployer = await hre.ethers.getNamedSigner("deployer");
  const nftsResolver = await hre.ethers.getContract("NFTsResolver", deployer);

  let nonce = await getNonce(deployer, contractName, "deploy", true);
  const deployArgs = [deployer.address, nftsResolver.address];
  const deployOptions: Create2DeployOptions = {
    from: deployer.address,
    args: deployArgs,
    log: true,
    nonce
  };

  // Deterministic expect for these networks
  // if (!["avalanche", "fuji"].includes(hre.network.name)) {
  //   deployOptions.salt = hre.ethers.utils.hashMessage("01 NFTsFactoryV3");
  // }

  const deployResult = await hre.deployments.deploy(contractName, deployOptions);
  // const deployResult = await checkGasDeploy(hre, contractName, deployOptions);

  if (deployResult.newlyDeployed) {
    await setNetwork(hre.network.name, "nftsFactoryV3", deployResult.address);

    const nftsResolver = (await hre.ethers.getContract(contractName, deployer)) as unknown as NFTsResolver;

    nonce = await getNonce(deployer, contractName, "setRegisterer");
    await (await nftsResolver.setRegisterer(deployer.address)).wait();

    nonce = await getNonce(deployer, contractName, "end");
  }
};

deployFunction.dependencies = ["NFTsResolver"];
deployFunction.tags = [contractName];
deployFunction.id = contractName;

export default deployFunction;
