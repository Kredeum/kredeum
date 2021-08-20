import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts } = hre;
  const { deployer } = await getNamedAccounts();
  deployments.log("KredeumNFTsFactory deployer:", deployer);

  await deployments.deploy("KredeumNFTsFactory", {
    args: [],
    from: deployer,
    log: true
  });
};
export default func;
