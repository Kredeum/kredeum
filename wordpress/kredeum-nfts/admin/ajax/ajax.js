/**
 * Ajax js file
 *
 * Reference : https://codex.wordpress.org/AJAX_in_Plugins
 *
 * @package kredeum/nfts
 */

function _ajax(data) {
  data.security = document.querySelector("#knonce")?.getAttribute("value");
  console.log("AJAX CALL", data);

  jQuery.post(ajaxurl, data, function (response) {
    console.log("AJAX RESPONSE", response);
  });
}

jQuery(document).ready(function () {
  // ACTION GET_ADDRESS
  const kredeumMetamask = document.querySelector("kredeum-metamask");
  kredeumMetamask?.$on("address", function (e) {
    _ajax({
      action: "address",
      address: e.detail.address
    });
  });

  // ACTION MINT_TOKEN
  document.querySelectorAll("kredeum-nft-mint").forEach(function (kredeumNftMint) {
    kredeumNftMint.$on("token", function (e) {
      _ajax({
        action: "token",
        minted: JSON.stringify({
          chain_id: e.detail.minted.chainId,
          address: e.detail.minted.contract,
          token_id: e.detail.minted.tokenID
        }),
        pid: kredeumNftMint.pid
      });
    });
  });

  // ACTION IMPORT_NFT
  document.querySelectorAll("kredeum-nft").forEach(function (kredeumNft) {
    kredeumNft.$on("import", function (e) {
      _ajax({
        action: "import",
        url: e.detail.url
      });
    });
  });
});
