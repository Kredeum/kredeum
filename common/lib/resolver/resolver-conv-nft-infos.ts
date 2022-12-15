import { BigNumber, constants } from "ethers";

import type { IERCNftInfos, IOpenNFTsInfos } from "@soltypes/src/interfaces/IOpenNFTsResolver";
import type { NftType, CollectionType, ReceiverType } from "@lib/common/types";
import { getChainName, getChecksumAddress } from "@lib/common/config";

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
  const chainName = getChainName(chainId) || "";

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
  if (owner && owner != constants.AddressZero) nft.owner = owner;

  const approved = getChecksumAddress(nftInfos[3]);
  if (approved && approved != constants.AddressZero) nft.approved = approved;

  const royaltyAccount = openNFTsInfos[1][0];
  if (royaltyAccount && royaltyAccount != constants.AddressZero) royalty.account = royaltyAccount;

  const royaltyFee = Number(openNFTsInfos[1][1]);
  if (royaltyFee > 0) royalty.fee = royaltyFee;

  const royaltyMinimum = BigNumber.from(openNFTsInfos[1][2]);
  if (royaltyMinimum.gt(0)) royalty.minimum = royaltyMinimum;

  const price = BigNumber.from(openNFTsInfos[0] || "0");
  if (price.gt(0)) nft.price = price;

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
