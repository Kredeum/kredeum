import type { CollectionType } from "../common/types";

import { ADDRESS_ZERO, feeAmount, treasuryAmount } from "../common/config";
import { Address } from "viem";

const collectionPrice = (coll: CollectionType): bigint => coll?.price || 0n;
const collectionOwner = (coll: CollectionType): string => String(coll?.owner || "");
const collectionOpen = (coll: CollectionType): boolean => Boolean(coll?.open);

const collectionSupports = (coll: CollectionType): Map<string, boolean> =>
  coll?.supports || (new Map() as Map<string, boolean>);

const collectionIsAutoMarket = (coll: CollectionType): boolean => Boolean(coll?.supports?.get("IOpenAutoMarket"));
const collectionIsOpenMarketable = (coll: CollectionType): boolean => Boolean(coll?.supports?.get("IOpenMarketable"));
const collectionIsERC721 = (coll: CollectionType): boolean => Boolean(coll?.supports?.get("IERC721"));
const collectionIsERC1155 = (coll: CollectionType): boolean => Boolean(coll?.supports?.get("IERC1155"));
const collectionOpenOrOwner = (coll: CollectionType, owner: Address): boolean =>
  Boolean(coll?.owner === owner || coll?.open);

const collectionRoyaltyAccount = (coll: CollectionType): string => coll?.royalty?.account || ADDRESS_ZERO;
const collectionRoyaltyFee = (coll: CollectionType): bigint => BigInt(coll?.royalty?.fee || 0);
const collectionRoyaltyEnforcement = (coll: CollectionType): boolean => Boolean(coll?.royaltyEnforcement);

const collectionRoyaltyAmount = (coll: CollectionType, price = 0n): bigint =>
  feeAmount(price || collectionPrice(coll), collectionRoyaltyFee(coll));
const collectionRoyaltyMinimum = (coll: CollectionType): bigint => coll?.royalty?.minimum || 0n;

const collectionFeeMinimum = (coll: CollectionType): bigint => treasuryAmount(collectionRoyaltyMinimum(coll));

const collectionRoyaltyAndFeeAmount = (coll: CollectionType, price = 0n): bigint =>
  collectionRoyaltyAmount(coll, price) + feeAmount(price);
const collectionRoyaltyAndFeeMinimum = (coll: CollectionType): bigint =>
  collectionRoyaltyMinimum(coll) + collectionFeeMinimum(coll);

const collectionPriceValid = (coll: CollectionType, price = 0n): boolean =>
  !collectionRoyaltyEnforcement(coll) || price >= collectionRoyaltyAndFeeMinimum(coll);

export {
  collectionOwner,
  collectionOpen,
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
  collectionSupports,
  collectionFeeMinimum,
  collectionRoyaltyAndFeeAmount,
  collectionRoyaltyAndFeeMinimum,
  collectionPriceValid
};
