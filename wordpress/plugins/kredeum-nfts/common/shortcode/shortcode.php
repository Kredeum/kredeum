<?php
/**
 * The [kredeum-sell] shortcode.
 *
 * @package kredeum/nfts
 */

namespace KredeumNFTs\Shortcode;

/**
 * Add Shortcode Callback
 *
 * @param array  $atts    Shortcode attributes.
 * @param string $content Shortcode content. Default null.
 * @param string $tag     Shortcode tag (name). Default empty.
 * @return string Shortcode output.
 *
 * @package kredeum/nfts
 */
function add_shortcode_callback( $atts = array(), $content = null, $tag = '' ) {
	// Normalize attribute keys, lowercase.
	$atts = array_change_key_case( (array) $atts, CASE_LOWER );

	// Override default attributes with user attributes.
	$args = shortcode_atts(
		array(
			'chainid' => '',
			'address' => '',
			'tokenid' => '',
		),
		$atts
	);

	$o  = '<div id="' . str_replace( '_', '-', $tag ) . '" chainid="' . $args['chainid'] . '" address="' . $args['address'] . '" tokenid="' . $args['tokenid'] . '">';
	$o .= '</div>';
	return $o;
};

/**
 * Get kredeum_opensky shortcode
 * Will display buy nfts vards.
 *
 * @param array  $atts    Shortcode attributes.
 * @param string $content Shortcode content. Default null.
 * @param string $tag     Shortcode tag (name). Default empty.
 * @return string Shortcode output.
 *
 * @package kredeum/nfts
 */
add_shortcode(
	'kredeum_opensky',
	'KredeumNFTs\Shortcode\add_shortcode_callback'
);

/**
 * Get kredeum_automarket shortcode
 * Will display buy nfts vards.
 *
 * @param array  $atts    Shortcode attributes.
 * @param string $content Shortcode content. Default null.
 * @param string $tag     Shortcode tag (name). Default empty.
 * @return string Shortcode output.
 *
 * @package kredeum/nfts
 */
add_shortcode(
	'kredeum_automarket',
	'KredeumNFTs\Shortcode\add_shortcode_callback'
);


///////////////////////////////////////////////////////


add_shortcode(
	'kredeum_donate',
	'KredeumNFTs\Shortcode\add_shortcode_donate'
);

function add_shortcode_donate( $atts = array(), $content = null, $tag = '' ) {
	// Normalize attribute keys, lowercase.
	$atts = array_change_key_case( (array) $atts, CASE_LOWER );

	// Override default attributes with user attributes.
	$args = shortcode_atts(
		array(
			'receiveraddress' => '',
		),
		$atts
	);

	$o  = '<div id="' . str_replace( '_', '-', $tag ) . '" receiveraddress="' . $args['receiveraddress'] . '">';
	$o .= '</div>';
	return $o;
};

// [kredeum_donate receiveraddress="Youpla !!"][/kredeum_donate]

/**
 * Enqueue kredeum's js and styles if the kredeum_opensky shortcode is being used.
 */
add_action(
	'wp_enqueue_scripts',
	function () {
		global $post;
		if ( is_a( $post, 'WP_Post' ) && ( has_shortcode( $post->post_content, 'kredeum_donate' ) ) ) {
			wp_enqueue_script( 'kredeum_nfts', KREDEUM_NFTS_PLUGIN_URL . 'dist-js-web3Donate/web3Donate.iife.js', array(), KREDEUM_NFTS_VERSION, true );
			// wp_register_style( 'kredeum_nfts_css', KREDEUM_NFTS_PLUGIN_URL . 'assets/js/kredeum-nfts.css', KREDEUM_NFTS_VERSION, true );
			// wp_enqueue_style( 'kredeum_nfts_css' );
		}
	},
	110
);