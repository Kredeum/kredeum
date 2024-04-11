// import { Contract, ContractInterface } from "ethers";

import { ADDRESS_ZERO, explorerContractUrl, getAddresses } from "../common/config";

import type { OpenNFTsResolver } from "@kredeum/contracts/types/OpenNFTsResolver";
import { getAbi } from "../common/artifacts";
import { type Address } from "viem";
import { Contract } from "../common/types";

// Cache nftsResolver contract (chainId)
const _nftsResolversCache: Map<string, Contract> = new Map();

//  GET openNFTsResolver address
const resolverGetAddress = (chainId: number): Address => getAddresses(chainId)?.OpenNFTsResolver || ADDRESS_ZERO;

// GET openNFTsResolver explorer URL
const resolverGetExplorerUrl = (chainId: number): string => explorerContractUrl(chainId, resolverGetAddress(chainId));

const resolverGetCount = async (chainId: number): Promise<number> => {
  const nftsResolver = await resolverGetContract(chainId);

  return Number(await nftsResolver.countAddresses());
};

// GET openNFTsResolver Contract
const resolverGetContract = async (chainId: number, signer = false): Promise<OpenNFTsResolver> => {
  // console.log("resolverGetContract", chainId);

  const nftsResolver: OpenNFTsResolver = _nftsResolversCache.get(String(chainId)) as unknown as OpenNFTsResolver;
  // let nftsResolver = _nftsResolversCache.get(String(chainId));
  // if (!nftsResolver) {
  //   const signerOrProvider = await providerGetSignerOrProvider(chainId, signer);

  //   nftsResolver = new Contract(
  //     resolverGetAddress(chainId),
  //     getAbi("OpenNFTsResolver") as ContractInterface,
  //     signerOrProvider
  //   );
  //   // console.log("resolverGetContract ~ nftsResolver:", nftsResolver);

  //   _nftsResolversCache.set(String(chainId), nftsResolver);
  // }

  // console.log("resolverGetContract", nftsResolver);
  return nftsResolver;
};

export { resolverGetAddress, resolverGetExplorerUrl, resolverGetCount, resolverGetContract };
