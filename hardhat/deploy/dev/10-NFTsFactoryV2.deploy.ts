import type { DeployFunction, Create2DeployOptions } from "hardhat-deploy/types";
import type { NetworkType } from "lib/ktypes";

import { writeFile } from "fs/promises";
import networks from "config/networks.json";

// import { checkGasDeploy, checkGasMethod } from "scripts/checkGas";

const contractName = "NFTsFactoryV2";

const deployFunction: DeployFunction = async function (hre): Promise<void> {
  const deployer = await hre.ethers.getNamedSigner("deployer");
  const deployArgs = [deployer.address];
  const deployOptions: Create2DeployOptions = {
    from: deployer.address,
    args: deployArgs,
    log: true
  };

  // Deterministic expect for these networks
  // if (!["avalanche", "fuji"].includes(hre.network.name)) {
  //   deployOptions.salt = hre.ethers.utils.hashMessage("01 NFTsFactoryV2");
  // }

  const deployResult = await hre.deployments.deploy(contractName, deployOptions);
  // const deployResult = await checkGasDeploy(hre, contractName, deployOptions);

  if (deployResult.newlyDeployed) {
    const index = networks.findIndex((nw) => nw.chainName === hre.network.name);
    const networkConf: NetworkType = networks[index];
    if (deployResult.address != networkConf.nftsFactoryV2) {
      // console.info(contractName, "deployed => new address");
      networks[index].nftsFactoryV2 = deployResult.address;
      await writeFile(`${__dirname}/../../../common/config/networks.json`, JSON.stringify(networks, null, 2))
        .catch((err) => console.log(err));
    }
  }
};

deployFunction.tags = [contractName];
deployFunction.id = contractName;
export default deployFunction;
