import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

const contractName = "OpenProof";

const deployFunction: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts } = hre;
  const { deployer } = await getNamedAccounts();

  await deployments.deploy(contractName, {
    from: deployer,
    args: [],
    log: true
  });
};

deployFunction.tags = [contractName];
deployFunction.id = contractName;

export default deployFunction;
