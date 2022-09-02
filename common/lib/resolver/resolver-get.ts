import type { Provider } from "@ethersproject/abstract-provider";
import { Signer } from "@ethersproject/abstract-signer";
import { Contract } from "ethers";

import { getNetwork, explorerContractUrl } from "@lib/kconfig";

import type { OpenNFTsResolver } from "@soltypes/contracts/next/OpenNFTsResolver";
import abiOpenNFTsResolver from "@abis/contracts/next/OpenNFTsResolver.sol/OpenNFTsResolver.json";

const _nftsResolverKey = (chainId: number, account: string): string => String(chainId).concat(account);

// Cache nftsResolver contract (chainId)
const _nftsResolversCache: Map<string, Contract> = new Map();

//  GET openNFTsResolver address
const resolverGetAddress = (chainId: number): string => getNetwork(chainId)?.nftsResolver || "";

// GET openNFTsResolver explorer URL
const resolverGetExplorerUrl = (chainId: number): string => explorerContractUrl(chainId, resolverGetAddress(chainId));

const resolverGetCount = async (chainId: number, signerOrProvider: Signer | Provider): Promise<number> => {
  const nftsResolver = await resolverGetContract(chainId, signerOrProvider);

  return Number(await nftsResolver.countAddresses());
};

// GET openNFTsResolver Contract
const resolverGetContract = async (chainId: number, signerOrProvider: Signer | Provider): Promise<OpenNFTsResolver> => {
  // console.log("resolverGetContract", chainId);

  const signerAddress = Signer.isSigner(signerOrProvider) ? await signerOrProvider.getAddress() : "";

  let nftsResolver = _nftsResolversCache.get(_nftsResolverKey(chainId, signerAddress));
  if (!nftsResolver) {
    nftsResolver = new Contract(resolverGetAddress(chainId), abiOpenNFTsResolver, signerOrProvider);
    _nftsResolversCache.set(_nftsResolverKey(chainId, signerAddress), nftsResolver);
  }

  // console.log("resolverGetContract", nftsResolver);
  return nftsResolver as OpenNFTsResolver;
};

export { resolverGetAddress, resolverGetExplorerUrl, resolverGetCount, resolverGetContract };
