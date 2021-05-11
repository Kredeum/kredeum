<?php
/**
 *
 * Ajax token actions
 *
 * @package kredeum/nfts
 */

/**
 * Add action enqueue
 */
add_action(
	'admin_enqueue_scripts',
	function () {
		wp_enqueue_script( 'ajax-token', plugin_dir_url( __FILE__ ) . 'ajax-token.js', array(), 42, true );
	},
	100
);

/**
 * Add action token
 */
add_action(
	'wp_ajax_token',
	function () {
		check_ajax_referer( 'nonce_action', 'security' );

		// check_ajax_referer('token-security-string', 'security');
		// $data = wp_get_attachment_metadata( $_POST['pid']); // get the data structured
		// $data['tokenId'] = $_POST['tokenId'];  // change the values you need to change
		// $res = wp_update_attachment_metadata( $_POST['pid'], $data );  // save it back to the db
		// .

		if ( isset( $_POST['pid'] ) && isset( $_POST['tokenId'] ) ) {
			$res = add_post_meta(
				sanitize_text_field( wp_unslash( $_POST['pid'] ) ),
				'tokenId',
				sanitize_text_field( wp_unslash( $_POST['tokenId'] ) ),
				true
			);
			// echo var_dump( $res ); .
		};

		wp_die();
	}
);
// update_user_meta( $user_id, 'A DDR', sanitize_text_field( wp_unslash( $_POST['address'] ) ) ); .
