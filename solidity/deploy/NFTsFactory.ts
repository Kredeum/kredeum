import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

const contractName = "NFTsFactory";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts } = hre;
  const { deployer } = await getNamedAccounts();

  deployments.log(`${contractName} deployer: ${deployer}`);

  await deployments.deploy(contractName, {
    args: [],
    from: deployer,
    log: true
  });
};
func.tags = [contractName];

export default func;
