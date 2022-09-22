import type { Provider } from "@ethersproject/abstract-provider";
import { Signer } from "@ethersproject/abstract-signer";

import { Contract } from "ethers";

import type { Address } from "@lib/common/ktypes";
import { getNetwork, explorerContractUrl } from "@lib/common/kconfig";

import type { OpenFactoryV3 } from "@soltypes/contracts/next/OpenFactoryV3";
import abiOpenFactoryV3 from "@abis/contracts/next/OpenFactoryV3.sol/OpenFactoryV3.json";

const _nftsFactoryKey = (chainId: number, account: string): string => String(chainId).concat(account);

// Cache nftsFactory(chainId)
const nftsFactoriesCache: Map<string, Contract> = new Map();

//  GET NFTsFactory address
const factoryGetAddress = (chainId: number): string => getNetwork(chainId)?.nftsFactoryV3 || "";

// GET NFTsFactory explorer URL
const factoryGetExplorerUrl = (chainId: number): string => explorerContractUrl(chainId, factoryGetAddress(chainId));

// GET NFTsFactory Contract
const factoryGetContract = async (chainId: number, signerOrProvider: Signer | Provider): Promise<OpenFactoryV3> => {
  const signerAddress = Signer.isSigner(signerOrProvider) ? await signerOrProvider.getAddress() : "";
  // console.log("factoryGetContract ~ signerAddress", signerAddress);

  let nftsFactory = nftsFactoriesCache.get(_nftsFactoryKey(chainId, signerAddress));

  if (!nftsFactory) {
    nftsFactory = new Contract(factoryGetAddress(chainId), abiOpenFactoryV3, signerOrProvider);
    nftsFactoriesCache.set(_nftsFactoryKey(chainId, signerAddress), nftsFactory);
  }

  // console.log("factoryGetContract", chainId, nftsFactory);
  return nftsFactory as OpenFactoryV3;
};

// GET OpenNFTs default template via onchain call
const factoryGetTemplateAddress = async (
  chainId: number,
  template: string,
  signerOrProvider: Signer | Provider
): Promise<Address> => {
  // console.log("factoryGetTemplateAddress", chainId, template);

  const nftsFactory = await factoryGetContract(chainId, signerOrProvider);
  const templateAddress = await nftsFactory.templates(template);

  // console.log("factoryGetTemplateAddress", chainId, template, templateAddress);
  return templateAddress;
};

export { factoryGetAddress, factoryGetContract, factoryGetExplorerUrl, factoryGetTemplateAddress };
