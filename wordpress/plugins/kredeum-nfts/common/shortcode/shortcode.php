<?php
/**
 * The [kredeum-sell] shortcode.
 *
 * @package kredeum/nfts
 */

namespace KredeumNFTs\Shortcode;

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
