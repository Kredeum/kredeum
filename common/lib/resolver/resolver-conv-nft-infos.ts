import { constants } from "ethers";

import type { CollectionType, NftType } from "@lib/ktypes";
import { getChainName, getChecksumAddress } from "@lib/kconfig";

import { IERC721Infos } from "@soltypes/contracts/next/OpenNFTsResolver";

const resolverConvNftInfos = (
  chainId: number,
  collection: CollectionType,
  nftInfos: IERC721Infos.NftInfosStructOutput,
  account = constants.AddressZero
): NftType => {
  console.log("resolverConvNftInfos  IN", chainId, nftInfos, account);

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

  console.log("resolverConvNftInfos OUT", nft);
  return nft;
};

export { resolverConvNftInfos };
