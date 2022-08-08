import type { DeployFunction, DeployResult } from "hardhat-deploy/types";
import type { IOpenNFTsV3, ICloneFactoryV2 } from "soltypes/contracts/interfaces";

// import { checkGasDeploy, checkGasMethod } from "scripts/checkGas";

const contractName = "OpenNFTsV3";

const deployFunction: DeployFunction = async function ({ deployments, ethers }) {
  const { getNamedSigner, getContract } = ethers;
  const deployer = await getNamedSigner("deployer");

  const deployOptions = {
    from: deployer.address,
    args: [],
    log: true
  };

  // const deployResult = await checkGasDeploy(hre, contractName, deployOptions);
  const deployResult: DeployResult = await deployments.deploy(contractName, deployOptions);

  if (deployResult.newlyDeployed) {
    // const contract = await getContract(contractName);
    // await checkGasMethod(hre, contractName, "initialize", deployer,

    const openNFTsV3 = await getContract(contractName, deployer);
    await (openNFTsV3 as IOpenNFTsV3).initialize("Open NFTs", "NFT", deployer.address, [true, false]);

    const nftsFactoryV2 = await getContract("NFTsFactoryV2", deployer);
    await (nftsFactoryV2 as ICloneFactoryV2).implementationsAdd([deployResult.address]);
  }
};

deployFunction.dependencies = ["NFTsFactoryV2"];
deployFunction.tags = [contractName];
deployFunction.id = contractName;
export default deployFunction;
