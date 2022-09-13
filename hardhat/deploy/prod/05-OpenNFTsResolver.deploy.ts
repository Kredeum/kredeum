import type { DeployFunction } from "hardhat-deploy/types";

import type { OpenNFTsResolver } from "@soltypes/contracts/next/OpenNFTsResolver";
import type { OpenFactoryV3 } from "@soltypes/contracts/next/OpenFactoryV3";
import { setNetwork } from "@utils/setNetwork";
import { getNonce } from "@utils/getNonce";

const contractName = "OpenNFTsResolver";

const deployFunction: DeployFunction = async function (hre): Promise<void> {
  const deployer = await hre.ethers.getNamedSigner("deployer");
  const nftsFactoryV3 = (await hre.ethers.getContract("OpenFactoryV3", deployer)) as unknown as OpenFactoryV3;

  let nonce = await getNonce(deployer, contractName, "deploy", true);
  const deployOptions = {
    from: deployer.address,
    args: [deployer.address, nftsFactoryV3.address],
    log: true,
    nonce
  };

  const deployResult = await hre.deployments.deploy(contractName, deployOptions);

  if (deployResult.newlyDeployed) {
    await setNetwork(hre.network.name, "nftsResolver", deployResult.address);

    nonce = await getNonce(deployer, "OpenFactoryV3", "setResolver");
    await (await nftsFactoryV3.setResolver(deployResult.address)).wait();

    nonce = await getNonce(deployer, contractName, "end");
  }
};

deployFunction.dependencies = ["OpenFactoryV3"];
deployFunction.tags = [contractName];
deployFunction.id = contractName;

export default deployFunction;
