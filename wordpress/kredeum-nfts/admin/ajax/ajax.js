/**
 * Ajax js file
 *
 * Reference : https://codex.wordpress.org/AJAX_in_Plugins
 *
 * @package kredeum/nfts
 */

jQuery( document ).ready(
	function () {
		document.querySelector( "kredeum-metamask" ) ? .$on(
			"address",
			function () {
				var data = {
					action: "address",
					address: document.querySelector( "kredeum-metamask" ).address,
					security: document.querySelector( "input[name = nonce_field]" ).getAttribute( "value" )
				};
				console.log( "AJAX CALL", data );

				jQuery.post(
					ajaxurl,
					data,
					function (response) {
						console.log( "AJAX RESPONSE", response );
					}
				);
			}
		);
	}
);
