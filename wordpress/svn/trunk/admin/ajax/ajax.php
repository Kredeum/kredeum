<?php
/**
 * Ajax actions
 *
 * Reference : https://codex.wordpress.org/AJAX_in_Plugins
 *
 * @package kredeum/nfts
 */

namespace KredeumNFTs\Ajax;

/**
 * Add actions
 */
add_action(
	'admin_enqueue_scripts',
	function () {
		wp_enqueue_script( 'ajax', plugin_dir_url( __FILE__ ) . 'ajax.js', array(), KREDEUM_NFTS_VERSION, true );
	},
	100
);


add_action(
	'wp_ajax_address',
	function () {
		check_ajax_referer( 'get-address', 'security' );

		$user_id = get_current_user_id();
		if ( isset( $_POST['address'] ) ) {
			update_user_meta( $user_id, 'ADDR', sanitize_text_field( wp_unslash( $_POST['address'] ) ) );
		}

		echo esc_html( sanitize_text_field( wp_unslash( $_POST['address'] ) ) );
		echo ' => ' . esc_html( get_user_meta( $user_id, 'ADDR' )[0] );
		wp_die();
	}
);
