// https://codex.wordpress.org/AJAX_in_Plugins

jQuery(document).ready(function ($) {
  //console.log('ajax-token.js present v27');

  const mediasNftsMint = document.querySelectorAll("kredeum-nft-mint");
  mediasNftsMint.forEach(function (Item) {
    Item?.$on("token", function (e) {
      console.log("change mint button v2");
      var data = {
        action: "token",
        tokenId: e.detail.tokenId,
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
