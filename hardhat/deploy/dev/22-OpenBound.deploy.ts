import type { DeployFunction, DeployResult } from "hardhat-deploy/types";
import { writeFile } from "fs/promises";
import type { OpenFactoryV3 } from "@soltypes/contracts/next/OpenFactoryV3";
import type { OpenBound } from "@soltypes/contracts/next/OpenBound";

import type { NetworkType } from "@lib/common/ktypes";
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

    const openBound: OpenBound = await getContract(contractName, deployer);
    // await (await openBound.initialize(contractName, "BOUND", deployer.address, maxSupply)).wait();

    const nftsFactoryV3: OpenFactoryV3 = await getContract("OpenFactoryV3", deployer);
    await (await nftsFactoryV3.setTemplate(contractName, deployResult.address)).wait();
  }
};

deployFunction.dependencies = ["OpenNFTsResolver", "OpenFactoryV3"];
deployFunction.tags = [contractName];
deployFunction.id = contractName;

export default deployFunction;
