import type { NFTsFactory } from "types/NFTsFactory";
import type { NFTsFactoryV2 } from "types/NFTsFactoryV2";
import type { Network } from "lib/ktypes";

import networks from "config/networks.json";
import config from "config/config.json";
import INFTsFactory from "abis/deployed/INFTsFactory.json";
import ICloneFactory from "abis/deployed/ICloneFactory.json";
import INFTsFactory2 from "abis/new/INFTsFactoryV2.json";
import ICloneFactory2 from "abis/new/ICloneFactoryV2.json";

import { ethers, getChainId } from "hardhat";
import Prompt from "prompt-sync";
const prompt = Prompt();

const random = "0x41ea3c9e0f803905983bda6f484d438f9a066106";

const addresses = async (network: Network, nftsFactoryV2orV3: NFTsFactory | NFTsFactoryV2): Promise<string[]> => {
  const addresses: string[] = [];
  const balances = await nftsFactoryV2orV3.balancesOf(random);
  balances.forEach((balance) => addresses.push(balance[0]));
  return addresses;
};

const main = async () => {
  const { provider, getNamedSigners } = ethers;

  const chainId = Number(await getChainId());
  const { deployer } = await getNamedSigners();

  const network = networks.find((nw) => nw.chainId === chainId) as Network;
  const nftsFactory: NFTsFactory = new ethers.Contract(
    network.nftsFactory || "",
    INFTsFactory.concat(ICloneFactory),
    provider
  ) as NFTsFactory;

  const nftsFactoryV2: NFTsFactoryV2 = new ethers.Contract(
    config.nftsFactoryV2 || "",
    INFTsFactory2.concat(ICloneFactory2),
    provider
  ) as NFTsFactoryV2;

  console.log("chainId      ", chainId);
  console.log("deployer     ", deployer.address);
  console.log("nftsFactory  ", nftsFactory.address);
  console.log("nftsFactoryV2", nftsFactoryV2.address);

  const impl = await addresses(network, nftsFactory);
  console.log(impl.length, "implementations NFTsFactory", impl);

  const implV2 = await addresses(network, nftsFactoryV2);
  console.log(implV2.length, "implementations NFTsFactoryV2", implV2);

  const toMigrate = impl.filter((addr) => implV2.indexOf(addr) == -1);
  const n = toMigrate.length;

  if (n > 0) {
    console.log(n, "implementations to migrate to V2", toMigrate);

    const go: string = prompt("Proceed with Migration y/N ? ");
    if (go[0].toLowerCase() == "y") {
      console.log("START Migration...");
      await (await nftsFactoryV2.connect(deployer).implementationsAdd(toMigrate)).wait();
      console.log("END   Migration !");

      const implV2new = await addresses(network, nftsFactoryV2);
      console.log(implV2new.length, "implementations NFTsFactoryV2", implV2new);
    }
  } else {
    console.log("Nothing to migrate to V2");
  }
};

main().catch(console.error);
