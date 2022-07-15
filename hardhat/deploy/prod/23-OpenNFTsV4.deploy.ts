import type { DeployFunction, DeployResult } from "hardhat-deploy/types";
import type { IOpenNFTs, ICloneFactoryV2 } from "soltypes/contracts/interfaces";

// import { checkGasDeploy, checkGasMethod } from "scripts/checkGas";

const contractName = "OpenNFTsV4";

const deployFunction: DeployFunction = async function ({ deployments, network, ethers }) {
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

    const openNFTsV4 = await getContract(contractName, deployer);

    // deployments.log("openNFTsV4", openNFTsV4);

    await openNFTsV4["initialize(string,string,address,bool[])"]("Open NFTs", "NFT", deployer.address, [true]);

    const nftsFactoryV2 = await getContract("NFTsFactoryV2", deployer);
    await (nftsFactoryV2 as ICloneFactoryV2).implementationsAdd([deployResult.address]);
  }
};

deployFunction.dependencies = ["NFTsFactoryV2"];
deployFunction.tags = [contractName];
deployFunction.id = contractName;
export default deployFunction;
