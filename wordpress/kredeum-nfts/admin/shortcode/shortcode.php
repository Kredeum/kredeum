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

add_shortcode( 'kredeum_sell', 'KredeumNFTs\Shortcode\kredeum_sell_shortcode' );

function kredeum_sell_shortcode( $atts = [], $content = null, $tag = '' ) {
    // normalize attribute keys, lowercase
    $atts = array_change_key_case( (array) $atts, CASE_LOWER );
 
    // override default attributes with user attributes
    $args = shortcode_atts(
        array(
            'chain' => '',            
            'collection' => '',
            'tokenid' => '',            
        ), $atts
    );
 
    $o = '<a href="https://opensea.io/assets/' .  $args['chain'] . '/' .  $args['collection'] . '/' .  $args['tokenid'] . '" target="_blank">';
    $o .= ' <button class="kredeum-sell btn btn-small btn-sell"';
    $o .= ' collection="' . $args['collection'] . '"';
    $o .= ' tokenid="' . $args['tokenid'] . '">';
    $o .= 'Buy NFT: ' . $content;
    $o .= '</button></a>';
    return $o;
}
