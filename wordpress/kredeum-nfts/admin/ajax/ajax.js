/**
 * Ajax js file
 *
 * Reference : https://codex.wordpress.org/AJAX_in_Plugins
 *
 * @package kredeum/nfts
 */

ajaxResponse = false;

function _ajax(data) {
  data.security = document.querySelector("#knonce")?.getAttribute("value");
  console.log("AJAX CALL", data);
  ajaxResponse = false;

  jQuery.post(ajaxurl, data, function (response) {
    console.log("AJAX RESPONSE", response);
    ajaxResponse = true;
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
        nid: e.detail.nid,
        pid: kredeumNftMint.pid
      });
    });
  });

  // ACTION IMPORT_NFT
  document.querySelectorAll("kredeum-nft").forEach(function (kredeumNft) {
    kredeumNft.$on("import", function (e) {
      _ajax({
        action: "import",
        src: e.detail.src,
        nid: e.detail.nid
      });
    });
  });
});
