import type { NFTsFactoryV2 } from "@soltypes/contracts";
import type { NetworkType } from "@lib/ktypes";

import INFTsFactoryV2 from "@abis/contracts/interfaces/INFTsFactoryV2.sol/INFTsFactoryV2.json";
import ICloneFactoryV2 from "@abis/contracts/interfaces/ICloneFactoryV2.sol/ICloneFactoryV2.json";

import IERC173 from "@abis/contracts/interfaces/IERC173.sol/IERC173.json";
import hre from "hardhat";

import networks from "@config/networks.json";

const getLogs3500 = async (startBlock: number): Promise<void> => {
  const endBlock = startBlock + nBlocks - 1;
  const logs = await provider.getLogs({
    fromBlock: startBlock,
    toBlock: endBlock,
    address: smartcontract,
    topics: [hre.ethers.utils.id("NewImplementation(address,address,address)")]
  });
  if (logs.length) console.log("main ~ logs", startBlock, endBlock, logs.length);
};

const getLogs1050000 = async (startBlock: number): Promise<void> => {
  console.log("getLogs1050000 ~ startBlock", startBlock);
  const promises: any = [];
  let i = 0;
  do {
    promises[i] = getLogs3500(startBlock);
    startBlock += nBlocks;
    i++;
  } while (i < nAwait);
  // nAwait promises max simultaneously...
  await Promise.all(promises);
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const main = async () => {
  const owner = await nftsFactory.owner();
  console.log("main ~ owner", owner);

  const implementationsCount = await nftsFactory.implementationsCount();
  console.log(`main ~ implementationsCount ${implementationsCount}`);

  let startBlock = creationBlock;
  const currentBlock = await provider.getBlockNumber();
  console.log("main ~ currentBlock", currentBlock);
  await getLogs1050000(startBlock);
  startBlock += nAwait * nBlocks;
  await getLogs1050000(startBlock);
  startBlock += nAwait * nBlocks;
  await getLogs1050000(startBlock);
  startBlock += nAwait * nBlocks;
  await getLogs1050000(startBlock);
};
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const chainName = "matic";
const creationTx = "0x548097dcc47cb6ac94d6943ef230af5ea7a3f2287b3bf669fdccc79230fd29e4"; // NFTsFactoryV2 V1 creation
const creationBlock = 22_174_115; // NFTsFactoryV2 V1 creation
const deployer = "0x6eebAe27d69fa80f0E4C0E973A2Fed218A56880c";
const smartcontract = "0x3157Ac677F6F273b75E99A2216CD078E22E9be02";
const nBlocks = 3500;
const nAwait = 300;

hre.changeNetwork(chainName);
const provider = hre.ethers.provider;

const network = networks.find((nw) => nw.chainName === chainName) as NetworkType;
const nftsFactory: NFTsFactoryV2 = new hre.ethers.Contract(
  network.nftsFactory || "",
  INFTsFactoryV2.concat(ICloneFactoryV2).concat(IERC173),
  provider
) as NFTsFactoryV2;
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
main().catch(console.error);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
