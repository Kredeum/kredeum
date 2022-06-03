<?php
/**
 * The [kredeum-sell] shortcode.
 *
 * @package kredeum/nfts
 */

namespace KredeumNFTs\Shortcode;

/**
 * Get shortcode
 * Accepts a title and will display a box.
 *
 * @param array  $atts    Shortcode attributes. Default empty.
 * @param string $content Shortcode content. Default null.
 * @param string $tag     Shortcode tag (name). Default empty.
 * @return string Shortcode output.
 *
 * @package kredeum/nfts
 */
add_shortcode(
	'kredeum_sell',
	function ( $atts = array(), $content = null, $tag = '' ) {
		// Normalize attribute keys, lowercase.
		$atts = array_change_key_case( (array) $atts, CASE_LOWER );

		// Override default attributes with user attributes.
		$args = shortcode_atts(
			array(
				'chain'      => '',
				'collection' => '',
				'tokenid'    => '',
				'cid'        => '',
				'image'      => '',
			),
			$atts
		);

		// var_dump($args['image']); .

		$o  = '<div>';
		$o .= ' <a href="https://opensea.io/assets/' . $args['chain'] . '/' . $args['collection'] . '/' . $args['tokenid'] . '" target="_blank">';
		$o .= ' <button class="kredeum-sell btn btn-small btn-sell"';
		$o .= ' collection="' . $args['collection'] . '"';
		$o .= ' tokenid="' . $args['tokenid'] . '">';
		$o .= 'Buy NFT: ' . $content;
		$o .= '</button></a>';
		if ( isset( $args['image'] ) && ( $args['image'] > 0 ) ) {
			$o .= '<br><br><div><img src="' . $args['cid'] . '" width="' . $args['image'] . '%"></img></div>';
		}
		$o .= '</div>';
		return $o;
	}
);



add_shortcode(
	'kredeum_transfert',
	function ( $atts = array(), $content = null, $tag = '' ) {
		// Normalize attribute keys, lowercase.
		$atts = array_change_key_case( (array) $atts, CASE_LOWER );

		// Override default attributes with user attributes.
		$args = shortcode_atts(
			array(
				'chainid'    => '',
				'collection' => '',
				'tokenid'    => '',
				'account'    => '',
				'cid'        => '',
				'image'      => '',
			),
			$atts
		);

		// $props = str_replace( "\"", "-", json_encode($args));
		$props = esc_attr( json_encode( $args ) );

		$o  = '<div id="kredeum-wpfront" data-props="' . $props . '">';
		$o .= '</div>';
		return $o;
	}
);
