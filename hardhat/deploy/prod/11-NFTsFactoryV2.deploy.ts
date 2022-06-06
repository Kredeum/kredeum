import type { DeployFunction, Create2DeployOptions } from "hardhat-deploy/types";
import type { NetworkType } from "lib/ktypes";
import type { NFTsFactoryV2 } from "types/NFTsFactoryV2";
import type { OpenNFTsV3 } from "types/OpenNFTsV3";
import type { OpenMulti } from "types/OpenMulti";

import * as fs from "fs/promises";
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
      console.info(contractName, "deployed => new address");
      networks[index].nftsFactoryV2 = deployResult.address;
      await fs
        .writeFile(`${__dirname}/../../../common/config/networks.json`, JSON.stringify(networks, null, 2))
        .catch((err) => console.log(err));
    }
    const openNFTsV3: OpenNFTsV3 = await hre.ethers.getContract("OpenNFTsV3");
    const nftsFactoryV2: NFTsFactoryV2 = await hre.ethers.getContract(contractName, deployer);

    await nftsFactoryV2.templateSet("OpenNFTsV3", openNFTsV3.address);
    // await checkGasMethod(hre, contractName, "templateSet", deployer, "OpenNFTsV3", openNFTsV3.address);

    await nftsFactoryV2.implementationsAdd([openNFTsV3.address]);
    // await checkGasMethod(hre, contractName, "implementationsAdd", deployer, [openNFTsV3.address]);

    const openMulti: OpenMulti = await hre.ethers.getContract("OpenMulti");
    await nftsFactoryV2.implementationsAdd([openMulti.address]);
  }
};
deployFunction.dependencies = ["OpenNFTsV3", "OpenMulti"];
deployFunction.tags = [contractName];
deployFunction.id = contractName;
export default deployFunction;
