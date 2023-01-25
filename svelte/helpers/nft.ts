import type { ReceiverType, NftType } from "@lib/common/types";
import { BigNumber, constants } from "ethers";

const nftOwner = (nft: NftType): string => String(nft?.owner || "");

const nftOnSale = (nft: NftType): boolean => nftPrice(nft).gt(0);
const nftPrice = (nft: NftType): BigNumber => BigNumber.from(nft?.price || 0);
const nftMinPrice = (nft: NftType): BigNumber => nftRoyaltyMinimum(nft).mul(2);

const nftMarketable = (nft: NftType): boolean => Boolean(nft?.collection?.supports?.IOpenMarketable);
const nftRoyalty = (nft: NftType): ReceiverType => nft?.royalty || {};
const nftRoyaltyAccount = (nft: NftType): string => String(nft?.royalty?.account || constants.AddressZero);
const nftRoyaltyFee = (nft: NftType): number => Number(nft?.royalty?.fee || 0);
const nftRoyaltyMinimum = (nft: NftType): BigNumber => BigNumber.from(nft?.royalty?.minimum || 0);

const nftCollectionPrice = (nft: NftType): BigNumber => BigNumber.from(nft?.collection?.price || 0);
const nftCollectionApproved = (nft: NftType, address: string): boolean => Boolean(nft?.collection?.approvedForAll?.get(address) || false);

export {
  nftOwner,
  nftOnSale,
  nftPrice,
  nftMinPrice,
  nftMarketable,
  nftRoyalty,
  nftRoyaltyAccount,
  nftRoyaltyFee,
  nftRoyaltyMinimum,
  nftCollectionPrice,
  nftCollectionApproved
};
