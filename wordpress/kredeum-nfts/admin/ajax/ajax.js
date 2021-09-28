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

  if ((kredeumNft = document.querySelector("kredeum-nft"))) {
    // ACTION CREATE_COLLECTION
    kredeumNft.$on("collection", function (e) {
      _ajax({
        action: "collection",
        collection: e.detail.collection
      });
    });

    // ACTION IMPORT_NFT
    kredeumNft.$on("import", function (e) {
      _ajax({
        action: "import",
        nft: JSON.stringify(e.detail.nft)
      });
    });
  }
});
