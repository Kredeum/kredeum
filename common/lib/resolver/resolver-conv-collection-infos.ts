import { constants, BigNumber } from "ethers";

import type { IOpenNFTsInfos, IERCNftInfos } from "@soltypes/src/OpenNFTsResolver";

import type { CollectionType, ReceiverType } from "@lib/common/types";
import { getChainName, getChecksumAddress, DEFAULT_NAME, DEFAULT_SYMBOL } from "@lib/common/config";
import { resolverConvSupports } from "@lib/resolver/resolver-conv-supports";

const resolverConvCollectionInfos = (
  chainId: number,
  collectionInfos: IERCNftInfos.CollectionInfosStructOutput,
  account = constants.AddressZero
): CollectionType => {
  // console.log("resolverConvCollectionInfos  IN", chainId, collectionInfos, account);

  const chainName = getChainName(chainId);
  const address: string = getChecksumAddress(collectionInfos[0]);
  const name: string = collectionInfos[2];
  const symbol: string = collectionInfos[3];
  const supports = resolverConvSupports(collectionInfos[7]);

  const collection: CollectionType = { chainId, chainName, address, name, symbol, supports };

  const totalSupply = Number(collectionInfos[4]);
  if (totalSupply > 0) collection.totalSupply = totalSupply;

  collection.owner = getChecksumAddress(collectionInfos[1]);

  if (collectionInfos[7][2] && account != constants.AddressZero) {
    // ERC721
    collection.balancesOf = new Map([[account, Number(collectionInfos[5])]]);
    collection.approvedForAll = new Map([[account, Boolean(collectionInfos[6])]]);
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
  const royalty: ReceiverType = {};

  const collectionOpenNFTsInfos = collectionInfos[1];

  const open = collectionOpenNFTsInfos[2];
  if (open) collection.open = open;

  const minimal = collectionOpenNFTsInfos[3];
  if (minimal) collection.royaltyEnforcement = minimal;

  const version = Number(collectionOpenNFTsInfos[0]);
  if (version >= 2) collection.version = version;
  else {
    const openNFTsV0AddressesMatic = [
      "0xF6d53C7e96696391Bb8e73bE75629B37439938AF",
      "0x792f8e3C36Ac3c1C6D62ECc44a88cA1317fEce93"
    ];
    const openNFTsV1AddressesMatic = [
      "0xbEaAb0f00D236862527dcF5a88dF3CEd043ab253",
      "0xC9D75c6dC5A75315ff68A4CB6fba5c53aBed82d0"
    ];
    const openNFTsV1AddressMainnet = "0x82a398243EBc2CB26a4A21B9427EC6Db8c224471";
    const openNFTsV1AddressBsc = "0xd9C43494D2b3B5Ae86C57d12eB7683956472d5E9";

    if (chainId == 137 && openNFTsV1AddressesMatic.includes(collection.address)) {
      collection.version = 1;
    } else if (chainId == 137 && openNFTsV0AddressesMatic.includes(collection.address)) {
      collection.version = 0;
    } else if (chainId == 1 && openNFTsV1AddressMainnet == collection.address) {
      collection.version = 1;
    } else if (chainId == 56 && openNFTsV1AddressBsc == collection.address) {
      collection.version = 1;
    }
  }

  const template = collectionOpenNFTsInfos[1] || "";
  if (template) collection.template = template;

  const price = BigNumber.from(collectionOpenNFTsInfos[4] || 0);
  if (price.gt(0)) collection.price = price;

  const royaltyAccount = collectionOpenNFTsInfos[5][0];
  if (royaltyAccount && royaltyAccount != constants.AddressZero) royalty.account = royaltyAccount;

  const royaltyFee = Number(collectionOpenNFTsInfos[5][1]);
  if (royaltyFee > 0) royalty.fee = royaltyFee;

  const royaltyMinimum = collectionOpenNFTsInfos[5][2];
  if (royaltyMinimum.gt(0)) royalty.minimum = royaltyMinimum;

  if (Object.keys(royalty).length > 0) collection.royalty = royalty;

  // console.log("resolverConvOpenNFTsCollectionInfos collection OUT", collection);
  return collection;
};

export { resolverConvCollectionInfos, resolverConvOpenNFTsCollectionInfos };
