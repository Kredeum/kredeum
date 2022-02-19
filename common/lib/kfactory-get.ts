import type { NFTsFactoryV2 } from "../types/NFTsFactoryV2";

import type { Provider } from "@ethersproject/abstract-provider";
import type { Address } from "./ktypes";

import { Signer, Contract } from "ethers";
import { abis, getChecksumAddress, getNetwork } from "./kconfig";

const nftsFactories: Map<number, NFTsFactoryV2> = new Map();

// GET OpenNFTs default template via onchain call
const factoryGetTemplate = async (chainId: number, template: string, provider: Provider): Promise<Address> => {
  const nftsFactoryV2 = factoryGetContract(chainId, provider);
  return (await nftsFactoryV2.templates(template || "generic")) || "";
};

// GET NFTsFactory Address
const factoryGetAddress = (chainId: number): Address => getChecksumAddress(getNetwork(chainId)?.nftsFactory) || "";

// GET NFTsFactory Contract
const factoryGetContract = (chainId: number, signerOrProvider: Signer | Provider): NFTsFactoryV2 => {
  // console.log("factoryGetContract", chainId);

  let nftsFactory = nftsFactories.get(chainId);
  if (!nftsFactory) {
    nftsFactory = new Contract(
      factoryGetAddress(chainId),
      abis.CloneFactoryV2.abi.concat(abis.NFTsFactoryV2.abi),
      signerOrProvider
    ) as NFTsFactoryV2;
    nftsFactories.set(chainId, nftsFactory);
  }
  return nftsFactory;
};

export { factoryGetContract, factoryGetAddress, factoryGetTemplate };
export type { NFTsFactoryV2 };
