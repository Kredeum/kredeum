import type { NftType } from "@lib/common/ktypes";
import { nftName, config } from "@lib/common/kconfig";

const copyToClipboard = (data: string): void => {
  navigator.clipboard.writeText(data).catch(() => console.info("Not copied"));
  console.info("Copied");
};

const shortcode = async (_nft: NftType) => {
  const data = `[kredeum_sell chain="${_nft.chainName}" collection="${_nft.address}" tokenid="${_nft.tokenID}" cid="${
    _nft.image
  }" image=50]${nftName(_nft)}[/kredeum_sell]`;

  await navigator.clipboard.writeText(data).catch(() => console.info("Not copied"));
  console.info("Copied");
};

const getAutoMarketWidgetCode = (
  _nft: NftType
) => `<div class="kre-buy-front" chainid="${_nft.chainId}" address="${_nft.address}" tokenID="${_nft.tokenID}" platform="buy-external"></div>
<script defer src="${config.domain.latest}/assets/kredeum-nfts.js"></script>
<script>
var newLink = document.createElement("link");
newLink.href = "${config.domain.latest}/assets/kredeum-nfts.css";
newLink.rel = "stylesheet";
newLink.type = "text/css";
document.getElementsByTagName("head")[0].appendChild(newLink);
var newLink2 = document.createElement("link");
newLink2.href = "${config.domain.latest}/assets/css/front.css";
newLink2.rel = "stylesheet";
newLink2.type = "text/css";
document.getElementsByTagName("head")[0].appendChild(newLink2);
</script>`;

const autoMarketWidget = (_nft: NftType) => {
  const data = getAutoMarketWidgetCode(_nft);

  copyToClipboard(data);
};

export { shortcode, autoMarketWidget };
