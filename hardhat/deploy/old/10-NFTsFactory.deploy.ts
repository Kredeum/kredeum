import type { DeployFunction, DeployResult } from "hardhat-deploy/types";
import type { NetworkType } from "lib/ktypes";

import { writeFile } from "fs/promises";
import networks from "config/networks.json";

const contractName = "NFTsFactory";

const deployFunction: DeployFunction = async function ({ deployments, network, ethers }) {
  const { getNamedSigner } = ethers;
  const deployer = await getNamedSigner("deployer");

  const deployOptions = {
    from: deployer.address,
    args: [],
    log: true
  };

  const deployResult: DeployResult = await deployments.deploy(contractName, deployOptions);

  if (deployResult.newlyDeployed) {
    const index = networks.findIndex((nw) => nw.chainName === network.name);
    const networkConf: NetworkType = networks[index];
    if (deployResult.address != networkConf.nftsFactory) {
      // console.info(contractName, "deployed => new address");
      networks[index].nftsFactory = deployResult.address;
      await  writeFile(`${__dirname}/../../../common/config/networks.json`, JSON.stringify(networks, null, 2))
        .catch((err) => console.log(err));
    }
  }
};

deployFunction.tags = [contractName];
deployFunction.id = contractName;
export default deployFunction;
