<?php
/**
 * Post front based on NFT collection
 *
 * @package kredeum/nfts
 */

namespace KredeumNFTs\PostFront;

add_filter(
    'the_content',
    function ($content) {
        if (is_single()) {
            global $post;
            $nft_contract_address = get_post_meta($post->ID, '_krd_text_field', true);
    
            if (!empty($nft_contract_address)) {
                $content = "<div id='nft-owner-content' style='display: none;'>" . $content . "</div>";
                $content .= "<div id='nft-error-message' style='display: none;'>" .
                    "You don't own any NFT from this collection. Please purchase one to view this content" .
                    "<br><br><a href='https://app.kredeum.com/#/matic/" . $nft_contract_address . "' target='_blank'>Link to purchase of this NFT</a>" .
                    "</div>";
            }
        }
    
        return $content;
    }
);


