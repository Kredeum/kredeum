<?php
/**
 * The [kredeum-sell] shortcode.
 *
 * Accepts a title and will display a box.
 *
 * @param array  $atts    Shortcode attributes. Default empty.
 * @param string $content Shortcode content. Default null.
 * @param string $tag     Shortcode tag (name). Default empty.
 * @return string Shortcode output.
 * 
 * @package kredeum/nfts
 * 
 */

namespace KredeumNFTs\Shortcode;

function kredeum_sell_shortcode( $atts = [], $content = null, $tag = '' ) {
    // normalize attribute keys, lowercase
    $atts = array_change_key_case( (array) $atts, CASE_LOWER );
 
    // override default attributes with user attributes
    $kredeum_sell_atts = shortcode_atts(
        array(
            'collection' => '',
            'tokenid' => '',            
        ), $atts, $tag
    );
 
    $o = '<button class="kredeum-sell btn btn-small btn-sell"';
    $o .= ' collection="' . $collection . '"';
    $o .= ' tokenid="' . $tokenid . '">';
    $o .= 'Buy NFT: ' . $content;
    $o .= '</button>';
    return $o;
}

add_shortcode( 'kredeum_sell', 'kredeum_sell_shortcode' );

function kredeumsell_shortcode( $atts) {
    return "test";
}

add_shortcode( 'kredeumsell', 'kredeumsell_shortcode' );

/**
 * Central location to create all shortcodes.
 */
//function kredeum_sell_shortcode_init() {
//    add_shortcode( 'kredeumsell', 'kredeum_sell_shortcode');
//}

//add_action( 'init', 'kredeum_sell_shortcode_init' );
