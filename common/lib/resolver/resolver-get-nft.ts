import type { Provider } from "@ethersproject/abstract-provider";
import { BigNumber, constants } from "ethers";

import type { CollectionType, NftType } from "@lib/ktypes";
import { nftUrl } from "@lib/kconfig";
import { resolverConvNftInfos } from "@lib/resolver/resolver-conv-nft-infos";
import { resolverGetContract } from "@lib/resolver/resolver-get";
import { FETCH_LIMIT } from "@lib/kfetch";

// COLLECTION
// name
// symbol
// balanceOf(owner)
// totalSupply
// NFTSLIST
// tokenID
// tokenURI
// tokenOwner
// tokenApproved

// GET NFT Infos from Resolver
const resolverGetNft = async (
  chainId: number,
  collection: CollectionType,
  provider: Provider,
  account = constants.AddressZero
): Promise<NftType> => {
  console.log("resolverGetNft", collection.address);

  const nftsResolver = resolverGetContract(chainId, provider);

  const nftInfosStructOutput = await nftsResolver.getNftInfos(
    collection.address,
    account,
    collection.supports?.IERC721Metadata || false
  );

  const nft = resolverConvNftInfos(chainId, collection, nftInfosStructOutput, account);
  // console.log("nft", nft);
  return nft;
};

// GET NFTs Infos from Resolver
const resolverGetNfts = async (
  chainId: number,
  collection: CollectionType,
  provider: Provider,
  account = constants.AddressZero,
  limit = FETCH_LIMIT
): Promise<{ nfts: Map<string, NftType>; count: BigNumber; total: BigNumber }> => {
  console.log("resolverGetNfts", chainId, collection, account, limit);
  const nfts: Map<string, NftType> = new Map();

  const nftsResolver = resolverGetContract(chainId, provider);
  console.log("resolverGetNfts nftsResolver", nftsResolver);

  const res = await nftsResolver.getNftsInfos(collection.address, account, limit, 0);
  console.log("resolverGetNfts nftsResolver.getNftsInfos", res);

  const [nftsInfos, count, total] = res;
  console.log("resolverGetNfts nftsInfosStructOutput", nftsInfos);

  for (let index = 0; index < nftsInfos.length; index++) {
    const nft = resolverConvNftInfos(chainId, collection, nftsInfos[index], account);
    nfts.set(nftUrl(nft), nft);
  }

  // console.log("nfts", nfts, count, total);
  return { nfts, count, total };
};

export { resolverGetNft, resolverGetNfts };
