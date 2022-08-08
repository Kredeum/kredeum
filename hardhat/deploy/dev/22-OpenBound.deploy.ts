import type { DeployFunction, DeployResult } from "hardhat-deploy/types";
import { writeFile } from "fs/promises";
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
      await  writeFile(`${__dirname}/../../../common/config/networks.json`, JSON.stringify(networks, null, 2))
        .catch((err) => console.log(err));
    }

    const openBound = await getContract(contractName, deployer);
    await (await (openBound as IOpenBound).initialize(contractName, "BOUND", deployer.address, maxSupply)).wait();

    const nftsFactoryV2 = await getContract("NFTsFactoryV2", deployer);
    await (await (nftsFactoryV2 as ICloneFactoryV2).implementationsAdd([deployResult.address])).wait();
    await (await (nftsFactoryV2 as ICloneFactoryV2).templateSet("OpenBound", deployResult.address)).wait();
  }
};

deployFunction.dependencies = ["NFTsFactoryV2"];
deployFunction.tags = [contractName];
deployFunction.id = contractName;

export default deployFunction;
