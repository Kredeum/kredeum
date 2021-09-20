import type { HardhatRuntimeEnvironment } from "hardhat/types";
import type { DeployFunction } from "hardhat-deploy/types";

const contractName = "OpenNFTs";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts, ethers } = hre;
  const deployer = await ethers.getNamedSigner("deployer");

  deployments.log(`${contractName} deployer: ${deployer.address}`);

  await deployments.deploy(contractName, {
    args: [],
    from: deployer.address,
    log: true
  });

  const openNFTs = await ethers.getContract(contractName, deployer);
  await openNFTs.connect(deployer).initialize();
};
func.tags = [contractName];

export default func;
