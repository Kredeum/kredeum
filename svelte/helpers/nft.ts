import type { ReceiverType, NftType } from "@lib/common/types";
import { ZeroAddress } from "ethers";
import { nftGetImageLink } from "@lib/nft/nft-get-metadata";
import { config, DEFAULT_NAME, explorerUrl, getExplorer, textShort, urlToLink } from "@lib/common/config";
import { feeAmount } from "@helpers/collection";

const nftChainId = (nft: NftType): number => Number(nft?.chainId || 1);
const nftOwner = (nft: NftType): string => String(nft?.owner || "");

const nftOnSale = (nft: NftType): boolean => nftPrice(nft) > 0n;
const nftPrice = (nft: NftType): bigint => nft?.price || 0n;
const nftPriceMin = (nft: NftType): bigint => nftRoyaltyMinimum(nft) * 2n;

const nftMarketable = (nft: NftType): boolean => Boolean(nft?.collection?.supports?.IOpenMarketable);
const nftRoyalty = (nft: NftType): ReceiverType => nft?.royalty || null;
const nftRoyaltyAccount = (nft: NftType): string => String(nft?.royalty?.account || ZeroAddress);
const nftRoyaltyFee = (nft: NftType): number => Number(nft?.royalty?.fee || 0);
const nftRoyaltyMinimum = (nft: NftType): bigint => nft?.royalty?.minimum || 0n;

const nftCollectionPrice = (nft: NftType): bigint => nft?.collection?.price || 0n;
const nftCollectionApproved = (nft: NftType, address: string): boolean =>
  Boolean(nft?.collection?.approvedForAll?.get(address) || false);

const nftMediaContentType = (nft: NftType): string => nft?.contentType?.split("/")[0];
const nftMediaAnimationUrl = (nft: NftType): string => nft?.animation_url;
const nftMediaSrc = (nft: NftType): string => nftGetImageLink(nft);
const nftMediaAlt = (nft: NftType): string => {
  const contentType = nftMediaContentType(nft);
  return contentType === "text" ? "image" : contentType;
};

const nftPriceValid = (nft: NftType, price = 0n): boolean =>
  price >= feeAmount(price, config.treasury.fee) + nftRoyaltyMinimum(nft);

const nftName = (nft: NftType): string => nft?.name || `${nft?.collection?.name || DEFAULT_NAME} #${nft?.tokenID}`;
const nftCollectionName = (nft: NftType): string => `${nft?.collection?.name || DEFAULT_NAME}`;
const nftDescription = (nft: NftType): string => (nft?.name != nft?.description && nft?.description) || nftName(nft);
const nftDescriptionShort = (nft: NftType, n = 16): string => textShort(nftDescription(nft), n, 0);

// NFT URL
const nftExplorerUrl = (nft: NftType): string => {
  let url = "";
  if (!nft) return url;

  const explorer = getExplorer(nft.chainId);
  if (!explorer) return url;

  if (explorer?.includes("blockscout.com")) {
    // https://blockscout.com/xdai/mainnet/token/0x22C1f6050E56d2876009903609a2cC3fEf83B415/instance/3249859/metadata
    url = explorerUrl(nft.chainId, `/token/${nft.address}/instance/${nft.tokenID}/metadata`);
  } else {
    // https://etherscan.io/token/0x82a398243EBc2CB26a4A21B9427EC6Db8c224471?a=1
    url = explorerUrl(nft.chainId, `/token/${nft.address}?a=${nft.tokenID}`);
  }
  return url;
};

// NFT helpers
const nftExplorerLink = (nft: NftType, label?: string): string => urlToLink(nftExplorerUrl(nft), label || nftName(nft));

export {
  nftName,
  nftExplorerUrl,
  nftExplorerLink,
  nftCollectionName,
  nftDescription,
  nftDescriptionShort,
  nftPriceValid,
  nftChainId,
  nftOwner,
  nftOnSale,
  nftPrice,
  nftPriceMin,
  nftMarketable,
  nftRoyalty,
  nftRoyaltyAccount,
  nftRoyaltyFee,
  nftRoyaltyMinimum,
  nftCollectionPrice,
  nftCollectionApproved,
  nftMediaContentType,
  nftMediaAnimationUrl,
  nftMediaSrc,
  nftMediaAlt
};
