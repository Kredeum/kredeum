import { Contract } from "ethers";

import { getNetwork, explorerContractUrl } from "@lib/common/config";

import type { OpenNFTsResolver } from "@soltypes/src/OpenNFTsResolver";
import abiOpenNFTsResolver from "@abis/src/OpenNFTsResolver.sol/OpenNFTsResolver.json";
import { providerGetSignerOrProvider } from "@lib/common/provider-get";

// Cache nftsResolver contract (chainId)
const _nftsResolversCache: Map<string, Contract> = new Map();

//  GET openNFTsResolver address
const resolverGetAddress = (chainId: number): string => getNetwork(chainId)?.nftsResolver || "";

// GET openNFTsResolver explorer URL
const resolverGetExplorerUrl = (chainId: number): string => explorerContractUrl(chainId, resolverGetAddress(chainId));

const resolverGetCount = async (chainId: number): Promise<number> => {
  const nftsResolver = await resolverGetContract(chainId);

  return Number(await nftsResolver.countAddresses());
};

// GET openNFTsResolver Contract
const resolverGetContract = async (chainId: number, signer = false): Promise<OpenNFTsResolver> => {
  // console.log("resolverGetContract", chainId);

  let nftsResolver = _nftsResolversCache.get(String(chainId));
  if (!nftsResolver) {
    const signerOrProvider = await providerGetSignerOrProvider(chainId, signer);

    nftsResolver = new Contract(resolverGetAddress(chainId), abiOpenNFTsResolver, signerOrProvider);

    _nftsResolversCache.set(String(chainId), nftsResolver);
  }

  // console.log("resolverGetContract", nftsResolver);
  return nftsResolver as unknown as OpenNFTsResolver;
};

export { resolverGetAddress, resolverGetExplorerUrl, resolverGetCount, resolverGetContract };
