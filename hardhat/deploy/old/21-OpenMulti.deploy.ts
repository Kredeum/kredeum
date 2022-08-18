import type { DeployFunction, DeployResult } from "hardhat-deploy/types";

import { writeFile } from "fs/promises";
import networks from "@config/networks.handlebars.json";

import type { NFTsFactoryV2 } from "@soltypes/contracts/NFTsFactoryV2";

const contractName = "OpenMulti";

const deployFunction: DeployFunction = async function ({ deployments, network, ethers }) {
  const { getNamedSigner, getContract } = ethers;
  const deployer = await getNamedSigner("deployer");

  const bafkrei = await getContract("Bafkrey");
  // console.log("deployFunction ~ bafkrei.address", bafkrei.address);

  const deployResult: DeployResult = await deployments.deploy(contractName, {
    from: deployer.address,
    args: ["OpenMulti", "MULTI"],
    libraries: { Bafkrei: bafkrei.address },
    log: true
  });

  if (deployResult.newlyDeployed) {
    // console.log("Template newly deployed");

    const index = networks.findIndex((nw) => nw.chainName === network.name);
    networks[index].openMulti = deployResult.address;
    await writeFile(
      `${__dirname}/../../../common/config/networks.handlebars.json`,
      JSON.stringify(networks, null, 2)
    ).catch((err) => console.log(err));
  }

  const nftsFactoryV2 = (await getContract("NFTsFactoryV2", deployer)) as unknown as NFTsFactoryV2;
  await nftsFactoryV2.implementationsAdd([deployResult.address]);
};

deployFunction.dependencies = ["Bafkrey", "NFTsFactoryV2"];
deployFunction.tags = [contractName];
deployFunction.id = contractName;

export default deployFunction;
