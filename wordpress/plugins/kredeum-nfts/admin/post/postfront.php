<?php
/**
 * Post front based on NFT collection
 *
 * @package kredeum/nfts
 */

namespace KredeumNFTs\PostFront;

function my_theme_add_text_before_content($content) {
    if (is_single() || is_archive() || is_home()) {
        $text_to_add = '<p>Text to add before post content.</p>';
        $content = $text_to_add . $content;
    }
    return $content;
}

add_filter(
    'the_content',
    function ($content) {
        if (is_single() || is_category() || is_archive() || is_home()) {
            global $post;
            $nft_contract_address = get_post_meta($post->ID, '_krd_text_field', true);
            if (!empty($nft_contract_address)) {
                $content = base64_encode($content);
                $content = "<div id='krd-nft-access-" . $nft_contract_address . "' class='krd-collection-id' krd-collection-id='" . $nft_contract_address . "'>" .
                "<div id='nft-owner-content' style='display: none;'><div id='nft-owner-content-in'>" . 
                $content . 
                "</div><br><a href='https://app.kredeum.com/#/matic/" . $nft_contract_address . "' target='_blank'>Link to your NFT allowing access to this content.</a>" .
                "</div>";
                $content .= "<div id='nft-error-message' style='display: none;'>" .
                "You don't own any NFT to access this content. Please purchase one to view this content" .
                "<br><br><a href='https://app.kredeum.com/#/matic/" . $nft_contract_address . "' target='_blank'>Link to purchase a NFT to access this content</a>" .
                "</div>";
                $content .= "<div class='metamask-notconnected-message' style='display: none;'>" .
                "You can't access this content as not connected to Metamask, please open Metamask first and reload the page." .
                "</div>";   
                $content .= "<div class='metamask-notinstalled-message' style='display: none;'>" .
                "You can't access this content as not connected to Metamask, please install and open Metamask first." .
                "<br><br><a href='https://metamask.io/download/' target='_blank'>Link to install Metamask</a>" .
                "</div>";
                $content .= "</div>";
            }
        }
        return $content;
    }
);






