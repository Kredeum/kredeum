<?php
/**
 *  Add IPFS content at bottom of post
 *
 * @package kredeum/nfts
 */

namespace KredeumNFTs\Ipfs;

add_filter(
	'the_content',
	function ( $content ) {
		if ( is_singular() && in_the_loop() && is_main_query() ) {
			$content .= links();
		}
		return $content;
	}
);
