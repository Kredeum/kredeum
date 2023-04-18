<?php
/**
 * IPFS INSERT and UPSERT
 *
 * @package kredeum/nfts
 */

namespace KredeumNFTs\Storage;

/**
 * IPFS upsert file
 *
 * @param string $post_id Id post.
 *
 * @return string CID hash
 */
function upsert( $post_id ) {
	$file = get_attached_file_meta( $post_id );
	if ( '' === $file->cid ) {
		$cid = insert( $post_id, $file->filename );
	}
	return $cid;
}

/**
 * IPFS insert file
 *
 * @param string $post_id Id post.
 *
 * @return string CID hash
 */
function insert( $post_id ) {
	if (defined('STORAGE_CHOICE')) {
		switch (STORAGE_CHOICE) {
			case "IPFS":
				if ( defined( 'NFT_STORAGE_KEY' ) ) {
					$cid = nft_storage_add_and_pin( $post_id );
				}
				break;
			case "SWARM":
				//TODO if defined
				$cid = swarm_add_and_pin( $post_id );
				break;
		}
		
		update_post_meta( $post_id, '_kre_cid', $cid );
		return $cid;
	}
}