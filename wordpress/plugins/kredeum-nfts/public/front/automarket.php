<?php
/**
 *
 * Load javascript and css file on front if shortcode on page.
 *
 * @package kredeum/nfts
 */

namespace KredeumNFTs;

/**
 * Enqueue kredeum's js and styles if the kredeum_opensky shortcode is being used.
 */
add_action(
	'wp_enqueue_scripts',
	function () {
		global $post;
		if ( is_a( $post, 'WP_Post' ) && ( has_shortcode( $post->post_content, 'kredeum_opensky' ) || has_shortcode( $post->post_content, 'kredeum_automarket' ) ) ) {
			wp_enqueue_script( 'kredeum_nfts', KREDEUM_NFTS_PLUGIN_URL . 'lib/js/kredeum-nfts.js', array(), KREDEUM_NFTS_VERSION, true );
			wp_register_style( 'kredeum_nfts_css', KREDEUM_NFTS_PLUGIN_URL . 'lib/js/kredeum-nfts.css', KREDEUM_NFTS_VERSION, true );
			wp_enqueue_style( 'kredeum_nfts_css' );
			wp_register_style( 'kredeum_nfts_front_css', KREDEUM_NFTS_PLUGIN_URL . 'lib/css/front.css', KREDEUM_NFTS_VERSION, true );
			wp_enqueue_style( 'kredeum_nfts_front_css' );
		}
	},
	110
);
