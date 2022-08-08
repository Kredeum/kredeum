import type { DeployFunction, DeployResult } from "hardhat-deploy/types";
import type { IOpenNFTsV4, ICloneFactoryV2 } from "soltypes/contracts/interfaces";
import type { IOpenRegistry } from "soltypes/OpenNFTs/contracts/interfaces";

// import { checkGasDeploy, checkGasMethod } from "scripts/checkGas";
import type { NetworkType } from "lib/ktypes";
import networks from "config/networks.json";
import { writeFile } from "fs/promises";

const contractName = "OpenNFTsV4";

const deployFunction: DeployFunction = async function ({ deployments, network, ethers }) {
  const { getNamedSigner, getContract } = ethers;
  const deployer = await getNamedSigner("deployer");

  const deployOptions = {
    from: deployer.address,
    args: [],
    log: true
  };

  // const deployResult = await checkGasDeploy(hre, contractName, deployOptions);
  const deployResult: DeployResult = await deployments.deploy(contractName, deployOptions);

  if (deployResult.newlyDeployed) {
    // const contract = await getContract(contractName);
    // await checkGasMethod(hre, contractName, "initialize", deployer,
    const index = networks.findIndex((nw) => nw.chainName === network.name);
    const networkConf: NetworkType = networks[index];
    if (deployResult.address != networkConf.openNFTs) {
      console.info(contractName, "deployed => new address");
      networks[index].openNFTs = deployResult.address;
      await  writeFile(`${__dirname}/../../../common/config/networks.json`, JSON.stringify(networks, null, 2))
        .catch((err) => console.log(err));
    }

    const openNFTsV4 = await getContract(contractName, deployer);
    await (await (openNFTsV4 as IOpenNFTsV4).initialize("Open NFTs V4", "NFT", deployer.address, [true])).wait();

    const nftsFactoryV2 = await getContract("NFTsFactoryV2", deployer);
    await (await (nftsFactoryV2 as ICloneFactoryV2).implementationsAdd([deployResult.address])).wait();
    await (await (nftsFactoryV2 as ICloneFactoryV2).templateSet("OpenNFTsV4", deployResult.address)).wait();

    const nftsResolver = await getContract("NFTsResolver", deployer);
    await (await (nftsResolver as IOpenRegistry).addAddress(deployResult.address)).wait();
  }
};

deployFunction.dependencies = ["NFTsFactoryV2","NFTsResolver"];
deployFunction.tags = [contractName];
deployFunction.id = contractName;
export default deployFunction;
