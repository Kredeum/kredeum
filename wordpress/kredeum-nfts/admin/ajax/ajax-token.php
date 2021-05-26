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

		if ( isset( $_POST['pid'] ) && isset( $_POST['minted'] ) ) {

			$pid    = sanitize_text_field( wp_unslash( $_POST['pid'] ) );
			$minted = json_decode( sanitize_text_field( wp_unslash( $_POST['minted'] ) ) );
			echo esc_html( var_dump( $minted ) );

			if ( isset( $minted->chain_id ) ) {
				$res = add_post_meta( $pid, '_kre_chain_id', $minted->chain_id, true );
				echo esc_html( var_dump( $res ) );
			}

			if ( isset( $minted->address ) ) {
				$res = add_post_meta( $pid, '_kre_address', $minted->address, true );
				echo esc_html( var_dump( $res ) );
			}

			if ( isset( $minted->token_id ) ) {
				$res = add_post_meta( $pid, '_kre_token_id', $minted->token_id, true );
				echo esc_html( var_dump( $res ) );
			}
		};

		wp_die();
	}
);
