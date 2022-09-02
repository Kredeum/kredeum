import type { NFTsFactoryV2 } from "@soltypes/contracts";
import type { NetworkType } from "@lib/common/ktypes";

import config from "@config/config.json";
import INFTsFactory2 from "@abis/contracts/interfaces/INFTsFactoryV2.sol/INFTsFactoryV2.json";
import ICloneFactory2 from "@abis/contracts/interfaces/ICloneFactoryV2.sol/ICloneFactoryV2.json";

import { ethers, getChainId } from "hardhat";
import Prompt from "prompt-sync";
const prompt = Prompt();

const random = "0x41ea3c9e0f803905983bda6f484d438f9a066106";

const addresses = async (nftsFactoryV2orV3: NFTsFactoryV2): Promise<string[]> => {
  const addresses: string[] = [];
  const balances = await nftsFactoryV2orV3.balancesOf(random);
  balances.forEach((balance) => addresses.push(balance[0]));
  return addresses;
};

const main = async () => {
  const { provider, getNamedSigners } = ethers;

  const chainId = Number(await getChainId());
  const { deployer } = await getNamedSigners();

  const nftsFactoryV2: NFTsFactoryV2 = new ethers.Contract(
    config.nftsFactoryV2 || "",
    INFTsFactory2.concat(ICloneFactory2),
    provider
  ) as NFTsFactoryV2;

  console.log("chainId      ", chainId);
  console.log("deployer     ", deployer.address);
  console.log("nftsFactoryV2", nftsFactoryV2.address);

  const implV2 = await addresses(nftsFactoryV2);
  console.log(implV2.length, "implementations NFTsFactoryV2");

  console.time("add");
  await (await nftsFactoryV2.connect(deployer).implementationsAdd(implV2.slice(0, 100))).wait();
  console.timeEnd("add");

  const implV2new = await addresses(nftsFactoryV2);
  console.log(implV2new.length, "implementations NFTsFactoryV2");

  console.time("bal");
  console.log((await nftsFactoryV2.balancesOf(random)).length);
  console.timeEnd("bal");
};

main().catch(console.error);
