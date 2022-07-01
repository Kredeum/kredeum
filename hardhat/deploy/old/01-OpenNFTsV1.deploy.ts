import type { DeployFunction } from "hardhat-deploy/types";

const contractName = "OpenNFTsV1";

const deployFunction: DeployFunction = async function ({ deployments, ethers }) {
  const { getNamedSigner } = ethers;
  const deployer = await getNamedSigner("deployer");

  const deployOptions = {
    from: deployer.address,
    args: [],
    log: true
  };

  await deployments.deploy(contractName, deployOptions);
};

deployFunction.dependencies = ["NFTsFactoryV2"];
deployFunction.tags = [contractName];
deployFunction.id = contractName;
export default deployFunction;
