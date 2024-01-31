import type { CollectionType } from "@kredeum/common/lib/common/types";

import { BigNumber } from "ethers";
import { ADDRESS_ZERO, feeAmount, treasuryAmount } from "@kredeum/common/lib/common/config";

const collectionPrice = (coll: CollectionType): BigNumber => coll?.price || BigNumber.from(0);
const collectionOwner = (coll: CollectionType): string => String(coll?.owner || "");
const collectionOpen = (coll: CollectionType): boolean => Boolean(coll?.open);

const collectionSupports = (coll: CollectionType): Map<string, boolean> =>
  coll?.supports || (new Map() as Map<string, boolean>);

const collectionIsAutoMarket = (coll: CollectionType): boolean => Boolean(coll?.supports?.get("IOpenAutoMarket"));
const collectionIsOpenMarketable = (coll: CollectionType): boolean => Boolean(coll?.supports?.get("IOpenMarketable"));
const collectionIsERC721 = (coll: CollectionType): boolean => Boolean(coll?.supports?.get("IERC721"));
const collectionIsERC1155 = (coll: CollectionType): boolean => Boolean(coll?.supports?.get("IERC1155"));
const collectionOpenOrOwner = (coll: CollectionType, owner: string): boolean =>
  Boolean(coll?.owner === owner || coll?.open);

const collectionRoyaltyAccount = (coll: CollectionType): string => coll?.royalty?.account || ADDRESS_ZERO;
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
