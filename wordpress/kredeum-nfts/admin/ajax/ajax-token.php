<?php
/**
 *
 * Ajax token actions
 *
 * @package kredeum/nfts
 */

namespace KredeumNFTs\Ajax;

/**
 * Add action enqueue
 */
add_action(
	'admin_enqueue_scripts',
	function () {
		wp_enqueue_script( 'ajax-token', plugin_dir_url( __FILE__ ) . 'ajax-token.js', array(), KREDEUM_NFTS_VERSION, true );
	},
	100
);

/**
 * Add action token
 */
add_action(
	'wp_ajax_token',
	function () {
		check_ajax_referer( 'get-token-id', 'security' );

		if ( isset( $_POST['pid'] ) && isset( $_POST['tokenId'] ) ) {
			$res = add_post_meta(
				sanitize_text_field( wp_unslash( $_POST['pid'] ) ),
				'tokenId',
				sanitize_text_field( wp_unslash( $_POST['tokenId'] ) ),
				true
			);
			echo esc_html( var_dump( $res ) );
		};

		wp_die();
	}
);
