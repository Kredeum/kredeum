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

/**
 * Add action token
 */
add_action(
	'wp_ajax_token',
	function () {
		check_ajax_referer( 'ajax-token', 'security' );

		if ( isset( $_POST['pid'] ) && isset( $_POST['nid'] ) ) {
			$pid = sanitize_text_field( wp_unslash( $_POST['pid'] ) );
			$nid = sanitize_text_field( wp_unslash( $_POST['nid'] ) );
			 add_post_meta( $pid, '_kre_nid', $nid, true );
		};

		echo esc_html( "wp_ajax_token $pid $nid" );

		wp_die();
	}
);

/**
 * Add action address
 */
add_action(
	'wp_ajax_address',
	function () {
		check_ajax_referer( 'ajax-address', 'security' );

		$user_id = get_current_user_id();
		if ( isset( $_POST['address'] ) ) {
			update_user_meta( $user_id, 'ADDR', sanitize_text_field( wp_unslash( $_POST['address'] ) ) );
		}

		echo esc_html( 'wp_ajax_address ' . get_user_meta( $user_id, 'ADDR' )[0] );

		wp_die();
	}
);


/**
 * Add action import
 */
add_action(
	'wp_ajax_import',
	function () {
		check_ajax_referer( 'ajax-import', 'security' );

		if ( isset( $_POST['nft'] ) ) {

			$nft = json_decode( sanitize_text_field( wp_unslash( $_POST['nft'] ) ) );
			$pid = \KredeumNfts\Ipfs\import_nft( $nft );

		}

		echo esc_html( "wp_ajax_import $pid" );

		wp_die();
	}
);
