import type { DeployFunction, DeployResult, Create2DeployOptions } from "hardhat-deploy/types";
import type { NFTsFactoryV2 } from "types/NFTsFactoryV2";
import type { Network } from "lib/ktypes";

import * as fs from "fs/promises";
import networks from "config/networks.json";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { network } from "hardhat";

const deployNFTsFactoryV2: DeployFunction = async function (hre) {
  const deterministic = !["avalanche", "fuji"].includes(hre.network.name);
  const deployer = await hre.ethers.getNamedSigner("deployer");
  const deployOptions: Create2DeployOptions = {
    from: deployer.address,
    args: [deployer.address],
    log: true
  };
  let deployResult: DeployResult;

  if (deterministic) {
    deployOptions.salt = hre.ethers.utils.hashMessage("01 NFTsFactoryV2");

    const deployDeterministic = await hre.deployments.deterministic("NFTsFactoryV2", deployOptions);
    deployResult = await deployDeterministic.deploy();

    if (deployResult.address != deployDeterministic.address) {
      console.error("ERROR not deterministic", deployDeterministic.address, deployResult.address);
    }
  } else {
    deployResult = await hre.deployments.deploy("NFTsFactoryV2", deployOptions);
  }

  if (deployResult.newlyDeployed) {
    const index = networks.findIndex((network) => network.chainName === hre.network.name);
    const network: Network = networks[index];

    if (deployResult.address != network.nftsFactoryV2) {
      networks[index].nftsFactoryV2 = deployResult.address;
      await fs
        .writeFile(`${__dirname}/../../common/config/networks.json`, JSON.stringify(networks, null, 2))
        .catch((err) => console.log(err));
    }
    const nftsFactoryV2: NFTsFactoryV2 = await hre.ethers.getContract("NFTsFactoryV2");
    const openNFTsV3 = await hre.ethers.getContract("OpenNFTsV3");
    await (await nftsFactoryV2.connect(deployer).templateSet("OpenNFTsV3", openNFTsV3.address)).wait();
    await (await nftsFactoryV2.connect(deployer).implementationsAdd([openNFTsV3.address])).wait();
  }
};

deployNFTsFactoryV2.tags = ["NFTsFactoryV2"];

export default deployNFTsFactoryV2;
