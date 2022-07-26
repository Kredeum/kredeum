import type { Provider } from "@ethersproject/abstract-provider";

import type { NFTsFactoryV2 } from "soltypes/contracts";

import type { Address } from "lib/ktypes";
import { getNftsFactory as factoryGetAddress } from "lib/kconfig";

import { Contract } from "ethers";

import abiCloneFactoryV2 from "abis/ICloneFactoryV2.sol/ICloneFactoryV2.json";
import abiNFTsFactoryV2 from "abis/INFTsFactoryV2.sol/INFTsFactoryV2.json";

// Cache nftsFactory(chainId)
const nftsFactories: Map<number, Contract> = new Map();

const _factoryGetAbi = (): string[] => abiCloneFactoryV2.concat(abiNFTsFactoryV2);

// GET NFTsFactory Contract
const factoryGetContract = (chainId: number, provider: Provider): NFTsFactoryV2 => {
  // console.log("factoryGetContract", chainId);

  let nftsFactory = nftsFactories.get(chainId);
  if (!nftsFactory) {
    nftsFactory = new Contract(factoryGetAddress(chainId), _factoryGetAbi(), provider);
    nftsFactories.set(chainId, nftsFactory);
  }

  // console.log("nftsFactory", nftsFactory);
  return nftsFactory as NFTsFactoryV2;
};

// GET OpenNFTs default template via onchain call
const factoryGetTemplateAddress = async (chainId: number, template: string, provider: Provider): Promise<Address> => {
  // console.log("factoryGetTemplateAddress", chainId, template);

  const nftsFactory = factoryGetContract(chainId, provider);
  const templateAddress = await nftsFactory.templates(template);

  // console.log("factoryGetTemplateAddress", chainId, template, templateAddress);
  return templateAddress;
};

export { factoryGetContract, factoryGetAddress, factoryGetTemplateAddress };
