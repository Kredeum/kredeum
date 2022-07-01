import type { DeployFunction, DeployResult } from "hardhat-deploy/types";
import type { NFTsFactoryV2 } from "types/NFTsFactoryV2";

const contractName = "OpenNFTsV0";

const deployFunction: DeployFunction = async function ({ deployments, ethers }) {
  const { getNamedSigner, getContract } = ethers;
  const deployer = await getNamedSigner("deployer");

  const deployOptions = {
    from: deployer.address,
    args: [],
    log: true
  };

  const deployResult: DeployResult = await deployments.deploy(contractName, deployOptions);

  if (deployResult.newlyDeployed) {
    const nftsFactoryV2 = (await getContract("NFTsFactoryV2", deployer)) as unknown as NFTsFactoryV2;
    await nftsFactoryV2.implementationsAdd([deployResult.address]);
  }
};

deployFunction.dependencies = ["NFTsFactoryV2"];
deployFunction.tags = [contractName];
deployFunction.id = contractName;
export default deployFunction;
