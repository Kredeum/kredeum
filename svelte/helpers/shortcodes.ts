import type { NftType } from "@lib/common/types";
import { nftName } from "@lib/common/config";

const copyToClipboard = (data: string): void => {
  navigator.clipboard.writeText(data).catch(() => console.info("Not copied"));
  console.info("Copied");
};

const getShortcodeOpenSeaCode = (_nft: NftType): string =>
  `[kredeum_sell chain="${_nft.chainName}" collection="${_nft.address}" tokenid="${_nft.tokenID}" cid="${
    _nft.image
  }" image=50]${nftName(_nft)}[/kredeum_sell]`;

const shortcode = (_nft: NftType) => {
  const data = getShortcodeOpenSeaCode(_nft);

  copyToClipboard(data);
};

const getAutoMarketWidgetCode = (
  _nft: NftType
): string => `<div class="kredeum-nft-automarket" chainid="${_nft.chainId}" address="${_nft.address}" tokenID="${_nft.tokenID}" platform="wordpress">
<script defer src="./assets/kredeum-nfts.js"></script>
<script>
var newLink = document.createElement("link");
newLink.href = "./assets/kredeum-nfts.css";
newLink.rel = "stylesheet";
newLink.type = "text/css";
document.getElementsByTagName("head")[0].appendChild(newLink);
var newLink2 = document.createElement("link");
newLink2.href = "./assets/css/front.css";
newLink2.rel = "stylesheet";
newLink2.type = "text/css";
document.getElementsByTagName("head")[0].appendChild(newLink2);
</script></div>`;

const autoMarketWidget = (_nft: NftType) => {
  const data = getAutoMarketWidgetCode(_nft);

  copyToClipboard(data);
};

const getShortcodeBuyCode = (_nft: NftType): string =>
  `[kredeum_nft_automarket chainid="${_nft.chainId}" address="${_nft.address}" tokenid="${_nft.tokenID}"]${nftName(
    _nft
  )}[/kredeum_nft_automarket]`;

const shortcodeBuy = (_nft: NftType) => {
  const data = getShortcodeBuyCode(_nft);

  copyToClipboard(data);
};

export {
  getShortcodeOpenSeaCode,
  shortcode,
  getAutoMarketWidgetCode,
  autoMarketWidget,
  getShortcodeBuyCode,
  shortcodeBuy
};
