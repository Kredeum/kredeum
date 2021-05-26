// https://codex.wordpress.org/AJAX_in_Plugins

jQuery(document).ready(function ($) {
  //console.log('ajax-token.js present v27');

  const mediasNftsMint = document.querySelectorAll("kredeum-nft-mint");
  mediasNftsMint.forEach(function (Item) {
    Item?.$on("token", function (e) {
      const minted = {
        chain_id: e.detail.minted.chainId,
        address: e.detail.minted.address,
        token_id: e.detail.minted.tokenId
      };

      const data = {
        action: "token",
        minted: JSON.stringify(minted),
        pid: $(this).attr("pid"),
        security: document.querySelector("#knonce").getAttribute("value")
      };

      console.log("AJAX CALL", data);
      jQuery.post(ajaxurl, data, function (response) {
        console.log("AJAX RESPONSE", JSON.stringify(response));
      });
    });
  });
});
