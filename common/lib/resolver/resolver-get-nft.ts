import type { Provider } from "@ethersproject/abstract-provider";
import { BigNumber, constants } from "ethers";

import type { CollectionType, NftType } from "@lib/ktypes";
import { nftUrl } from "@lib/kconfig";
import { resolverConvNftInfos, resolverConvOpenNFTsNftInfos } from "@lib/resolver/resolver-conv-nft-infos";
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

  const [nftInfos,openNFTsinfos] = await nftsResolver.getOpenNFTsNftInfos(collection.address, account);

  return resolverConvOpenNFTsNftInfos(chainId, collection, [nftInfos,openNFTsinfos], account);
};

// GET NFTs Infos from Resolver for account
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

  const res = await nftsResolver["getOpenNFTsNftsInfos(address,address,uint256,uint256)"](
    collection.address,
    account,
    limit,
    0
  );
  console.log("resolverGetNfts nftsResolver.getNftsInfos for Account", res);

  const [nftsInfos, openNFTsNftsInfos,, count, total] = res;
  console.log("resolverGetNfts nftsInfosStructOutput", nftsInfos);

  for (let index = 0; index < nftsInfos.length; index++) {
    const nft = resolverConvOpenNFTsNftInfos(chainId, collection, [nftsInfos[index], openNFTsNftsInfos[index]], account);
    nfts.set(nftUrl(nft), nft);
  }

  // console.log("nfts", nfts, count, total);
  return { nfts, count, total };
};

// GET NFTs Infos from Resolver for tokenIDs
const resolverGetNftsForTokenIds = async (
  chainId: number,
  collection: CollectionType,
  tokenIDs: BigNumber[],
  provider: Provider
): Promise<Map<string, NftType>> => {
  console.log("resolverGetNftsFromTokenIds", chainId, collection.address);

  const nfts: Map<string, NftType> = new Map();

  const nftsResolver = resolverGetContract(chainId, provider);

  const nftsInfos = await nftsResolver["getOpenNFTsNftsInfos(address,uint256[])"](collection.address, tokenIDs);
  console.log("resolverGetNfts nftsResolver.getNftsInfos for tokenIDs", nftsInfos);

  for (let index = 0; index < tokenIDs.length; index++) {
    const nft = resolverConvOpenNFTsNftInfos(chainId, collection, [nftsInfos[0][index], nftsInfos[1][index]]);
    nfts.set(nftUrl(nft), nft);
  }

  // console.log("resolverGetNftsFromTokenIds nft", nft);
  return nfts;
};

export { resolverGetNft, resolverGetNfts, resolverGetNftsForTokenIds };
