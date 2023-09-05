import type { DeployFunction, DeployResult } from "hardhat-deploy/types";

import type { OpenAutoMarket } from "@soltypes/OpenAutoMarket";
import type { OpenNFTsFactoryV3 } from "@soltypes/OpenNFTsFactoryV3";
import { getNonce } from "@utils/getNonce";
import { setNetwork } from "@contracts/deprecated/scripts/setNetwork";
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
    const nftsFactoryV3: OpenNFTsFactoryV3 = await getContract("OpenNFTsFactoryV3", deployer);

    nonce = await getNonce(deployer, contractName, "initialize");
    const subOptionsBytes = ethers.utils.defaultAbiCoder.encode(
      ["uint256", "address", "uint96", "bool[]"],
      [0, deployer.address, 0, [true, true]]
    );
    const optionsBytes = ethers.utils.defaultAbiCoder.encode(
      ["bytes", "address", "uint96"],
      [subOptionsBytes, config.treasury.account, config.treasury.fee]
    );

    const txResp = await openAutoMarket.initialize("OpenAutoMarket", "OMKT", deployer.address, optionsBytes, {
      gasLimit: 400_000
    });
    // console.log(txResp.hash);

    await txResp.wait();
    // const txReceipt = await txResp.wait();
    // console.log(txReceipt.status);

    nonce = await getNonce(deployer, "OpenNFTsFactoryV3", "setTemplate");
    await (await nftsFactoryV3.setTemplate(contractName, deployResult.address)).wait();

    nonce = await getNonce(deployer, contractName, "end");
  }
};

deployFunction.dependencies = ["OpenNFTsFactoryV3", "OpenNFTsResolver"];
deployFunction.tags = [contractName];
deployFunction.id = contractName;

export default deployFunction;
