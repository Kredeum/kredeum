import { constants } from "ethers";

import type { CollectionType } from "@lib/ktypes";
import {
  getChainName,
  getChecksumAddress,
  DEFAULT_NAME,
  DEFAULT_SYMBOL
} from "@lib/kconfig";
import { resolverConvSupports } from "@lib/resolver/resolver-conv-supports";

import { IOpenNFTsInfos, IERC721Infos } from "@soltypes/contracts/next/OpenNFTsResolver";

const resolverConvCollectionInfos = (
  chainId: number,
  collectionInfos: IERC721Infos.CollectionInfosStructOutput,
  account = constants.AddressZero
): CollectionType => {
  console.log("resolverConvCollectionInfos  IN", chainId, collectionInfos, account);

  const chainName = getChainName(chainId);
  const address: string = getChecksumAddress(collectionInfos[0]);
  const owner: string = getChecksumAddress(collectionInfos[1]);
  const name: string = collectionInfos[2] || DEFAULT_NAME;
  const symbol: string = collectionInfos[3] || DEFAULT_SYMBOL;
  const totalSupply = Number(collectionInfos[4]);
  const balancesOf = new Map([[account, Number(collectionInfos[5])]]);
  const supports = resolverConvSupports(collectionInfos[6]);

  const collection = { chainId, chainName, address, owner, name, symbol, totalSupply, balancesOf, supports };

  console.log("resolverConvCollectionInfos OUT", collection);
  return collection;
};

const resolverConvOpenNFTsCollectionInfos = (
  chainId: number,
  openNFTs: IOpenNFTsInfos.OpenNFTsCollectionInfosStructOutput,
  account = constants.AddressZero
): CollectionType => {
  console.log("resolverConvOpenNFTsCollectionInfos openNFTs IN", openNFTs);

  const collection = resolverConvCollectionInfos(chainId, openNFTs[0], account);

  collection.version = Number(openNFTs[1] || -1);
  collection.template = openNFTs[2] || "";
  collection.open = openNFTs[3] || false;

  console.log("resolverConvOpenNFTsCollectionInfos collection OUT", collection);
  return collection;
};

export { resolverConvCollectionInfos, resolverConvOpenNFTsCollectionInfos };
