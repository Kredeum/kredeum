import type { DeployFunction } from "hardhat-deploy/types";
import type { NFTsFactoryV2 } from "types/NFTsFactoryV2";

import * as fs from "fs/promises";
import config from "config/config.json";
const deployNFTsFactoryV2: DeployFunction = async function ({ deployments, ethers }) {
  const deployer = await ethers.getNamedSigner("deployer");
  const deployOptions = {
    from: deployer.address,
    args: [deployer.address],
    salt: ethers.utils.hashMessage("01 NFTsFactoryV2"),
    log: true
  };
  const deployDeterministic = await deployments.deterministic("NFTsFactoryV2", deployOptions);
  const deployResult = await deployDeterministic.deploy();
  // const deployResult = await deployments.deploy("NFTsFactoryV2", deployOptions);

  if (deployResult.address != deployDeterministic.address) {
    console.error("ERROR not deterministic", deployDeterministic.address, deployResult.address);
  }

  if (deployResult.newlyDeployed) {
    if (deployResult.address != config.nftsFactoryV2) {
      console.info("NFTsFactoryV2 bytecode modified => new deterministic address!");
      config.nftsFactoryV2 = deployResult.address;
      await fs
        .writeFile(`${__dirname}/../../common/config/config.json`, JSON.stringify(config, null, 2))
        .catch((err) => console.log(err));
    }

    const nftsFactoryV2: NFTsFactoryV2 = await ethers.getContract("NFTsFactoryV2");
    const openNFTsV3 = await ethers.getContract("OpenNFTsV3");
    await (await nftsFactoryV2.connect(deployer).templateSet("OpenNFTsV3", openNFTsV3.address)).wait();
    await (await nftsFactoryV2.connect(deployer).implementationsAdd([openNFTsV3.address])).wait();
  }
};
deployNFTsFactoryV2.tags = ["NFTsFactoryV2"];

export default deployNFTsFactoryV2;
