import type { Provider } from "@ethersproject/abstract-provider";

import type { NFTsFactoryV2 } from "soltypes/contracts";

import type { Address } from "lib/ktypes";
import { getNetwork, explorerContractUrl } from "lib/kconfig";

import { Contract } from "ethers";

import abiNFTsFactoryV2 from "abis/contracts/NFTsFactoryV2.sol/NFTsFactoryV2.json";

// Cache nftsFactory(chainId)
const nftsFactoriesCache: Map<number, Contract> = new Map();

//  GET nftsFactory address
const factoryGetAddress = (chainId: number): string => getNetwork(chainId)?.nftsFactoryV2 || "";

// GET nftsFactory explorer URL
const factoryGetExplorerUrl = (chainId: number): string =>
  // https://blockscout.com/xdai/mainnet/address/0x86246ba8F7b25B1650BaF926E42B66Ec18D96000/read-contract
  // https://etherscan.io/address/0x4b7992F03906F7bBE3d48E5Fb724f52c56cFb039#readContract
  explorerContractUrl(chainId, factoryGetAddress(chainId));

// GET NFTsFactory Contract
const factoryGetContract = (chainId: number, provider: Provider): NFTsFactoryV2 => {
  // console.log("factoryGetContract", chainId);

  let nftsFactory = nftsFactoriesCache.get(chainId);
  if (!nftsFactory) {
    nftsFactory = new Contract(factoryGetAddress(chainId), abiNFTsFactoryV2, provider);
    nftsFactoriesCache.set(chainId, nftsFactory);
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

export { factoryGetAddress, factoryGetContract, factoryGetExplorerUrl, factoryGetTemplateAddress };
