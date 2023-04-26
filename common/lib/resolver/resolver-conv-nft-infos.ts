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
  const tokenURI = nftInfos[1];
  const chainName = getChainName(chainId);

  const nft: NftType = {
    chainId,
    address,
    tokenID,
    tokenURI,
    chainName,
    collection
  };
  const royalty: ReceiverType = {};

  nft.owner = getChecksumAddress(nftInfos[2]);
  nft.approved = getChecksumAddress(nftInfos[3]);
  royalty.account = getChecksumAddress(openNFTsInfos[1][0]);
  nft.price = BigNumber.from(openNFTsInfos[0]);

  royalty.fee = Number(openNFTsInfos[1][1]);
  royalty.minimum = BigNumber.from(openNFTsInfos[1][2]);
  nft.royalty = royalty;

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
