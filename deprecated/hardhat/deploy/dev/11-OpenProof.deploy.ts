import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import type { OpenProof } from "@soltypes/OpenProof";

const contractName = "OpenProof";

const deployFunction: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts } = hre;
  const { deployer } = await getNamedAccounts();

  const deployResult = await deployments.deploy(contractName, {
    from: deployer,
    args: [],
    log: true
  });

  if (deployResult.newlyDeployed) {
    const openProof = (await hre.ethers.getContract(contractName, deployer)) as unknown as OpenProof;
    await openProof.initialize("Open Proof", "PROOF", deployer);
  }
};

deployFunction.tags = [contractName];
deployFunction.id = contractName;

export default deployFunction;
