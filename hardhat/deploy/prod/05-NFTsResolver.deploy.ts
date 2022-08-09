import type { DeployFunction } from "hardhat-deploy/types";
import type { NetworkType } from "lib/ktypes";

import type { INFTsResolver } from "soltypes/contracts/interfaces";
import { getNonce } from "../lib/nonces";

import { writeFile } from "fs/promises";
import networks from "config/networks.json";

const contractName = "NFTsResolver";

const deployFunction: DeployFunction = async function (hre): Promise<void> {
  const deployer = await hre.ethers.getNamedSigner("deployer");

  let nonce = await getNonce(deployer, contractName, "deploy", true);
  const deployOptions = {
    from: deployer.address,
    args: [],
    log: true,
    nonce
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

    nonce = await getNonce(deployer, contractName, "initialize");
    await (await (nftsResolver as INFTsResolver).initialize(deployer.address)).wait();

    nonce = await getNonce(deployer, contractName, "end", true);
  }
};

deployFunction.tags = [contractName];
deployFunction.id = contractName;
export default deployFunction;
