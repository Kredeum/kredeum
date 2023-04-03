import type { CollectionType } from "@lib/common/types";

import { config, MAX_FEE } from "@lib/common/config";
import { BigNumber, constants } from "ethers";
const ZeroAddress = constants.AddressZero;

const feeAmount = (price = BigNumber.from(0), fee = 0): BigNumber => price.mul(fee).div(MAX_FEE);

const collectionPrice = (coll: CollectionType): BigNumber => coll?.price || BigNumber.from(0);
const collectionIsAutoMarket = (coll: CollectionType): boolean => Boolean(coll?.supports?.IOpenAutoMarket);
const collectionOpenOrOwner = (coll: CollectionType, owner: string): boolean =>
  Boolean(coll?.owner === owner || coll?.open);

const collectionRoyaltyAccount = (coll: CollectionType): string => coll?.royalty?.account || ZeroAddress;
const collectionRoyaltyFee = (coll: CollectionType): number => Number(coll?.royalty?.fee || 0);
const collectionRoyaltyEnforcement = (coll: CollectionType): boolean => Boolean(coll?.royaltyEnforcement);

const collectionRoyaltyAmount = (coll: CollectionType, price = BigNumber.from(0)): BigNumber =>
  feeAmount(price || collectionPrice(coll), collectionRoyaltyFee(coll));
const collectionRoyaltyMinimum = (coll: CollectionType): BigNumber => coll?.royalty?.minimum || BigNumber.from(0);

const collectionFeeAmount = (coll: CollectionType, price = BigNumber.from(0)): BigNumber =>
  feeAmount(price, config.treasury.fee);
const collectionFeeMinimum = (coll: CollectionType): BigNumber =>
  collectionFeeAmount(coll, collectionRoyaltyMinimum(coll));

const collectionRoyaltyAndFeeAmount = (coll: CollectionType, price = BigNumber.from(0)): BigNumber =>
  collectionRoyaltyAmount(coll, price).add(collectionFeeAmount(coll, price));
const collectionRoyaltyAndFeeMinimum = (coll: CollectionType): BigNumber =>
  collectionRoyaltyMinimum(coll).add(collectionFeeMinimum(coll));

const collectionPriceValid = (coll: CollectionType, price = BigNumber.from(0)): boolean =>
  !collectionRoyaltyEnforcement(coll) || price.gte(collectionRoyaltyAndFeeMinimum(coll));

export {
  feeAmount,
  collectionPrice,
  collectionIsAutoMarket,
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
