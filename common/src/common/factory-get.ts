import { ADDRESS_ZERO, explorerContractUrl, getAddresses } from "../common/config";

import type { OpenNFTsFactoryV3 } from "@kredeum/contracts/types/OpenNFTsFactoryV3";
import { getAbi } from "../common/artifacts";
import { type Address } from "viem";
import { Contract } from "./types";

// Cache nftsFactory(chainId)
const nftsFactoriesCache: Map<string, Contract> = new Map();

//  GET NFTsFactory address
const factoryGetAddress = (chainId: number): Address => getAddresses(chainId)?.OpenNFTsFactoryV3 || ADDRESS_ZERO;

// GET NFTsFactory explorer URL
const factoryGetExplorerUrl = (chainId: number): string => explorerContractUrl(chainId, factoryGetAddress(chainId));

// GET NFTsFactory Contract
const factoryGetContract = async (chainId: number, getSigner = false): Promise<OpenNFTsFactoryV3> => {
  // console.log("factoryGetContract ~ signerAddress", signerAddress);

  const nftsFactory: OpenNFTsFactoryV3 = undefined as unknown as OpenNFTsFactoryV3;
  // let nftsFactory = nftsFactoriesCache.get(String(chainId));

  // if (!nftsFactory) {
  //   const signerOrProvider = await providerGetSignerOrProvider(chainId, getSigner);

  //   nftsFactory = new Contract(
  //     factoryGetAddress(chainId),
  //     getAbi("OpenNFTsFactoryV3") as ContractInterface,
  //     signerOrProvider
  //   );
  // nftsFactoriesCache.set(String(chainId), nftsFactory);
  // }

  // console.log("factoryGetContract", chainId, nftsFactory);
  return nftsFactory;
};

// GET OpenNFTs default template via onchain call
const factoryGetTemplateAddress = async (chainId: number, template: string): Promise<string> => {
  // console.log("factoryGetTemplateAddress", chainId, template);

  const nftsFactory = await factoryGetContract(chainId);
  const templateAddress = await nftsFactory.templates(template);

  // console.log("factoryGetTemplateAddress", chainId, template, templateAddress);
  return templateAddress;
};

export { factoryGetAddress, factoryGetContract, factoryGetExplorerUrl, factoryGetTemplateAddress };
