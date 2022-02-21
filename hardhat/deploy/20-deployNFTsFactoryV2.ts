import * as fs from "fs/promises";
import networks from "config/networks.json";
import type { DeployFunction } from "hardhat-deploy/types";
import type { NFTsFactoryV2 } from "types/NFTsFactoryV2";

const deployNFTsFactoryV2: DeployFunction = async function ({ deployments, ethers, getChainId }) {
  const deployer = await ethers.getNamedSigner("deployer");

  const deployResult = await deployments.deploy("NFTsFactoryV2", {
    from: deployer.address,
    args: [],
    log: true
  });

  if (deployResult.newlyDeployed) {
    const chainId = Number(await getChainId());
    const index = networks.findIndex((network) => network.chainId === chainId);
    networks[index].nftsFactoryV2 = deployResult.address;

    await fs
      .writeFile(`${__dirname}/../../common/config/networks.json`, JSON.stringify(networks, null, 2))
      .catch((err) => console.log(err));
  }
};
deployNFTsFactoryV2.tags = ["NFTsFactoryV2"];
deployNFTsFactoryV2.dependencies = ["ContractProbe"];

export default deployNFTsFactoryV2;
