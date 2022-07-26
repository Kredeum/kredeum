import type { DeployFunction, DeployResult } from "hardhat-deploy/types";
import * as fs from "fs/promises";
import type { ICloneFactoryV2, IOpenBound } from "soltypes/contracts/interfaces";

import type { NetworkType } from "lib/ktypes";
import networks from "config/networks.json";

const contractName = "OpenBound";

const deployFunction: DeployFunction = async function ({ deployments, network, ethers }) {
  const { getNamedSigner, getContract } = ethers;
  const deployer = await getNamedSigner("deployer");

  const maxSupply = 0;
  // deployments.log("maxSupply", maxSupply);

  const deployResult: DeployResult = await deployments.deploy(contractName, {
    from: deployer.address,
    args: [],
    log: true
  });

  if (deployResult.newlyDeployed) {
    const index = networks.findIndex((nw) => nw.chainName === network.name);
    const networkConf: NetworkType = networks[index];
    if (deployResult.address != networkConf.openBound) {
      console.info(contractName, "deployed => new address");
      networks[index].openBound = deployResult.address;
      await fs
        .writeFile(`${__dirname}/../../../common/config/networks.json`, JSON.stringify(networks, null, 0))
        .catch((err) => console.log(err));
    }

    const openBound = await getContract("contracts/templates/OpenBound.sol:OpenBound", deployer);
    await (openBound as IOpenBound).initialize(contractName, "BOUND", deployer.address, maxSupply);

    const nftsFactoryV2 = await getContract("NFTsFactoryV2", deployer);
    await (nftsFactoryV2 as ICloneFactoryV2).implementationsAdd([deployResult.address]);
  }
};

deployFunction.dependencies = ["NFTsFactoryV2"];
deployFunction.tags = [contractName];
deployFunction.id = contractName;

export default deployFunction;
