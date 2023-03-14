<?php
/**
 * The [kredeum-sell] shortcode.
 *
 * @package kredeum/nfts
 */

namespace KredeumNFTs\Shortcode;

/**
 * Get buy shortcode
 * Will display buy nfts vards.
 *
 * @param array  $atts    Shortcode attributes. Default empty.
 * @param string $content Shortcode content. Default null.
 * @param string $tag     Shortcode tag (name). Default empty.
 * @return string Shortcode output.
 *
 * @package kredeum/nfts
 */
add_shortcode(
	'kredeum_automarket',
	function ( $atts = array(), $content = null, $tag = '' ) {
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

		$o  = '<div id="kredeum-automarket" chainid="' . $args['chainid'] . '" address="' . $args['address'] . '" tokenid="' . $args['tokenid'] . '" platform="wordpress">';
		$o .= '</div>';
		return $o;
	}
);
