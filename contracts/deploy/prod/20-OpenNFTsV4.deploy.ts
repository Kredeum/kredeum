import type { DeployFunction, DeployResult } from "hardhat-deploy/types";

import type { OpenNFTsV4 } from "@soltypes/src/OpenNFTsV4";
import type { OpenNFTsFactoryV3 } from "@soltypes/src/OpenNFTsFactoryV3";
import { getNonce } from "@utils/getNonce";
import { setNetwork } from "@utils/setNetwork";
import { constants } from "ethers";

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

    const openNFTsV4: OpenNFTsV4 = await getContract(contractName, deployer);
    const nftsFactoryV3: OpenNFTsFactoryV3 = await getContract("OpenNFTsFactoryV3", deployer);

    nonce = await getNonce(deployer, contractName, "initialize");

    const subOptionsBytes = ethers.utils.defaultAbiCoder.encode(
      ["uint256", "address", "uint96", "bool[]"],
      [0, deployer.address, 0, [true]]
    );
    const optionsBytes = ethers.utils.defaultAbiCoder.encode(
      ["bytes", "address", "uint96"],
      [subOptionsBytes, constants.AddressZero, 0]
    );

    await (await openNFTsV4.initialize("OpenNFTsV4", "ONFT", deployer.address, optionsBytes)).wait();

    nonce = await getNonce(deployer, "OpenNFTsFactoryV3", "setTemplate");
    await (await nftsFactoryV3.setTemplate(contractName, deployResult.address)).wait();

    nonce = await getNonce(deployer, contractName, "end");
  }
};

deployFunction.dependencies = ["OpenNFTsFactoryV3", "OpenNFTsResolver"];
deployFunction.tags = [contractName];
deployFunction.id = contractName;

export default deployFunction;
