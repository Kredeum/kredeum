import type { Provider } from "@ethersproject/abstract-provider";
import type { Signer } from "@ethersproject/abstract-signer";

import { Contract } from "ethers";

import type { Address } from "@lib/ktypes";
import { getNetwork, explorerContractUrl } from "@lib/kconfig";

import type { NFTsFactoryV3 } from "@soltypes/contracts/next/NFTsFactoryV3";
import abiNFTsFactoryV3 from "@abis/contracts/next/NFTsFactoryV3.sol/NFTsFactoryV3.json";

// Cache nftsFactory(chainId)
const nftsFactoriesCache: Map<number, Contract> = new Map();

//  GET nftsFactory address
const factoryGetAddress = (chainId: number): string => getNetwork(chainId)?.nftsFactoryV3 || "";

// GET nftsFactory explorer URL
const factoryGetExplorerUrl = (chainId: number): string => explorerContractUrl(chainId, factoryGetAddress(chainId));

// GET NFTsFactory Contract
const factoryGetContract = (chainId: number, provider: Provider | Signer): NFTsFactoryV3 => {
  let nftsFactory = nftsFactoriesCache.get(chainId);
  if (!nftsFactory) {
    nftsFactory = new Contract(factoryGetAddress(chainId), abiNFTsFactoryV3, provider);
    nftsFactoriesCache.set(chainId, nftsFactory);
  }

  // console.log("factoryGetContract", chainId, nftsFactory);
  return nftsFactory as NFTsFactoryV3;
};

// GET OpenNFTs default template via onchain call
const factoryGetTemplateAddress = async (chainId: number, template: string, provider: Provider): Promise<Address> => {
  // console.log("factoryGetTemplateAddress", chainId, template);

  const nftsFactory = factoryGetContract(chainId, provider);
  const templateAddress = await nftsFactory.templates(template);

  // console.log("factoryGetTemplateAddress", chainId, template, templateAddress);
  return templateAddress;
};

export { factoryGetAddress, factoryGetContract, factoryGetExplorerUrl, factoryGetTemplateAddress };
