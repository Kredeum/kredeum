import type { Provider } from "@ethersproject/abstract-provider";
import type { Address, AbiType } from "./ktypes";
import type { NFTsFactory } from "types/NFTsFactory";
import type { NFTsFactoryV2 } from "types/NFTsFactoryV2";

import { Signer, Contract } from "ethers";
import { getNetwork, config } from "./kconfig";

// ! MUST manage simultaneously NFTsFactory V1 and V2
// ! until all networks are on NFTsFactory V2
import ICloneFactory from "abis/deployed/ICloneFactory.json";
import INFTsFactory from "abis/deployed/INFTsFactory.json";
import ICloneFactoryV2 from "abis/new/ICloneFactoryV2.json";
import INFTsFactoryV2 from "abis/new/INFTsFactoryV2.json";

// Cache nftsFactory(chainId)
const nftsFactories: Map<number, Contract> = new Map();

const _factoryGetAbi = (chainId: number): string[] => {
  const version = factoryGetVersion(chainId);
  let abi: string[] = [];
  if (version == 2) {
    abi = ICloneFactoryV2.concat(INFTsFactoryV2);
  } else if (version == 1) {
    abi = ICloneFactory.concat(INFTsFactory);
  }
  return abi;
};

const factoryGetVersion = (chainId: number): number =>
  getNetwork(chainId)?.nftsFactoryV2 ? 2 : getNetwork(chainId)?.nftsFactory ? 1 : 0;

const factoryGetAddress = (chainId: number): string =>
  getNetwork(chainId)?.nftsFactoryV2 || getNetwork(chainId)?.nftsFactory || "";

// GET OpenNFTs default template via onchain call
const factoryGetTemplateAddress = async (chainId: number, template: string, provider: Provider): Promise<Address> => {
  // console.log("factoryGetTemplateAddress", chainId, template);

  let templateAddress = "";
  const version = factoryGetVersion(chainId);

  if (version == 2) {
    const nftsFactory = factoryGetContract(chainId, provider) as NFTsFactoryV2;
    templateAddress = await nftsFactory.templates(template);
  } else if (version == 1) {
    const nftsFactory = factoryGetContract(chainId, provider) as NFTsFactory;
    templateAddress = await nftsFactory.template();
  }

  // console.log("factoryGetTemplateAddress", chainId, template, templateAddress);
  return templateAddress;
};

// GET NFTsFactory Contract
const factoryGetContract = (chainId: number, signerOrProvider: Signer | Provider): NFTsFactory | NFTsFactoryV2 => {
  // console.log("factoryGetContract", chainId);

  let nftsFactory = nftsFactories.get(chainId) as NFTsFactory | NFTsFactoryV2;
  if (!nftsFactory) {
    nftsFactory = new Contract(factoryGetAddress(chainId), _factoryGetAbi(chainId), signerOrProvider) as
      | NFTsFactory
      | NFTsFactoryV2;
    nftsFactories.set(chainId, nftsFactory);
  }

  // console.log("nftsFactory", nftsFactory);
  return nftsFactory;
};

// GET OpenNFTs default template via onchain call
const factoryGetDefaultImplementation = async (chainId: number, provider: Provider): Promise<Address> => {
  const nftsFactory = factoryGetContract(chainId, provider);
  const defaultImplementation = (await nftsFactory.implementations(0)) as Address;

  return defaultImplementation;
};

export {
  factoryGetVersion,
  factoryGetContract,
  factoryGetAddress,
  factoryGetTemplateAddress,
  factoryGetDefaultImplementation
};
