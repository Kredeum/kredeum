import type { Provider } from "@ethersproject/abstract-provider";
import type { Address } from "./ktypes";
import type { NFTsFactoryV2 } from "types/NFTsFactoryV2";

import { Signer, Contract } from "ethers";
import { getNetwork } from "./kconfig";

import ICloneFactoryV2 from "abis/ICloneFactoryV2.json";
import INFTsFactoryV2 from "abis/INFTsFactoryV2.json";

// Cache nftsFactory(chainId)
const nftsFactories: Map<number, Contract> = new Map();

const _factoryGetAbi = (): string[] => ICloneFactoryV2.concat(INFTsFactoryV2);

const factoryGetAddress = (chainId: number): string => getNetwork(chainId)?.nftsFactoryV2 || "";

// GET OpenNFTs default template via onchain call
const factoryGetTemplateAddress = async (chainId: number, template: string, provider: Provider): Promise<Address> => {
  // console.log("factoryGetTemplateAddress", chainId, template);

  const nftsFactory = factoryGetContract(chainId, provider);
  const templateAddress = await nftsFactory.templates(template);

  // console.log("factoryGetTemplateAddress", chainId, template, templateAddress);
  return templateAddress;
};

// GET NFTsFactory Contract
const factoryGetContract = (chainId: number, signerOrProvider: Signer | Provider): NFTsFactoryV2 => {
  // console.log("factoryGetContract", chainId);

  let nftsFactory = nftsFactories.get(chainId) as NFTsFactoryV2;
  if (!nftsFactory) {
    nftsFactory = new Contract(factoryGetAddress(chainId), _factoryGetAbi(), signerOrProvider) as NFTsFactoryV2;
    nftsFactories.set(chainId, nftsFactory);
  }

  // console.log("nftsFactory", nftsFactory);
  return nftsFactory;
};

// GET OpenNFTs default template via onchain call
const factoryGetDefaultImplementation = async (chainId: number, provider: Provider): Promise<Address> => {
  const nftsFactory = factoryGetContract(chainId, provider);
  const defaultImplementation = await nftsFactory.implementations(0);

  return defaultImplementation;
};

export { factoryGetContract, factoryGetAddress, factoryGetTemplateAddress, factoryGetDefaultImplementation };
