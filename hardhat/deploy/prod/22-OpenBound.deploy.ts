import type { DeployFunction, DeployResult } from "hardhat-deploy/types";
import * as fs from "fs/promises";
import type { NFTsFactoryV2 } from "types/NFTsFactoryV2";

import type { NetworkType } from "lib/ktypes";
import networks from "config/networks.json";

const contractName = "OpenBound";

const deployFunction: DeployFunction = async function ({ deployments, network, ethers }) {
  const { provider, getNamedSigner, getContract } = ethers;
  const deployer = await getNamedSigner("deployer");

  const blockStart = (await provider.getBlockNumber()) + 100;
  deployments.log("blockStart", blockStart);

  const deployResult: DeployResult = await deployments.deploy(contractName, {
    from: deployer.address,
    args: [contractName, "BOUND", blockStart],
    log: true
  });

  if (deployResult.newlyDeployed) {
    const index = networks.findIndex((nw) => nw.chainName === network.name);
    const networkConf: NetworkType = networks[index];
    if (deployResult.address != networkConf.openBoundAma) {
      console.info(contractName, "deployed => new address");
      networks[index].openBoundAma = deployResult.address;
      await fs
        .writeFile(`${__dirname}/../../../common/config/networks.json`, JSON.stringify(networks, null, 2))
        .catch((err) => console.log(err));
    }

    const nftsFactoryV2 = (await getContract("NFTsFactoryV2", deployer)) as unknown as NFTsFactoryV2;
    await nftsFactoryV2.implementationsAdd([deployResult.address]);
  }
};

deployFunction.dependencies = ["Bafkrey", "NFTsFactoryV2"];
deployFunction.tags = [contractName];
deployFunction.id = contractName;

export default deployFunction;
