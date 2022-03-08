import { ethers, deployments, getNamedAccounts } from "hardhat";

const deployDeterministicAddress = async (contractName: string): Promise<string> => {
  const { deployer } = await getNamedAccounts();
  const deployOptions = {
    from: deployer,
    args: [deployer],
    salt: ethers.utils.hashMessage("NFTsFactoryV2")
  };
  const deployDeterministic = await deployments.deterministic("NFTsFactoryV2", deployOptions);

  return deployDeterministic.address;
};

deployDeterministicAddress("NFTsFactoryV2").then(console.log).catch(console.error);
