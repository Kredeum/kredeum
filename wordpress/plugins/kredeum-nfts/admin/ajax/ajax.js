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
  console.info("AJAX CALL", data);
  ajaxResponse = false;

  jQuery.post(ajaxurl, data, function (response) {
    console.info("AJAX RESPONSE", response);
    ajaxResponse = true;
  });
}

jQuery(document).ready(function () {
  // ACTION MINT_TOKEN
  document.addEventListener("token", (e) => {
    _ajax({
      action: "token",
      nid: e.detail.nid,
      pid: e.detail.pid,
      cid: e.detail.cid,
    });
  });

  const kredeumNfts = document.querySelector("#kredeum-dapp");
  if (kredeumNfts?.$on) {
    // ACTION CREATE_COLLECTION
    kredeumNfts.$on("collection", function (e) {
      _ajax({
        action: "collection",
        collection: e.detail.collection,
      });
    });

    // ACTION IMPORT_NFT
    kredeumNfts.$on("import", function (e) {
      _ajax({
        action: "import",
        nft: JSON.stringify(e.detail.nft),
      });
    });
  }
});
