import { BigNumber, constants } from "ethers";

import type { NftType, CollectionType } from "@lib/ktypes";
import { getChainName, getChecksumAddress } from "@lib/kconfig";

import { IERCNftInfos, IOpenNFTsInfos } from "@soltypes/contracts/interfaces/IOpenNFTsResolver";

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
  const owner = getChecksumAddress(nftInfos[2]) || "";
  const approved = getChecksumAddress(nftInfos[3]) || "";
  const chainName = getChainName(chainId) || "";
  
  const price = openNFTsInfos[0].toString() || "0";
  const royaltyReceiver = openNFTsInfos[1] || constants.AddressZero;
  const royaltyAmount = openNFTsInfos[2].toString() || "0";
 
  
  const collectionName = collection.name || "";
  const collectionSymbol = collection.symbol || "";
  const burnable = collection.supports?.IOpenNFTsV4;

  const nft: NftType = {
    chainId,
    address,
    tokenID,
    tokenURI,
    owner,
    approved,
    chainName,
    price,
    royaltyReceiver,
    royaltyAmount,
    collectionName,
    collectionSymbol,
    burnable
  };

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
