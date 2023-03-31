import type { CollectionType } from "@lib/common/types";

import { config, MAX_FEE } from "@lib/common/config";
import { BigNumber, constants } from "ethers";
const ZeroAddress = constants.AddressZero;

const collectionPrice = (coll: CollectionType): BigNumber => coll?.price || BigNumber.from(0);
const collectionMinimal = (coll: CollectionType): boolean => Boolean(coll?.minimal);
const collectionRoyaltyAccount = (coll: CollectionType): string => coll?.royalty?.account || ZeroAddress;
const collectionRoyaltyFee = (coll: CollectionType): number => Number(coll?.royalty?.fee || 0);
const collectionRoyaltyMinimum = (coll: CollectionType): BigNumber => coll?.royalty?.minimum || BigNumber.from(0);
const collectionIsAutoMarket = (coll: CollectionType): boolean => Boolean(coll?.supports?.IOpenAutoMarket);
const collectionOpenOrOwner = (coll: CollectionType, owner: string): boolean =>
  Boolean(coll?.owner === owner || coll?.open);

const feeAmount = (price: BigNumber = BigNumber.from(0), fee = 0): BigNumber => price.mul(fee).div(MAX_FEE);

const collectionRoyaltyAmount = (coll: CollectionType, price: BigNumber = BigNumber.from(0)): BigNumber =>
  feeAmount(price || collectionPrice(coll), collectionRoyaltyFee(coll));

const collectionPriceValid = (coll: CollectionType, price: BigNumber = BigNumber.from(0)): boolean =>
  !(
    collectionMinimal(coll) &&
    price.lt(BigNumber.from(feeAmount(price, config.treasury.fee)).add(collectionRoyaltyMinimum(coll)))
  );

const collectionPriceInputInvalid = (coll: CollectionType, inputPrice: BigNumber = BigNumber.from(0)): boolean => {
  // console.log("collectionPriceInputInvalid:", coll, inputPrice);
  // console.log("collectionMinimal(coll) :", collectionMinimal(coll));
  // console.log(
  //   "collectionPriceInputInvalid ~ feeAmount(inputPrice, config.treasury.fee) + collectionRoyaltyMinimum(coll) * 2n:",
  //   feeAmount(inputPrice, config.treasury.fee).add(collectionRoyaltyMinimum(coll)).mul(2)
  // );
  return (
    collectionMinimal(coll) &&
    inputPrice.lt(0) &&
    inputPrice.lt(feeAmount(inputPrice, config.treasury.fee).div(collectionRoyaltyMinimum(coll)).mul(2))
  );
};
/////////////////////////////////////////////////////////////////////
// strig value of decimal number                    : "0.00153486726"
// strig value reduiced (defaul 5 decimals)         : "0.00153"
/////////////////////////////////////////////////////////////////////
const reduceDecimals = (value: string, decimals = 5): string => {
  const intgDecm: Array<string> = value.split(".");
  const intg = intgDecm.length >= 1 ? intgDecm[0] : "";
  const decm = intgDecm.length >= 2 ? intgDecm[1] : "";

  return decm.length > decimals ? `${intg}.${decm.slice(0, decimals - decm.length)}` : value;
};

export {
  feeAmount,
  reduceDecimals,
  collectionRoyaltyAccount,
  collectionRoyaltyAmount,
  collectionOpenOrOwner,
  collectionIsAutoMarket,
  collectionRoyaltyMinimum,
  collectionPriceValid,
  collectionPriceInputInvalid,
  collectionPrice,
  collectionRoyaltyFee
};
