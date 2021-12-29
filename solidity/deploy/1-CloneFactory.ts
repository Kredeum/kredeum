import type { DeployFunction } from "hardhat-deploy/types";
import type { CloneFactory } from "../types/CloneFactory";

const deployCloneFactoryFunction: DeployFunction = async function ({ deployments, ethers }) {
  const deployer = await ethers.getNamedSigner("deployer");

  const deployResult = await deployments.deploy("CloneFactory", {
    args: [],
    from: deployer.address,
    log: true
  });

  if (deployResult.newlyDeployed) {
    const cloneFactory = new ethers.Contract(
      deployResult.address,
      deployResult.abi,
      deployer
    ) as CloneFactory;
    const contractProbeAddress = (await ethers.getContract("ContractProbe")).address;

    await cloneFactory.connect(deployer).setContractProbe(contractProbeAddress);
  }
};

deployCloneFactoryFunction.tags = ["CloneFactory"];
deployCloneFactoryFunction.dependencies = ["ContractProbe"];
deployCloneFactoryFunction.skip = async ({ getChainId }) => {
  return Number(await getChainId()) != 31337;
};

export default deployCloneFactoryFunction;
