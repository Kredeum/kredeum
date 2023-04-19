<?php
/**
 * Storage INSERT and UPSERT
 *
 * @package kredeum/nfts
 */

namespace KredeumNFTs\Storage;

/**
 * Storage upsert file
 *
 * @param string $post_id Id post.
 *
 * @return string URI hash
 */
function upsert( $post_id ) {
	$file = get_attached_file_meta( $post_id );
	if ( '' === $file->uri ) {
		$uri = insert( $post_id, $file->filename );
	}
	return $uri;
}

/**
 * Storage insert file
 *
 * @param string $post_id Id post.
 *
 * @return string URI hash
 */
function insert( $post_id ) {
	if ( defined( 'STORAGE_CHOICE' ) ) {
		switch ( STORAGE_CHOICE ) {
			case 'IPFS':
				if ( defined( 'NFT_STORAGE_KEY' ) ) {
					$uri = 'ipfs://' . nft_storage_add_and_pin( $post_id );
				}
				break;
			case 'SWARM':
				if ( defined( 'SWARM_NODE_URL' ) && defined( 'SWARM_BATCH_ID' ) ) {
					$uri = 'swarm://' . swarm_add_and_pin( $post_id );
				}
				break;
		}

		update_post_meta( $post_id, '_kre_uri', $uri );
		return $uri;
	}
}
