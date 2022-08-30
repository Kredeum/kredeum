import type { Provider } from "@ethersproject/abstract-provider";
import type { Signer } from "@ethersproject/abstract-signer";
import { Contract } from "ethers";

import { getNetwork, explorerContractUrl } from "@lib/kconfig";

import type { OpenNFTsResolver } from "@soltypes/contracts/next/OpenNFTsResolver";
import abiOpenNFTsResolver from "@abis/contracts/next/OpenNFTsResolver.sol/OpenNFTsResolver.json";

// Cache nftsResolver contract (chainId)
const _nftsResolversCache: Map<number, Contract> = new Map();

//  GET openNFTsResolver address
const resolverGetAddress = (chainId: number): string => getNetwork(chainId)?.nftsResolver || "";

// GET openNFTsResolver explorer URL
const resolverGetExplorerUrl = (chainId: number): string => explorerContractUrl(chainId, resolverGetAddress(chainId));

const resolverGetCount = async (chainId: number, provider: Provider): Promise<number> => {
  const nftsResolver = resolverGetContract(chainId, provider);

  return Number(await nftsResolver.countAddresses());
};

// GET openNFTsResolver Contract
const resolverGetContract = (chainId: number, signerOrProvider: Signer | Provider): OpenNFTsResolver => {
  // console.log("resolverGetContract", chainId);

  let nftsResolver = _nftsResolversCache.get(chainId);
  if (!nftsResolver) {
    nftsResolver = new Contract(resolverGetAddress(chainId), abiOpenNFTsResolver, signerOrProvider);
    _nftsResolversCache.set(chainId, nftsResolver);
  }

  // console.log("resolverGetContract", nftsResolver);
  return nftsResolver as OpenNFTsResolver;
};

export { resolverGetAddress, resolverGetExplorerUrl, resolverGetCount, resolverGetContract };
