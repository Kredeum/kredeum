import type { CollectionType } from "@lib/common/types";

import { config, MAX_FEE } from "@lib/common/config";
import { ZeroAddress } from "ethers";

const collectionPrice = (coll: CollectionType): bigint => coll?.price || 0n;
const collectionMinimal = (coll: CollectionType): boolean => Boolean(coll?.minimal);
const collectionRoyaltyAccount = (coll: CollectionType): string => coll?.royalty?.account || ZeroAddress;
const collectionRoyaltyFee = (coll: CollectionType): number => Number(coll?.royalty?.fee || 0);
const collectionRoyaltyMinimum = (coll: CollectionType): bigint => coll?.royalty?.minimum || 0n;
const collectionIsAutoMarket = (coll: CollectionType): boolean => Boolean(coll?.supports?.IOpenAutoMarket);
const collectionOpenOrOwner = (coll: CollectionType, owner: string): boolean =>
  Boolean(coll?.owner === owner || coll?.open);

const feeAmount = (price = 0n, fee = 0): bigint => (price * BigInt(fee)) / BigInt(MAX_FEE);

const collectionRoyaltyAmount = (coll: CollectionType, price = 0n): bigint =>
  feeAmount(price || collectionPrice(coll), collectionRoyaltyFee(coll));

const collectionPriceValid = (coll: CollectionType, price = 0n): boolean =>
  !(collectionMinimal(coll) && price < feeAmount(price, config.treasury.fee) + collectionRoyaltyMinimum(coll));

const collectionPriceInputInvalid = (coll: CollectionType, inputPrice = 0n): boolean => {
  console.log("collectionPriceInputInvalid:", coll, inputPrice);
  console.log("collectionMinimal(coll) :", collectionMinimal(coll));
  console.log(
    "collectionPriceInputInvalid ~ feeAmount(inputPrice, config.treasury.fee) + collectionRoyaltyMinimum(coll) * 2n:",
    feeAmount(inputPrice, config.treasury.fee) + collectionRoyaltyMinimum(coll) * 2n
  );
  return (
    collectionMinimal(coll) &&
    0 < inputPrice &&
    inputPrice < feeAmount(inputPrice, config.treasury.fee) + collectionRoyaltyMinimum(coll) * 2n
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
