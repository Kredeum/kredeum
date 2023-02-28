import { BigNumber, constants } from "ethers";

import type { CollectionType, NftType } from "@lib/common/types";
import { nftUrl } from "@lib/common/config";
import { resolverConvOpenNFTsNftInfos } from "@lib/resolver/resolver-conv-nft-infos";
import { resolverGetContract } from "@lib/resolver/resolver-get";
import { FETCH_LIMIT } from "@lib/common/fetch";

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
  tokenID: string,
  account = constants.AddressZero
): Promise<NftType> => {
  // console.log("resolverGetNft", collection.address);

  const nftsResolver = await resolverGetContract(chainId);

  const [nftInfos, openNFTsinfos] = await nftsResolver.getOpenNFTsNftInfos(collection.address, tokenID, account);

  return resolverConvOpenNFTsNftInfos(chainId, collection, [nftInfos, openNFTsinfos]);
};

// GET NFTs Infos from Resolver for account
const resolverGetNfts = async (
  chainId: number,
  collection: CollectionType,
  account = constants.AddressZero,
  limit = FETCH_LIMIT
): Promise<{ nfts: Map<string, NftType>; count: BigNumber; total: BigNumber }> => {
  console.log("resolverGetNfts", chainId, collection, account, limit);
  const nfts: Map<string, NftType> = new Map();

  const nftsResolver = await resolverGetContract(chainId);
  // console.log("resolverGetNfts nftsResolver", nftsResolver);

  const res = await nftsResolver["getOpenNFTsNftsInfos(address,address,uint256,uint256)"](
    collection.address,
    account,
    limit,
    0
  );
  // console.log("resolverGetNfts nftsResolver.getNftsInfos for Account", res);

  const [nftsInfos, openNFTsNftsInfos, , count, total] = res;
  // console.log("resolverGetNfts nftsInfosStructOutput", nftsInfos);

  for (let index = 0; index < nftsInfos.length; index++) {
    const nft = resolverConvOpenNFTsNftInfos(chainId, collection, [nftsInfos[index], openNFTsNftsInfos[index]]);
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
  account = constants.AddressZero
): Promise<Map<string, NftType>> => {
  console.log("resolverGetNftsFromTokenIds", chainId, collection.address);

  const nfts: Map<string, NftType> = new Map();

  const nftsResolver = await resolverGetContract(chainId);

  const nftsInfos = await nftsResolver["getOpenNFTsNftsInfos(address,uint256[],address)"](
    collection.address,
    tokenIDs,
    account
  );
  // console.log("resolverGetNfts nftsResolver.getNftsInfos for tokenIDs", nftsInfos);

  for (let index = 0; index < tokenIDs.length; index++) {
    const nft = resolverConvOpenNFTsNftInfos(chainId, collection, [nftsInfos[0][index], nftsInfos[1][index]]);
    nfts.set(nftUrl(nft), nft);
  }

  // console.log("resolverGetNftsFromTokenIds nft", nft);
  return nfts;
};

export { resolverGetNft, resolverGetNfts, resolverGetNftsForTokenIds };
