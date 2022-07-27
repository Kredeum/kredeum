<?php
/**
 * IPFS INSERT and UPSERT
 *
 * @package kredeum/nfts
 */

namespace KredeumNFTs\Storage\Ipfs;

/**
 * IPFS insert file
 *
 * @param string $post_id Id post.
 *
 * @return string CID hash
 */
function insert( $post_id ) {
	if ( defined( 'NFT_STORAGE_KEY' ) ) {
		$cid = nft_storage_add_and_pin( $post_id );
	}
	return $cid;
}
