import type { NftType } from "../common/types";
import { type ReceiverType } from "../common/types";
import { MAX_FEE, feeAmount, treasuryFee } from "../common/config";

import { nftGetImageLink } from "../nft/nft-get-metadata";
import { ADDRESS_ZERO } from "../common/config";
import { type Address } from "viem";

const nftChainId = (nft: NftType): number => Number(nft?.chainId || 1);
const nftOwner = (nft: NftType): Address => nft?.owner || ADDRESS_ZERO;

const nftOnSale = (nft: NftType): boolean => nftPrice(nft) > 0n;
const nftPrice = (nft: NftType): bigint => BigInt(nft?.price || 0n);
const nftRoyalty = (nft: NftType): ReceiverType => nft?.royalty || {};
const nftRoyaltyAccount = (nft: NftType): Address => nft?.royalty?.account || ADDRESS_ZERO;
const nftRoyaltyFee = (nft: NftType): bigint => BigInt(nft?.royalty?.fee || 0);

const nftRoyaltyAmount = (nft: NftType): bigint => feeAmount(nft?.price, nft?.royalty?.fee);
const nftRoyaltyMinimum = (nft: NftType): bigint => BigInt(nft?.royalty?.minimum || 0n);

const nftFeeAmount = (nft: NftType): bigint => feeAmount(nft?.price, treasuryFee());
const nftFeeMinimum = (nft: NftType): bigint => {
  // P = R + F // P = price // R = royalty // F = fee
  // F = P * f // f = fee %
  // Pmin = Rmin + Fmin // Pmin = price minimum // Rmin = royalty minimum // Fmin = fee minimum
  // Pmin = RMin + Pmin * f
  // Pmin * ( 1 - f ) = Rmin
  // Pmin = Rmin / ( 1 - f )
  // Fmin = RMin * f / ( 1 - f )
  const f = treasuryFee();
  return (nftRoyaltyMinimum(nft) * f) / (MAX_FEE - f);
};

const nftRoyaltyAndFeeAmount = (nft: NftType): bigint => pnftaunftRoyaltyAmount(nft) + nftFeeAmount(nft);
const nftRoyaltyAndFeeMinimum = (nft: NftType): bigint => nftRoyaltyMinimum(nft) + nftFeeMinimum(nft);

const nftPriceValid = (nft: NftType, price = 0n): boolean => price >= nftRoyaltyAndFeeMinimum(nft);

const nftMarketable = (nft: NftType): boolean => Boolean(nft?.collection?.supports?.get("IOpenMarketable"));

const nftCollectionPrice = (nft: NftType): bigint => BigInt(nft?.collection?.price || 0n);
const nftCollectionApproved = (nft: NftType, address: Address): boolean => {
  const approvedForAll = nft?.collection?.approvedForAll || null;
  return approvedForAll instanceof Map ? approvedForAll.has(address as string) : false;
};

const nftMediaContentType = (nft: NftType): string => nft?.contentType?.split("/")[0] || "";
const nftMediaAnimationUrl = (nft: NftType): string => nft?.animation_url || "";
const nftMediaSrc = (nft: NftType): string => nftGetImageLink(nft);
const nftMediaAlt = (nft: NftType): string => {
  const contentType = nftMediaContentType(nft);
  return contentType === "text" ? "image" : contentType;
};

export {
  nftChainId,
  nftOwner,
  nftOnSale,
  nftPrice,
  nftRoyalty,
  nftRoyaltyAccount,
  nftRoyaltyFee,
  nftRoyaltyAmount,
  nftRoyaltyMinimum,
  nftFeeAmount,
  nftFeeMinimum,
  nftRoyaltyAndFeeAmount,
  nftRoyaltyAndFeeMinimum,
  nftPriceValid,
  nftMarketable,
  nftCollectionPrice,
  nftCollectionApproved,
  nftMediaContentType,
  nftMediaAnimationUrl,
  nftMediaSrc,
  nftMediaAlt
};
