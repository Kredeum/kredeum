import type { DeployFunction } from "hardhat-deploy/types";

import type { NFTsResolver } from "@soltypes/contracts/next/NFTsResolver";
import type { NFTsFactoryV3 } from "@soltypes/contracts/next/NFTsFactoryV3";
import { setNetwork } from "@utils/setNetwork";
import { getNonce } from "@utils/getNonce";

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
    await setNetwork(hre.network.name, "nftsResolver", deployResult.address);

    const nftsResolver = (await hre.ethers.getContract(contractName, deployer)) as unknown as NFTsResolver;
    const nftsFactoryV3 = (await hre.ethers.getContract("NFTsFactoryV3", deployer)) as unknown as NFTsFactoryV3;

    nonce = await getNonce(deployer, contractName, "initialize");
    await (await nftsResolver.initialize(deployer.address)).wait();

    nonce = await getNonce(deployer, contractName, "setRegisterer");
    await (await nftsResolver.setRegisterer(nftsFactoryV3.address)).wait();

    nonce = await getNonce(deployer, "NFTsFactoryV3", "setResolver");
    await (await nftsFactoryV3.setResolver(nftsResolver.address)).wait();

    nonce = await getNonce(deployer, contractName, "end");
  }
};

deployFunction.dependencies = ["NFTsFactoryV3"];
deployFunction.tags = [contractName];
deployFunction.id = contractName;

export default deployFunction;
