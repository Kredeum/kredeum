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
 * Storage insert file
 *
 * @param string $post_id Id post.
 *
 * @return string CID hash
 */
function insert( $post_id ) {
	// $cid = upload_on_storage( $post_id );
	$upload_on_storage = __NAMESPACE__ . '\\' . ucfirst( STORAGE ) . '\insert';
	$cid               = $upload_on_storage( $post_id );

	update_post_meta( $post_id, get_storage_ref(), $cid );
	return $cid;
}
