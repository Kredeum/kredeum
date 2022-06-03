<?php
/**
 * The front functions for Kredeum-nfts.
 *
 * @package kredeum/nfts
 */

namespace KredeumNFTs\clientfront;

add_action(
	'wp_enqueue_scripts',
	function () {

			wp_enqueue_script( 'kredeum_nfts', KREDEUM_NFTS_PLUGIN_URL . 'lib/js/kredeum-nfts.js', array(), KREDEUM_NFTS_VERSION, true );
			wp_register_style( 'kredeum_nfts_css', KREDEUM_NFTS_PLUGIN_URL . 'lib/css/kredeum-nfts.css', KREDEUM_NFTS_VERSION, true );
			wp_enqueue_style( 'kredeum_nfts_css' );

			wp_register_style( 'kredeum_nfts_front_css', KREDEUM_NFTS_PLUGIN_URL . 'lib/css/front.css', KREDEUM_NFTS_VERSION, true );
			wp_enqueue_style( 'kredeum_nfts_front_css' );
	},
	110
);
