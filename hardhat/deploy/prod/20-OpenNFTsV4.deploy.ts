import type { DeployFunction, DeployResult } from "hardhat-deploy/types";
import type { IOpenNFTsV4, INFTsFactoryV3 } from "@soltypes/contracts/interfaces";
import type { IOpenRegistry } from "@soltypes/OpenNFTs/contracts/interfaces";
import { getNonce } from "@utils/getNonce";

// import { checkGasDeploy, checkGasMethod } from "@scripts/checkGas";
import { setNetwork } from "@utils/setNetwork";

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

  // const deployResult = await checkGasDeploy(hre, contractName, deployOptions);
  const deployResult: DeployResult = await deployments.deploy(contractName, deployOptions);

  if (deployResult.newlyDeployed) {
    // const contract = await getContract(contractName);
    // await checkGasMethod(hre, contractName, "initialize", deployer,

    await setNetwork(network.name, "openNFTs", deployResult.address);

    const openNFTsV4 = await getContract(contractName, deployer);

    nonce = await getNonce(deployer, contractName, "initialize");
    await (await (openNFTsV4 as IOpenNFTsV4).initialize("Open NFTs V4", "NFT", deployer.address, [true])).wait();

    const nftsFactoryV3 = await getContract("NFTsFactoryV3", deployer);

    nonce = await getNonce(deployer, contractName, "setTemplate");
    await (await (nftsFactoryV3 as INFTsFactoryV3).setTemplate("OpenNFTsV4", deployResult.address)).wait();

    const nftsResolver = await getContract("NFTsResolver", deployer);

    nonce = await getNonce(deployer, contractName, "addAddress");
    await (await (nftsResolver as IOpenRegistry).addAddress(deployResult.address)).wait();

    nonce = await getNonce(deployer, contractName, "end");
  }
};

deployFunction.dependencies = ["NFTsResolver"];
deployFunction.tags = [contractName];
deployFunction.id = contractName;
export default deployFunction;
