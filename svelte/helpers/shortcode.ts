import type { NftType } from "@lib/common/types";
import { nftName, nftCollectionName } from "@lib/common/config";

const shortcodeOpenSkyCollection = (nft: NftType): string =>
  `[kredeum_opensky chainid="${nft.chainId}" address="${nft.address}"]${nftCollectionName(nft)}[/kredeum_opensky]`;

const shortcodeOpenSkyNft = (nft: NftType): string =>
  `[kredeum_opensky chainid="${nft.chainId}" address="${nft.address}" tokenid="${nft.tokenID}"]${nftName(
    nft
  )}[/kredeum_opensky]`;

const shortcodeOpenSky = (nft: NftType, coll = false): string =>
  coll ? shortcodeOpenSkyCollection(nft) : shortcodeOpenSkyNft(nft);

export { shortcodeOpenSky, shortcodeOpenSkyNft, shortcodeOpenSkyCollection };
