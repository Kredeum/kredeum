import type { DeployFunction, DeployResult } from "hardhat-deploy/types";
import type { OpenNFTsV4 } from "types/OpenNFTsV4";
import type { NFTsFactoryV2 } from "types/NFTsFactoryV2";

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

    const openNFTsV4 = (await getContract(contractName, deployer)) as unknown as OpenNFTsV4;
    await openNFTsV4.initialize("Open NFTs", "NFT", deployer.address, [true, false]);

    const nftsFactoryV2 = (await getContract("NFTsFactoryV2", deployer)) as unknown as NFTsFactoryV2;
    await nftsFactoryV2.implementationsAdd([deployResult.address]);
  }
};

deployFunction.dependencies = ["NFTsFactoryV2"];
deployFunction.tags = [contractName];
deployFunction.id = contractName;
export default deployFunction;
