import type { DeployFunction, DeployResult } from "hardhat-deploy/types";

import type { OpenNFTsV4 } from "@soltypes/contracts/next/OpenNFTsV4";
import type { OpenFactoryV3 } from "@soltypes/contracts/next/OpenFactoryV3";
import { getNonce } from "@utils/getNonce";
import { setNetwork } from "@utils/setNetwork";

// import { checkGasDeploy, checkGasMethod } from "@scripts/checkGas";

const contractName = "OpenNFTsV4";

const deployFunction: DeployFunction = async function ({ deployments, network, ethers }) {
  const { getNamedSigner, getContract } = ethers;
  const deployer = await getNamedSigner("deployer");

  let nonce = await getNonce(deployer, contractName, "deploy", true);
  const deployOptions = {
    from: deployer.address,
    args: [],
    log: true,
    nonce
  };

  const deployResult: DeployResult = await deployments.deploy(contractName, deployOptions);

  if (deployResult.newlyDeployed) {
    await setNetwork(network.name, "openNFTs", deployResult.address);

    const openNFTsV4 = (await getContract(contractName, deployer)) as unknown as OpenNFTsV4;
    const nftsFactoryV3 = (await getContract("OpenFactoryV3", deployer)) as unknown as OpenFactoryV3;

    nonce = await getNonce(deployer, contractName, "initialize");
    await (await openNFTsV4.initialize("Open NFTs V4", "NFT", deployer.address, [true])).wait();

    nonce = await getNonce(deployer, "OpenFactoryV3", "setTemplate");
    await (await nftsFactoryV3.setTemplate(contractName, deployResult.address)).wait();

    nonce = await getNonce(deployer, contractName, "end");
  }
};

deployFunction.dependencies = ["OpenFactoryV3", "OpenNFTsResolver"];
deployFunction.tags = [contractName];
deployFunction.id = contractName;

export default deployFunction;
