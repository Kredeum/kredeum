import type { NftType } from "@lib/common/types";
import { nftName } from "@lib/common/config";


const shortcodeOpenSky = (_nft: NftType): string =>
  `[kredeum_opensky chainid="${_nft.chainId}" address="${_nft.address}" tokenid="${_nft.tokenID}"]
    ${nftName(_nft)}
  [/kredeum_opensky]`;

export {  shortcodeOpenSky };
