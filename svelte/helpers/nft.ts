import type { ReceiverType, NftType } from "@lib/common/types";
import { config } from "@lib/common/config";

import { BigNumber, constants } from "ethers";
import { nftGetImageLink } from "@lib/nft/nft-get-metadata";
import { feeAmount } from "./collection";

const nftChainId = (nft: NftType): number => Number(nft?.chainId || 1);
const nftOwner = (nft: NftType): string => String(nft?.owner || "");

const nftOnSale = (nft: NftType): boolean => nftPrice(nft).gt(0);
const nftPrice = (nft: NftType): BigNumber => BigNumber.from(nft?.price || 0);
const nftRoyalty = (nft: NftType): ReceiverType => nft?.royalty || null;
const nftRoyaltyAccount = (nft: NftType): string => String(nft?.royalty?.account || constants.AddressZero);
const nftRoyaltyFee = (nft: NftType): number => Number(nft?.royalty?.fee || 0);

const nftRoyaltyAmount = (nft: NftType): BigNumber => feeAmount(nft?.price, nft?.royalty?.fee);
const nftRoyaltyMinimum = (nft: NftType): BigNumber => BigNumber.from(nft?.royalty?.minimum || 0);

const nftFeeAmount = (nft: NftType): BigNumber => feeAmount(nft?.price, config?.treasury?.fee);
const nftFeeMinimum = (nft: NftType): BigNumber => feeAmount(nftRoyaltyMinimum(nft), config?.treasury?.fee);

const nftRoyaltyAndFeeAmount = (nft: NftType): BigNumber => nftRoyaltyAmount(nft).add(nftFeeAmount(nft));
const nftRoyaltyAndFeeMinimum = (nft: NftType): BigNumber => nftRoyaltyMinimum(nft).add(nftFeeMinimum(nft));

const nftPriceValid = (nft: NftType, price = BigNumber.from(0)): boolean => price.gte(nftRoyaltyAndFeeMinimum(nft));

const nftMarketable = (nft: NftType): boolean => Boolean(nft?.collection?.supports?.IOpenMarketable);

const nftCollectionPrice = (nft: NftType): BigNumber => BigNumber.from(nft?.collection?.price || 0);
const nftCollectionApproved = (nft: NftType, address: string): boolean =>
  Boolean(nft?.collection?.approvedForAll?.get(address) || false);

const nftMediaContentType = (nft: NftType): string => nft?.contentType?.split("/")[0];
const nftMediaAnimationUrl = (nft: NftType): string => nft?.animation_url;
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
