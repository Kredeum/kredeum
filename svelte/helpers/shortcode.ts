import type { NftType } from "@lib/common/types";
import { nftName } from "@lib/common/config";

const shortcodeAutoMarket = (_nft: NftType): string =>
  `[kredeum_automarket chainid="${_nft.chainId}" address="${_nft.address}" tokenid="${_nft.tokenID}"]${nftName(
    _nft
  )}[/kredeum_automarket]`;

export { shortcodeAutoMarket };
