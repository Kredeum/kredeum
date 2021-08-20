import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts } = hre;
  const { deployer } = await getNamedAccounts();
  deployments.log("CloneFactory deployer:", deployer);

  await deployments.deploy("CloneFactory", {
    args: [],
    from: deployer,
    log: true
  });
};
export default func;
