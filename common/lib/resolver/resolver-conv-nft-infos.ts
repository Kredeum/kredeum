import { constants } from "ethers";

import type { NftType, CollectionType } from "@lib/ktypes";
import { getChainName, getChecksumAddress } from "@lib/kconfig";

import { IERCNftInfos, IOpenNFTsInfos } from "@soltypes/contracts/interfaces/IOpenNFTsResolver";

const resolverConvNftInfos = (
  chainId: number,
  collection: CollectionType,
  nftInfos: IERCNftInfos.NftInfosStructOutput,
  account = constants.AddressZero
): NftType => {
  // console.log("resolverConvNftInfos  IN", chainId, nftInfos, account);

  const address = getChecksumAddress(collection.address);
  const tokenID = String(nftInfos[0]);
  const tokenURI = nftInfos[1] || "";
  const owner = getChecksumAddress(nftInfos[2]) || "";
  const approved = getChecksumAddress(nftInfos[3]) || "";
  const chainName = getChainName(chainId) || "";
  const collectionName = collection.name || "";
  const collectionSymbol = collection.symbol || "";

  const nft: NftType = {
    chainId,
    address,
    tokenID,
    tokenURI,
    owner,
    approved,
    chainName,
    collectionName,
    collectionSymbol
  };

  // console.log("resolverConvNftInfos OUT", nft);
  return nft;
};

const resolverConvOpenNFTsNftInfos = (
  chainId: number,
  collection: CollectionType,
  collInfos: [IERCNftInfos.NftInfosStructOutput, IOpenNFTsInfos.OpenNFTsNftInfosStructOutput],
  account = constants.AddressZero
): NftType => {
  // console.log("resolverConvOpenNFTsNftInfos openNFTs IN", chainId, collection, collInfos, account);

  const nft = resolverConvNftInfos(chainId, collection, collInfos[0], account);

  // console.log("resolverConvOpenNFTsNftInfos nft OUT", nft);
  return nft;
};

export { resolverConvNftInfos, resolverConvOpenNFTsNftInfos };
