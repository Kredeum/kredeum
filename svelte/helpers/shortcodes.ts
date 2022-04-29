import type { NftType } from "lib/ktypes";
import { nftName } from "lib/kconfig";

const shortcode = async (_nft: NftType) => {
  const data = `[kredeum_sell chain="${_nft.chainName}" collection="${_nft.address}" tokenid="${_nft.tokenID}" ipfs="${
    _nft.ipfs
  }"]${nftName(_nft)}[/kredeum_sell]`;

  await navigator.clipboard.writeText(data).catch(() => console.log("Not copied"));
  console.log("Copied");
};

export { shortcode };
