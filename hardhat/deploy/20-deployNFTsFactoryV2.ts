import type { DeployFunction } from "hardhat-deploy/types";

import * as fs from "fs/promises";
import config from "config/config.json";

const deployNFTsFactoryV2: DeployFunction = async function ({ deployments, ethers, getChainId }) {
  const deployer = await ethers.getNamedSigner("deployer");
  const deployOptions = {
    from: deployer.address,
    args: [deployer.address],
    salt: ethers.utils.hashMessage("NFTsFactoryV2"),
    log: true
  };
  const deployDeterministic = await deployments.deterministic("NFTsFactoryV2", deployOptions);
  const deployResult = await deployDeterministic.deploy();

  if (deployResult.newlyDeployed) {
    if (deployResult.address != config.nftsFactoryV2) {
      console.info("NFTsFactoryV2 bytecode modified => new deterministic address!");
      config.nftsFactoryV2 = deployResult.address;
      await fs
        .writeFile(`${__dirname}/../../common/config/config.json`, JSON.stringify(config, null, 2))
        .catch((err) => console.log(err));
    }

    const nftsFactoryV2 = await ethers.getContract("NFTsFactoryV2");
    const openNFTsV2 = await ethers.getContract("OpenNFTsV2");
    const openNFTsV3 = await ethers.getContract("OpenNFTsV3");
    await nftsFactoryV2.connect(deployer).templateSet("ownable", openNFTsV3.address);
    await nftsFactoryV2.connect(deployer).templateSet("generic", openNFTsV2.address);
    await nftsFactoryV2.connect(deployer).clone("Open NFTs", "ONFT", "generic");
  }
};
deployNFTsFactoryV2.tags = ["NFTsFactoryV2"];

export default deployNFTsFactoryV2;
