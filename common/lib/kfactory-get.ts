import type { NFTsFactoryV2 } from "../types/NFTsFactoryV2";

import type { Provider } from "@ethersproject/abstract-provider";
import type { Address, AbiType } from "./ktypes";

import { Signer, Contract } from "ethers";
import { getChecksumAddress, getNetwork } from "./kconfig";

// ! MUST manage simultaneously NFTsFactory V1 and V2
// ! until all networks are on NFTsFactory V2
import ICloneFactory from "abis/deployed/ICloneFactory.json";
import INFTsFactory from "abis/deployed/INFTsFactory.json";
import ICloneFactoryV2 from "abis/new/ICloneFactoryV2.json";
import INFTsFactoryV2 from "abis/new/INFTsFactoryV2.json";

// nftsFactory cache over networks
const nftsFactories: Map<number, Contract> = new Map();

const factoryGetVersion = (chainId: number): number => {
  const network = getNetwork(chainId);
  return network?.nftsFactoryV2 ? 2 : network?.nftsFactory ? 1 : 0;
};

const factoryGetAddress = (chainId: number): string => {
  const network = getNetwork(chainId);
  return getChecksumAddress(network?.nftsFactoryV2 || network?.nftsFactory || "");
};

const factoryGetAbi = (chainId: number): Array<string> => {
  const network = getNetwork(chainId);
  const factoryAbi = network?.nftsFactoryV2
    ? ICloneFactoryV2.concat(INFTsFactoryV2)
    : network?.nftsFactory
    ? ICloneFactory.concat(INFTsFactory)
    : [];
  return factoryAbi;
};

// GET NFTsFactory Contract
const factoryGetContract = (chainId: number, signerOrProvider: Signer | Provider): Contract => {
  // console.log("factoryGetContract", chainId);

  let nftsFactory = nftsFactories.get(chainId);
  if (!nftsFactory) {
    nftsFactory = new Contract(factoryGetAddress(chainId), factoryGetAbi(chainId), signerOrProvider);
    nftsFactories.set(chainId, nftsFactory);
  }
  return nftsFactory;
};

// GET OpenNFTs default template via onchain call
const factoryGetTemplate = async (chainId: number, template: string, provider: Provider): Promise<Address> => {
  const nftsFactory = factoryGetContract(chainId, provider);

  let templateAddress = "";
  // Only V2 has version
  if (nftsFactory.version) {
    templateAddress = await nftsFactory.templates("generic");
  } else {
    templateAddress = await nftsFactory.template();
  }

  // console.log("factoryGetTemplate ~ templateAddress", templateAddress);
  return templateAddress;
};

export { factoryGetContract, factoryGetAddress, factoryGetTemplate };
