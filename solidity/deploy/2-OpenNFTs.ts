import type { DeployFunction } from "hardhat-deploy/types";
import { getNetwork } from "../../lib/kconfig";

const deployOpenNFTsFunction: DeployFunction = async function ({
  deployments,
  ethers,
  getChainId
}) {
  const network = getNetwork(await getChainId());
  if (network) {
    const deployer = await ethers.getNamedSigner("deployer");

    const deployment = await deployments.deploy("OpenNFTs", {
      args: [],
      from: deployer.address,
      log: true
    });
  } else {
    console.error("unkwown network");
  }
};
deployOpenNFTsFunction.tags = ["OpenNFTs"];

export default deployOpenNFTsFunction;
