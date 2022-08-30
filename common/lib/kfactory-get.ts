import type { Provider } from "@ethersproject/abstract-provider";
import type { Signer } from "@ethersproject/abstract-signer";

import { Contract } from "ethers";

import type { Address } from "@lib/ktypes";
import { getNetwork, explorerContractUrl } from "@lib/kconfig";

import type { OpenNFTsFactoryV3 } from "@soltypes/contracts/next/OpenNFTsFactoryV3";
import abiOpenNFTsFactoryV3 from "@abis/contracts/next/OpenNFTsFactoryV3.sol/OpenNFTsFactoryV3.json";

// Cache nftsFactory(chainId)
const nftsFactoriesCache: Map<number, Contract> = new Map();

//  GET NFTsFactory address
const factoryGetAddress = (chainId: number): string => getNetwork(chainId)?.nftsFactoryV3 || "";

// GET NFTsFactory explorer URL
const factoryGetExplorerUrl = (chainId: number): string => explorerContractUrl(chainId, factoryGetAddress(chainId));

// GET NFTsFactory Contract
const factoryGetContract = (chainId: number, provider: Provider | Signer): OpenNFTsFactoryV3 => {
  let nftsFactory = nftsFactoriesCache.get(chainId);
  if (!nftsFactory) {
    nftsFactory = new Contract(factoryGetAddress(chainId), abiOpenNFTsFactoryV3, provider);
    nftsFactoriesCache.set(chainId, nftsFactory);
  }

  // console.log("factoryGetContract", chainId, nftsFactory);
  return nftsFactory as OpenNFTsFactoryV3;
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
