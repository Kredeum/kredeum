import type { DeployFunction } from "hardhat-deploy/types";
import { checkGasDeploy, checkGasMethod } from "scripts/checkGas";

const contractName = "OpenNFTsV3";

const deployfunction: DeployFunction = async function (hre) {
  const deployer = await hre.ethers.getNamedSigner("deployer");
  const deployResult = await checkGasDeploy(hre, contractName, {
    from: deployer.address,
    args: [],
    log: true
  });

  if (deployResult.newlyDeployed) {
    await checkGasMethod(hre, contractName, "initialize", deployer, "Open NFTs", "NFT", deployer.address, [
      false,
      true
    ]);
  }
};

deployfunction.tags = [contractName];
deployfunction.id = contractName;
export default deployfunction;
