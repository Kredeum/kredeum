import type { NftType } from "@lib/common/types";

const widgetAutoMarket = (
  _nft: NftType
): string => `<div id="kredeum-automarket" chainid="${_nft.chainId}" address="${_nft.address}" tokenid="${_nft.tokenID}" platform="wordpress">
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

export { widgetAutoMarket };
