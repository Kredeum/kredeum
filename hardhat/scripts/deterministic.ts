import { ethers, deployments, getNamedAccounts, network, getChainId } from "hardhat";
// import { getSingletonFactoryInfo } from "@gnosis.pm/safe-singleton-factory";

const deployDeterministicAddress = async (contractName: string): Promise<string> => {
  const { deployer } = await getNamedAccounts();
  const deployOptions = {
    from: deployer,
    args: [deployer],
    salt: ethers.utils.hashMessage("NFTsFactoryV2")
  };
  const deployDeterministic = await deployments.deterministic("NFTsFactoryV2", deployOptions);

  // const chainId = await getChainId();
  // const info = getSingletonFactoryInfo(parseInt(chainId));
  // console.log("deploy with singleton ~ info", chainId, info);

  return deployDeterministic.address;
};

deployDeterministicAddress("NFTsFactoryV2").then(console.log).catch(console.error);
