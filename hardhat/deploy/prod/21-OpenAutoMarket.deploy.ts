import type { DeployFunction, DeployResult } from "hardhat-deploy/types";

import type { OpenAutoMarket } from "@soltypes/contracts/next/OpenAutoMarket";
import type { OpenFactoryV3 } from "@soltypes/contracts/next/OpenFactoryV3";
import { getNonce } from "@utils/getNonce";
import { setNetwork } from "@utils/setNetwork";
import config from "@config/config.json";

// import { checkGasDeploy, checkGasMethod } from "@scripts/checkGas";

const contractName = "OpenAutoMarket";

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

    const openAutoMarket: OpenAutoMarket = await getContract(contractName, deployer);
    const nftsFactoryV3: OpenFactoryV3 = await getContract("OpenFactoryV3", deployer);

    nonce = await getNonce(deployer, contractName, "initialize");
    const subOptionsBytes = ethers.utils.defaultAbiCoder.encode(
      ["uint256", "address", "uint96", "bool[]"],
      [0, deployer.address, 0, [true]]
    );
    const optionsBytes = ethers.utils.defaultAbiCoder.encode(
      ["bytes", "address", "uint96"],
      [subOptionsBytes, config.treasury.account, config.treasury.fee]
    );

    await (await openAutoMarket.initialize("OpenAutoMarket", "OMKT", deployer.address, optionsBytes)).wait();

    nonce = await getNonce(deployer, "OpenFactoryV3", "setTemplate");
    await (await nftsFactoryV3.setTemplate(contractName, deployResult.address)).wait();

    nonce = await getNonce(deployer, contractName, "end");
  }
};

deployFunction.dependencies = ["OpenFactoryV3", "OpenNFTsResolver"];
deployFunction.tags = [contractName];
deployFunction.id = contractName;

export default deployFunction;
