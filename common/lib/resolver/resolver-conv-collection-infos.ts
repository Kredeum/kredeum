import { constants, BigNumber } from "ethers";

import type { CollectionType } from "@lib/common/ktypes";
import { getChainName, getChecksumAddress, DEFAULT_NAME, DEFAULT_SYMBOL } from "@lib/common/kconfig";
import { resolverConvSupports } from "@lib/resolver/resolver-conv-supports";

import { IOpenNFTsInfos, IERCNftInfos } from "@soltypes/contracts/next/OpenNFTsResolver";

const resolverConvCollectionInfos = (
  chainId: number,
  collectionInfos: IERCNftInfos.CollectionInfosStructOutput,
  account = constants.AddressZero
): CollectionType => {
  // console.log("resolverConvCollectionInfos  IN", chainId, collectionInfos, account);

  const chainName = getChainName(chainId);
  const address: string = getChecksumAddress(collectionInfos[0]);
  const owner: string = getChecksumAddress(collectionInfos[1]);
  const name: string = collectionInfos[2] || DEFAULT_NAME;
  const symbol: string = collectionInfos[3] || DEFAULT_SYMBOL;
  const totalSupply = Number(collectionInfos[4]);
  const supports = resolverConvSupports(collectionInfos[6]);

  const collection: CollectionType = { chainId, chainName, address, owner, name, symbol, totalSupply, supports };

  if (collectionInfos[6][2]) {
    // ERC721
    collection.balancesOf = new Map([[account, Number(collectionInfos[5])]]);
  }

  // console.log("resolverConvCollectionInfos OUT", collection);
  return collection;
};

const resolverConvOpenNFTsCollectionInfos = (
  chainId: number,
  collectionInfos: [IERCNftInfos.CollectionInfosStructOutput, IOpenNFTsInfos.OpenNFTsCollectionInfosStructOutput],
  account = constants.AddressZero
): CollectionType => {
  // console.log("resolverConvOpenNFTsCollectionInfos openNFTs IN", collectionInfos);

  const collection = resolverConvCollectionInfos(chainId, collectionInfos[0], account);

  collection.version = Number(collectionInfos[1][0] || -1);
  collection.template = collectionInfos[1][1] || "";
  collection.open = collectionInfos[1][2] || false;
  collection.price = BigNumber.from(collectionInfos[1][3] || 0);
  collection.receiver = collectionInfos[1][4] || constants.AddressZero;
  collection.fee = BigNumber.from(collectionInfos[1][5] || 0);

  // console.log("resolverConvOpenNFTsCollectionInfos collection OUT", collection);
  return collection;
};

export { resolverConvCollectionInfos, resolverConvOpenNFTsCollectionInfos };
