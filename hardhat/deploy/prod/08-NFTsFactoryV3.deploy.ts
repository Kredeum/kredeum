import type { DeployFunction, Create2DeployOptions } from "hardhat-deploy/types";
import { setNetwork } from "@utils/setNetwork";

// import { checkGasDeploy, checkGasMethod } from "@scripts/checkGas";

const contractName = "NFTsFactoryV3";

const deployFunction: DeployFunction = async function (hre): Promise<void> {
  const deployer = await hre.ethers.getNamedSigner("deployer");
  const nftsResolver = await hre.ethers.getContract("NFTsResolver", deployer);

  const deployArgs = [deployer.address, nftsResolver.address];
  const deployOptions: Create2DeployOptions = {
    from: deployer.address,
    args: deployArgs,
    log: true
  };

  // Deterministic expect for these networks
  // if (!["avalanche", "fuji"].includes(hre.network.name)) {
  //   deployOptions.salt = hre.ethers.utils.hashMessage("01 NFTsFactoryV3");
  // }

  const deployResult = await hre.deployments.deploy(contractName, deployOptions);
  // const deployResult = await checkGasDeploy(hre, contractName, deployOptions);

  if (deployResult.newlyDeployed) {
    // console.info(contractName, "deployed => new address");

    await setNetwork(hre.network.name, "nftsFactoryV3", deployResult.address);
  }
};

deployFunction.dependencies = ["NFTsResolver"];
deployFunction.tags = [contractName];
deployFunction.id = contractName;
export default deployFunction;
