import type { DeployFunction } from "hardhat-deploy/types";
import type { OpenNFTsV3 } from "types/OpenNFTsV3";

// import { checkGasDeploy, checkGasMethod } from "scripts/checkGas";

const contractName = "OpenNFTsV3";

const deployfunction: DeployFunction = async function (hre) {
  const deployer = await hre.ethers.getNamedSigner("deployer");
  const deployOptions = {
    from: deployer.address,
    args: [],
    log: true
  };

  // const deployResult = await checkGasDeploy(hre, contractName, deployOptions);
  const deployResult = await hre.deployments.deploy(contractName, deployOptions);

  if (deployResult.newlyDeployed) {
    // const contract = await getContract(contractName);
    // await checkGasMethod(hre, contractName, "initialize", deployer,

    const openNFTsV3: OpenNFTsV3 = await hre.ethers.getContract(contractName, deployer);
    await openNFTsV3.initialize("Open NFTs", "NFT", deployer.address, [true, false]);
  }
};

deployfunction.tags = [contractName];
deployfunction.id = contractName;
export default deployfunction;
