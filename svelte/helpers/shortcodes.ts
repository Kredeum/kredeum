import type { NftType } from "@lib/common/ktypes";
import { nftName } from "@lib/common/kconfig";

const shortcode = async (_nft: NftType) => {
  const data = `[kredeum_sell chain="${_nft.chainName}" collection="${_nft.address}" tokenid="${_nft.tokenID}" cid="${
    _nft.image
  }" image=50]${nftName(_nft)}[/kredeum_sell]`;

  await navigator.clipboard.writeText(data).catch(() => console.info("Not copied"));
  console.info("Copied");
};

const shortcodeBuy = async (_nft: NftType) => {
  const data = `[kredeum_automarket_button chainid="${_nft.chainId}" address="${_nft.address}" tokenid="${
    _nft.tokenID
  }"]${nftName(_nft)}[/kredeum_automarket_button]`;

  await navigator.clipboard.writeText(data).catch(() => console.info("Not copied"));
  console.info("Copied");
};

export { shortcode, shortcodeBuy };
