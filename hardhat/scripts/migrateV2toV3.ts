import { ethers, deployments, getChainId } from "hardhat";
import type { NFTsFactory } from "types/NFTsFactory";
import type { NFTsFactoryV2 } from "types/NFTsFactoryV2";
import type { Network } from "lib/ktypes";

import networks from "config/networks.json";
import config from "config/config.json";
import INFTsFactory from "abis/deployed/INFTsFactory.json";
import ICloneFactory from "abis/deployed/ICloneFactory.json";
import INFTsFactory2 from "abis/new/INFTsFactoryV2.json";
import ICloneFactory2 from "abis/new/ICloneFactoryV2.json";

const { provider, getNamedSigners } = ethers;

const random = "0x41ea3c9e0f803905983bda6f484d438f9a066106";

const addresses = async (network: Network, nftsFactoryV2orV3: NFTsFactory | NFTsFactoryV2): Promise<string[]> => {
  const addresses: string[] = [];
  const balances = await nftsFactoryV2orV3.balancesOf(random);
  balances.forEach((balance) => addresses.push(balance[0]));
  return addresses;
};

const main = async (): Promise<number> => {
  const chainId = Number(await getChainId());
  const { deployer } = await getNamedSigners();
  console.log("chainId, deployer", chainId, deployer.address);

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

  const adsV2 = await addresses(network, nftsFactory);
  console.log("adsV2", adsV2);

  const adsV3 = await addresses(network, nftsFactoryV2);
  console.log("adsV3", adsV3);

  const adsV2notV3 = adsV2.filter((addr) => adsV3.indexOf(addr) == -1);
  console.log("adsV2notV3", adsV2notV3);

  const n = adsV2notV3.length;
  if (n > 0) {
    await nftsFactoryV2.connect(deployer).implementationsAdd(adsV2notV3);
  }
  return n;
};

main().then(console.log).catch(console.error);
