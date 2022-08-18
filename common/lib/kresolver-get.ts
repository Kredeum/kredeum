import type { Provider } from "@ethersproject/abstract-provider";

import { Contract } from "ethers";
import { getNetwork, explorerContractUrl } from "@lib/kconfig";

import type { NFTsResolver } from "@soltypes/contracts/next";
import abiNFTsResolver from "@abis/contracts/next/NFTsResolver.sol/NFTsResolver.json";

// Cache nftsResolver(chainId)
const nftsResolversCache: Map<number, Contract> = new Map();

//  GET nftsResolver address
const resolverGetAddress = (chainId: number): string => getNetwork(chainId)?.nftsResolver || "";

// GET nftsResolver explorer URL
const resolverGetExplorerUrl = (chainId: number): string =>
  // https://blockscout.com/xdai/mainnet/address/0x86246ba8F7b25B1650BaF926E42B66Ec18D96000/read-contract
  // https://etherscan.io/address/0x4b7992F03906F7bBE3d48E5Fb724f52c56cFb039#readContract
  explorerContractUrl(chainId, resolverGetAddress(chainId));

// GET NFTsResolver Contract
const resolverGetContract = (chainId: number, provider: Provider): NFTsResolver => {
  // console.log("resolverGetContract", chainId);

  let nftsResolver = nftsResolversCache.get(chainId);
  if (!nftsResolver) {
    nftsResolver = new Contract(resolverGetAddress(chainId), abiNFTsResolver, provider);
    nftsResolversCache.set(chainId, nftsResolver);
  }

  // console.log("nftsResolver", nftsResolver);
  return nftsResolver as NFTsResolver;
};

export { resolverGetAddress, resolverGetContract, resolverGetExplorerUrl };
