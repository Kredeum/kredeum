import type { DeployFunction } from "hardhat-deploy/types";
import { setNetwork } from "@utils/setNetwork";

import type { INFTsResolver } from "@soltypes/contracts/interfaces";
import { getNonce } from "@utils/getNonce";

import networks from "@config/networks.handlebars.json";

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

    const networkConf = networks[index];
    if (deployResult.address != networkConf.nftsResolver) {
      console.info(contractName, "deployed => new address");

      await setNetwork(hre.network.name, "nftsResolver", deployResult.address);
    }
    const nftsResolver = await hre.ethers.getContract(contractName, deployer);

    nonce = await getNonce(deployer, contractName, "initialize");
    await (await (nftsResolver as INFTsResolver).initialize(deployer.address)).wait();

    nonce = await getNonce(deployer, contractName, "end");
  }
};

deployFunction.tags = [contractName];
deployFunction.id = contractName;
export default deployFunction;
