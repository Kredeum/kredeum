import type { IERCNftInfos, IOpenNFTsInfos } from "@kredeum/contracts/types/IOpenNFTsResolver";
import type { NftType, CollectionType, ReceiverType } from "../common/types";
import { ADDRESS_ZERO, getChecksumAddress } from "../common/config";
import { networks } from "../common/networks";

const resolverConvNftInfos = (
  chainId: number,
  collection: CollectionType,
  nftInfos: IERCNftInfos.NftInfosStructOutput,
  openNFTsInfos: IOpenNFTsInfos.OpenNFTsNftInfosStructOutput
): NftType => {
  // console.log("resolverConvNftInfos  IN", chainId, nftInfos, account);

  const address = getChecksumAddress(collection.address);
  const tokenID = String(nftInfos[0]);
  const tokenURI = nftInfos[1] || "";
  const chainName = networks.getChainName(chainId) || "";

  const nft: NftType = {
    chainId,
    address,
    tokenID,
    tokenURI,
    chainName,
    collection
  };
  const royalty: ReceiverType = {};

  const owner = getChecksumAddress(nftInfos[2]) || "";
  if (owner && owner != ADDRESS_ZERO) nft.owner = owner;

  const approved = getChecksumAddress(nftInfos[3]);
  if (approved && approved != ADDRESS_ZERO) nft.approved = approved;

  const royaltyAccount = openNFTsInfos[1][0];
  if (royaltyAccount && royaltyAccount != ADDRESS_ZERO) royalty.account = royaltyAccount;

  const royaltyFee = BigInt(openNFTsInfos[1][1].toString());
  if (royaltyFee > 0) royalty.fee = royaltyFee;

  const royaltyMinimum = BigInt(openNFTsInfos[1][2].toString());
  if (royaltyMinimum > 0n) royalty.minimum = royaltyMinimum;

  nft.price = BigInt(openNFTsInfos[0].toString() || "0");

  if (Object.keys(royalty).length > 0) nft.royalty = royalty;

  // console.log("resolverConvNftInfos OUT", nft);
  return nft;
};

const resolverConvOpenNFTsNftInfos = (
  chainId: number,
  collection: CollectionType,
  collInfos: [IERCNftInfos.NftInfosStructOutput, IOpenNFTsInfos.OpenNFTsNftInfosStructOutput]
): NftType => {
  // console.log("resolverConvOpenNFTsNftInfos openNFTs IN", chainId, collection, collInfos, account);

  const nft = resolverConvNftInfos(chainId, collection, collInfos[0], collInfos[1]);

  // console.log("resolverConvOpenNFTsNftInfos nft OUT", nft);
  return nft;
};

export { resolverConvNftInfos, resolverConvOpenNFTsNftInfos };
