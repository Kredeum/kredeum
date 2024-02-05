import type { ReceiverType, NftType } from "../common/types";
import { MAX_FEE, feeAmount, treasuryFee } from "../common/config";

import { BigNumber } from "ethers";
import { nftGetImageLink } from "../nft/nft-get-metadata";
import { ADDRESS_ZERO } from "../common/config";

const nftChainId = (nft: NftType): number => Number(nft?.chainId || 1);
const nftOwner = (nft: NftType): string => String(nft?.owner || "");

const nftOnSale = (nft: NftType): boolean => nftPrice(nft).gt(0);
const nftPrice = (nft: NftType): BigNumber => BigNumber.from(nft?.price || 0);
const nftRoyalty = (nft: NftType): ReceiverType => nft?.royalty || {};
const nftRoyaltyAccount = (nft: NftType): string => String(nft?.royalty?.account || ADDRESS_ZERO);
const nftRoyaltyFee = (nft: NftType): number => Number(nft?.royalty?.fee || 0);

const nftRoyaltyAmount = (nft: NftType): BigNumber => feeAmount(nft?.price, nft?.royalty?.fee);
const nftRoyaltyMinimum = (nft: NftType): BigNumber => BigNumber.from(nft?.royalty?.minimum || 0);

const nftFeeAmount = (nft: NftType): BigNumber => feeAmount(nft?.price, treasuryFee());
const nftFeeMinimum = (nft: NftType): BigNumber => {
  // P = R + F // P = price // R = royalty // F = fee
  // F = P * f // f = fee %
  // Pmin = Rmin + Fmin // Pmin = price minimum // Rmin = royalty minimum // Fmin = fee minimum
  // Pmin = RMin + Pmin * f
  // Pmin * ( 1 - f ) = Rmin
  // Pmin = Rmin / ( 1 - f )
  // Fmin = RMin * f / ( 1 - f )
  const f = treasuryFee();
  return nftRoyaltyMinimum(nft)
    .mul(f)
    .div(MAX_FEE - f);
};

const nftRoyaltyAndFeeAmount = (nft: NftType): BigNumber => nftRoyaltyAmount(nft).add(nftFeeAmount(nft));
const nftRoyaltyAndFeeMinimum = (nft: NftType): BigNumber => nftRoyaltyMinimum(nft).add(nftFeeMinimum(nft));

const nftPriceValid = (nft: NftType, price = BigNumber.from(0)): boolean => price.gte(nftRoyaltyAndFeeMinimum(nft));

const nftMarketable = (nft: NftType): boolean => Boolean(nft?.collection?.supports?.get("IOpenMarketable"));

const nftCollectionPrice = (nft: NftType): BigNumber => BigNumber.from(nft?.collection?.price || 0);
const nftCollectionApproved = (nft: NftType, address: string): boolean => {
  const approvedForAll = nft?.collection?.approvedForAll || null;
  return approvedForAll instanceof Map ? approvedForAll.has(address) : false;
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
