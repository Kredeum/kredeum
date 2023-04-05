import type { CollectionType } from "@lib/common/types";

import { BigNumber, constants } from "ethers";
import { feeAmount, treasuryAmount } from "@lib/common/config";

const ZeroAddress = constants.AddressZero;

const collectionPrice = (coll: CollectionType): BigNumber => coll?.price || BigNumber.from(0);
const collectionIsAutoMarket = (coll: CollectionType): boolean => Boolean(coll?.supports?.IOpenAutoMarket);
const collectionIsOpenMarketable = (coll: CollectionType): boolean => Boolean(coll?.supports?.IOpenMarketable);
const collectionIsERC721 = (coll: CollectionType): boolean => Boolean(coll?.supports?.IERC721);
const collectionIsERC1155 = (coll: CollectionType): boolean => Boolean(coll?.supports?.IERC1155);
const collectionOpenOrOwner = (coll: CollectionType, owner: string): boolean =>
  Boolean(coll?.owner === owner || coll?.open);

const collectionRoyaltyAccount = (coll: CollectionType): string => coll?.royalty?.account || ZeroAddress;
const collectionRoyaltyFee = (coll: CollectionType): number => Number(coll?.royalty?.fee || 0);
const collectionRoyaltyEnforcement = (coll: CollectionType): boolean => Boolean(coll?.royaltyEnforcement);

const collectionRoyaltyAmount = (coll: CollectionType, price = BigNumber.from(0)): BigNumber =>
  feeAmount(price || collectionPrice(coll), collectionRoyaltyFee(coll));
const collectionRoyaltyMinimum = (coll: CollectionType): BigNumber => coll?.royalty?.minimum || BigNumber.from(0);

const collectionFeeMinimum = (coll: CollectionType): BigNumber => treasuryAmount(collectionRoyaltyMinimum(coll));

const collectionRoyaltyAndFeeAmount = (coll: CollectionType, price = BigNumber.from(0)): BigNumber =>
  collectionRoyaltyAmount(coll, price).add(feeAmount(price));
const collectionRoyaltyAndFeeMinimum = (coll: CollectionType): BigNumber =>
  collectionRoyaltyMinimum(coll).add(collectionFeeMinimum(coll));

const collectionPriceValid = (coll: CollectionType, price = BigNumber.from(0)): boolean =>
  !collectionRoyaltyEnforcement(coll) || price.gte(collectionRoyaltyAndFeeMinimum(coll));

export {
  collectionPrice,
  collectionIsERC721,
  collectionIsERC1155,
  collectionIsAutoMarket,
  collectionIsOpenMarketable,
  collectionOpenOrOwner,
  collectionRoyaltyAccount,
  collectionRoyaltyFee,
  collectionRoyaltyEnforcement,
  collectionRoyaltyAmount,
  collectionRoyaltyMinimum,
  collectionFeeMinimum,
  collectionRoyaltyAndFeeAmount,
  collectionRoyaltyAndFeeMinimum,
  collectionPriceValid
};
