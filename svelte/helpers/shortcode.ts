import type { NftType } from "@lib/common/types";
import { nftName, nftCollectionName } from "@lib/common/config";

const shortcodeOpenSkyCollection = (nft: NftType): string =>
  `[kredeum_opensky chainid="${nft.chainId}" address="${nft.address}"]${nftCollectionName(nft)}[/kredeum_opensky]`;

const shortcodeOpenSkyNFT = (nft: NftType): string =>
  `[kredeum_opensky chainid="${nft.chainId}" address="${nft.address}" tokenid="${nft.tokenID}"]${nftName(
    nft
  )}[/kredeum_opensky]`;

const shortcodeOpenSky = (nft: NftType, coll: boolean): string =>
  coll ? shortcodeOpenSkyCollection(nft) : shortcodeOpenSkyNFT(nft);

export { shortcodeOpenSky, shortcodeOpenSkyNFT, shortcodeOpenSkyCollection };
