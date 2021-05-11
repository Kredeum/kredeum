<?php
/**
 * IPFS INSERT and UPSERT
 *
 * @package kredeum/nfts
 */

/**
 * IPFS upsert file
 *
 * @param string $post_id Id post.
 *
 * @return string CID hash
 */
function ipfs_upsert( $post_id ) {
	$file = ipfs_get_attached_file_meta( $post_id );
	if ( '' === $file->cid ) {
		$cid = ipfs_insert( $post_id, $file->filename );
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
function ipfs_insert( $post_id ) {
	if ( defined( 'IPFS_NFT_STORAGE_KEY' ) ) {
		$cid = ipfs_add_and_pin_nft_storage( $post_id );
	} elseif ( defined( 'IPFS_PINATA_SECRET' ) ) {
		$cid = ipfs_add_and_pin_pinata( $post_id );
	} else {
		$cid = ipfs_add( $post_id );
		ipfs_pin( $cid );
	}
	update_post_meta( $post_id, 'cid', $cid );
	return $cid;
}
