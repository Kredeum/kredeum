import type { DeployFunction, DeployResult } from "hardhat-deploy/types";

import type { IOpenNFTsV4 } from "@soltypes/contracts/interfaces";
import type { IOpenRegistry } from "@soltypes/OpenNFTs/contracts/interfaces";
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

    const openNFTsV4 = (await getContract(contractName, deployer)) as unknown as IOpenNFTsV4;
    const nftsResolver = (await getContract("NFTsResolver", deployer)) as unknown as IOpenRegistry;

    nonce = await getNonce(deployer, contractName, "initialize");
    await (
      await (openNFTsV4 ).initialize("Open NFTs V4", "NFT", deployer.address, 0, deployer.address, 0, [true])
    ).wait();

    nonce = await getNonce(deployer, contractName, "addAddress");
    await (await (nftsResolver ).addAddress(deployResult.address)).wait();

    nonce = await getNonce(deployer, contractName, "end");
  }
};

deployFunction.dependencies = ["NFTsResolver"];
deployFunction.tags = [contractName];
deployFunction.id = contractName;

export default deployFunction;
