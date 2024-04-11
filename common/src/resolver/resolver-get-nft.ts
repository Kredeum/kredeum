import type { CollectionType, NftType, CollectionFilterType } from "../common/types";
import { nftUrl } from "../common/config";
import { resolverConvOpenNFTsNftInfos } from "../resolver/resolver-conv-nft-infos";
import { resolverGetContract } from "../resolver/resolver-get";
import { FETCH_LIMIT } from "../common/fetch";
import { collectionIsERC1155 } from "../collection/collection";
import { ADDRESS_ZERO } from "../common/config";

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
  account = ADDRESS_ZERO
): Promise<NftType> => {
  // console.log("resolverGetNft", chainId, collection.address, tokenID, account);
  // console.log("resolverGetNft", account);
  let nft = { chainId, address: collection.address, tokenID };

  // ERC115 bug fixed with new resolver on matic / 137
  if (account === ADDRESS_ZERO && collectionIsERC1155(collection) && chainId != 137)
    throw Error("ERROR : BUG ERC1155 with zero address");

  const nftsResolver = await resolverGetContract(chainId);

  const [nftInfos, openNFTsinfos] = await nftsResolver.getOpenNFTsNftInfos(collection.address, tokenID, account);

  nft = resolverConvOpenNFTsNftInfos(chainId, collection, [nftInfos, openNFTsinfos]);

  return nft;
};

// GET NFTs Infos from Resolver for owner
const resolverGetNfts = async (
  chainId: number,
  collection: CollectionType,
  filter: CollectionFilterType = {}
): Promise<{ nfts: Map<string, NftType>; count: bigint; total: bigint }> => {
  const owner = filter.owner || ADDRESS_ZERO;
  const limit = filter.limit || FETCH_LIMIT;
  const offset = filter.offset || 0;

  // console.log("resolverGetNfts", chainId, collection, filter.owner, filter.limit, filter.offset);
  const nfts: Map<string, NftType> = new Map();

  const nftsResolver = await resolverGetContract(chainId);
  // console.log("resolverGetNfts nftsResolver", nftsResolver);

  const res = await nftsResolver["getOpenNFTsNftsInfos(address,address,uint256,uint256)"](
    collection.address,
    owner,
    limit,
    offset
  );
  // console.log("resolverGetNfts nftsResolver.getNftsInfos for Account", res);

  const [nftsInfos, openNFTsNftsInfos, , ct, tl] = res;
  const count = BigInt(ct.toString());
  const total = BigInt(tl.toString());
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
  tokenIDs: bigint[],
  account = ADDRESS_ZERO
): Promise<Map<string, NftType>> => {
  // console.log("resolverGetNftsFromTokenIds", chainId, collection.address);

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
