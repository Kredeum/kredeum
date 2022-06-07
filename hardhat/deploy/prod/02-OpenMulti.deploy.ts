import type { HardhatRuntimeEnvironment } from "hardhat/types";

import * as fs from "fs/promises";
import networks from "config/networks.json";

const contractName = "OpenMulti";

const deployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { ethers, deployments } = hre;
  const deployer = await ethers.getNamedSigner("deployer");

  const bafkrei = await hre.ethers.getContract("Bafkrey");
  console.log("deployFunction ~ bafkrei.address", bafkrei.address);

  const deployResult = await deployments.deploy(contractName, {
    from: deployer.address,
    args: ["OpenMulti", "MULTI"],
    libraries: { Bafkrei: bafkrei.address },
    log: true
  });

  if (deployResult.newlyDeployed) {
    console.log("Template newly deployed");

    const index = networks.findIndex((nw) => nw.chainName === hre.network.name);
    networks[index].openMulti = deployResult.address;
    await fs
      .writeFile(`${__dirname}/../../../common/config/networks.json`, JSON.stringify(networks, null, 2))
      .catch((err) => console.log(err));
  }
};
deployFunction.dependencies = ["Bafkrey"];
deployFunction.tags = [contractName];
deployFunction.id = contractName;

export default deployFunction;
