import type { DeployFunction, DeployResult } from "hardhat-deploy/types";
import { writeFile } from "fs/promises";
import type { IOpenNFTsFactoryV3, IOpenBound } from "@soltypes/contracts/interfaces";

import type { NetworkType } from "@lib/ktypes";
import networks from "@config/networks.handlebars.json";

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
    const networkConf = networks[index];
    if (deployResult.address != networkConf.openBound) {
      console.info(contractName, "deployed => new address");
      networks[index].openBound = deployResult.address;
      await writeFile(
        `${__dirname}/../../../common/config/networks.handlebars.json`,
        JSON.stringify(networks, null, 2)
      ).catch((err) => console.log(err));
    }

    const openBound = (await getContract(contractName, deployer)) as unknown as IOpenBound;
    await (await openBound.initialize(contractName, "BOUND", deployer.address, maxSupply)).wait();

    const nftsFactoryV3 = (await getContract("OpenNFTsFactoryV3", deployer)) as unknown as IOpenNFTsFactoryV3;
    // TODO  await (await (nftsFactoryV3 as IOpenNFTsFactoryV3).implementationsAdd([deployResult.address])).wait();
    await (await nftsFactoryV3.setTemplate("OpenBound", deployResult.address)).wait();
  }
};

deployFunction.dependencies = ["OpenNFTsFactoryV3"];
deployFunction.tags = [contractName];
deployFunction.id = contractName;

export default deployFunction;
