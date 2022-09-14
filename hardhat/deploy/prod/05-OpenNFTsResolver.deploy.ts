import type { DeployFunction } from "hardhat-deploy/types";

import type { OpenFactoryV3 } from "@soltypes/contracts/next/OpenFactoryV3";
import { setNetwork } from "@utils/setNetwork";
import { getNonce } from "@utils/getNonce";

const contractName = "OpenNFTsResolver";

const deployFunction: DeployFunction = async function ({ ethers, network, deployments }): Promise<void> {
  const deployer = await ethers.getNamedSigner("deployer");

  const nftsFactoryV3: OpenFactoryV3 = await ethers.getContract("OpenFactoryV3", deployer);

  let nonce = await getNonce(deployer, contractName, "deploy", true);
  const deployOptions = {
    from: deployer.address,
    args: [deployer.address, nftsFactoryV3.address],
    log: true,
    nonce
  };

  const deployResult = await deployments.deploy(contractName, deployOptions);

  if (deployResult.newlyDeployed) {
    await setNetwork(network.name, "nftsResolver", deployResult.address);

    nonce = await getNonce(deployer, "OpenFactoryV3", "setResolver");
    await (await nftsFactoryV3.setResolver(deployResult.address)).wait();

    nonce = await getNonce(deployer, contractName, "end");
  }
};

deployFunction.dependencies = ["OpenFactoryV3"];
deployFunction.tags = [contractName];
deployFunction.id = contractName;

export default deployFunction;
