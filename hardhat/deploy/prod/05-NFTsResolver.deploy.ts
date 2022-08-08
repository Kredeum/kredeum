import type { DeployFunction } from "hardhat-deploy/types";
import type { NetworkType } from "lib/ktypes";

import type { INFTsResolver } from "soltypes/contracts/interfaces";

import { writeFile } from "fs/promises";
import networks from "config/networks.json";

const contractName = "NFTsResolver";

const deployFunction: DeployFunction = async function (hre): Promise<void> {
  const deployer = await hre.ethers.getNamedSigner("deployer");
  // const deployArgs = [];
  const deployOptions = {
    from: deployer.address,
    args: [],
    log: true
  };

  const deployResult = await hre.deployments.deploy(contractName, deployOptions);

  if (deployResult.newlyDeployed) {
    const index = networks.findIndex((nw) => nw.chainName === hre.network.name);
    const networkConf: NetworkType = networks[index];
    if (deployResult.address != networkConf.nftsResolver) {
      console.info(contractName, "deployed => new address");
      networks[index].nftsResolver = deployResult.address;
      await writeFile(`${__dirname}/../../../common/config/networks.json`, JSON.stringify(networks, null, 2)).catch(
        (err) => console.log(err)
      );
    }

    const nftsResolver = await hre.ethers.getContract(contractName, deployer);
    await (await (nftsResolver as INFTsResolver).initialize(deployer.address)).wait();
  }
};

deployFunction.tags = [contractName];
deployFunction.id = contractName;
export default deployFunction;
