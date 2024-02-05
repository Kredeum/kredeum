import type { NftType } from "@kredeum/common/src/common/types";
import config from "@kredeum/config/dist/config.json";

const basePathAsset = `${config.base}/assets`;

const widgetOpenSkyScript = `<script defer src="${basePathAsset}/kredeum-nfts.js"></script>
<script>
  var newLink = document.createElement("link");
  newLink.href = "${basePathAsset}/kredeum-nfts.css";
  newLink.rel = "stylesheet";
  newLink.type = "text/css";
  document.getElementsByTagName("head")[0].appendChild(newLink);
  var newLink2 = document.createElement("link");
  newLink2.href = "${basePathAsset}/css/front.css";
  newLink2.rel = "stylesheet";
  newLink2.type = "text/css";
  document.getElementsByTagName("head")[0].appendChild(newLink2);
</script>`;

const widgetOpenSkyCollection = (_nft: NftType): string =>
  `<div id="kredeum-opensky" chainid="${_nft.chainId}" address="${_nft.address}">${widgetOpenSkyScript}</div>`;

const widgetOpenSkyNft = (_nft: NftType): string =>
  `<div id="kredeum-opensky" chainid="${_nft.chainId}" address="${_nft.address}" tokenid="${_nft.tokenID}">${widgetOpenSkyScript}</div>`;

const widgetOpenSky = (nft: NftType, coll: boolean): string =>
  coll ? widgetOpenSkyCollection(nft) : widgetOpenSkyNft(nft);

export { widgetOpenSky, widgetOpenSkyNft, widgetOpenSkyCollection };
