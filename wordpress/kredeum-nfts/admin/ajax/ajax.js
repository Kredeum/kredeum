/**
 * Ajax js file
 *
 * Reference : https://codex.wordpress.org/AJAX_in_Plugins
 *
 * @package kredeum/nfts
 */

let knonce;

function _ajax(data) {
  data.security = knonce;
  console.log("AJAX CALL", data);

  jQuery.post(ajaxurl, data, function (response) {
    console.log("AJAX RESPONSE", response);
  });
}

jQuery(document).ready(function () {
  knonce = document.querySelector("#knonce").getAttribute("value");

  // ACTION GET_ADDRESS
  const kredeumMetamask = document.querySelector("kredeum-metamask");
  kredeumMetamask?.$on("address", function () {
    _ajax({
      action: "address",
      address: kredeumMetamask.address
    });
  });

  // ACTION MINT_TOKEN
  document.querySelectorAll("kredeum-nft-mint").forEach(function (kredeumNftMint) {
    kredeumNftMint?.$on("token", function (e) {
      _ajax({
        action: "token",
        minted: JSON.stringify({
          chain_id: e.detail.minted.chainId,
          address: e.detail.minted.address,
          token_id: e.detail.minted.tokenId
        }),
        pid: kredeumNftMint.pid
      });
    });
  });

  // ACTION IMPORT_NFT
  const importNft = document.querySelectorAll("import-nft");
  importNft?.$on("import", function (e) {
    _ajax({
      action: "import",
      url: importNft.url
    });
  });
});
