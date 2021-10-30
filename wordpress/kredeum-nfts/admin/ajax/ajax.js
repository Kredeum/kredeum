/**
 * Ajax js file
 *
 * Reference : https://codex.wordpress.org/AJAX_in_Plugins
 *
 * @package kredeum/nfts
 */

const { Console } = require("console");

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
  document.querySelectorAll("kredeum-mint").forEach(function (kredeumNftsMint) {
    kredeumNftsMint.$on("token", function (e) {
      _ajax({
        action: "token",
        nid: e.detail.nid,
        pid: kredeumNftsMint.pid
      });
    });
  });

  if ((kredeumNfts = document.getElementById("kredeum-nfts"))) {
    // ACTION CREATE_COLLECTION
    kredeumNfts.$on("collection", function (e) {
      _ajax({
        action: "collection",
        collection: e.detail.collection
      });
    });

    // ACTION IMPORT_NFT
    kredeumNfts.$on("import", function (e) {
      _ajax({
        action: "import",
        nft: JSON.stringify(e.detail.nft)
      });
    });
  }
});
