import type { DeployFunction, DeployResult } from "hardhat-deploy/types";
import { writeFile } from "fs/promises";
import type { OpenNFTsFactoryV3 } from "@soltypes/src/OpenNFTsFactoryV3";
import type { OpenBound } from "@soltypes/src/next/OpenBound";
import networks from "@config/networks.handlebars.json";

const contractName = "OpenBound";

const deployFunction: DeployFunction = async function ({ deployments, network, ethers }) {
  const { getNamedSigner, getContract } = ethers;
  const deployer = await getNamedSigner("deployer");

  const deployResult: DeployResult = await deployments.deploy(contractName, {
    from: deployer.address,
    args: [],
    log: true
  });

  if (deployResult.newlyDeployed) {
    const index = networks.findIndex((nw) => nw.chainName === network.name);
    const networkConf = networks[index];
    if (deployResult.address != networkConf.openBound) {
      console.info(contractName, "deployed => new address");
      networks[index].openBound = deployResult.address;
      await writeFile(
        `${__dirname}/../../../common/config/networks.handlebars.json`,
        JSON.stringify(networks, null, 2)
      ).catch((err) => console.log(err));
    }

    // const openBound: OpenBound = await getContract(contractName, deployer);
    // await (await openBound.initialize(contractName, "BOUND", deployer.address, maxSupply)).wait();

    const nftsFactoryV3: OpenNFTsFactoryV3 = await getContract("OpenNFTsFactoryV3", deployer);
    await (await nftsFactoryV3.setTemplate(contractName, deployResult.address)).wait();
  }
};

deployFunction.dependencies = ["OpenNFTsResolver", "OpenNFTsFactoryV3"];
deployFunction.tags = [contractName];
deployFunction.id = contractName;

export default deployFunction;
