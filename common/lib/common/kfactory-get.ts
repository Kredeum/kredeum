import type { Provider } from "@ethersproject/abstract-provider";
import { Signer } from "@ethersproject/abstract-signer";

import { Contract } from "ethers";

import { getNetwork, explorerContractUrl } from "@lib/common/kconfig";

import type { OpenNFTsFactoryV3 } from "@soltypes/contracts/OpenNFTsFactoryV3";
import abiOpenNFTsFactoryV3 from "@abis/contracts/OpenNFTsFactoryV3.sol/OpenNFTsFactoryV3.json";

const _nftsFactoryKey = (chainId: number, account: string): string => String(chainId).concat(account);

// Cache nftsFactory(chainId)
const nftsFactoriesCache: Map<string, Contract> = new Map();

//  GET NFTsFactory address
const factoryGetAddress = (chainId: number): string => getNetwork(chainId)?.nftsFactoryV3 || "";

// GET NFTsFactory explorer URL
const factoryGetExplorerUrl = (chainId: number): string => explorerContractUrl(chainId, factoryGetAddress(chainId));

// GET NFTsFactory Contract
const factoryGetContract = async (chainId: number, signerOrProvider: Signer | Provider): Promise<OpenNFTsFactoryV3> => {
  const signerAddress = Signer.isSigner(signerOrProvider) ? await signerOrProvider.getAddress() : "";
  // console.log("factoryGetContract ~ signerAddress", signerAddress);

  let nftsFactory = nftsFactoriesCache.get(_nftsFactoryKey(chainId, signerAddress));

  if (!nftsFactory) {
    nftsFactory = new Contract(factoryGetAddress(chainId), abiOpenNFTsFactoryV3, signerOrProvider);
    nftsFactoriesCache.set(_nftsFactoryKey(chainId, signerAddress), nftsFactory);
  }

  // console.log("factoryGetContract", chainId, nftsFactory);
  return nftsFactory as OpenNFTsFactoryV3;
};

// GET OpenNFTs default template via onchain call
const factoryGetTemplateAddress = async (
  chainId: number,
  template: string,
  signerOrProvider: Signer | Provider
): Promise<string> => {
  // console.log("factoryGetTemplateAddress", chainId, template);

  const nftsFactory = await factoryGetContract(chainId, signerOrProvider);
  const templateAddress = await nftsFactory.templates(template);

  // console.log("factoryGetTemplateAddress", chainId, template, templateAddress);
  return templateAddress;
};

export { factoryGetAddress, factoryGetContract, factoryGetExplorerUrl, factoryGetTemplateAddress };
