<?php
/**
 * Public IPFS CID function
 *
 * @package kredeum/nfts
 */

namespace KredeumNFTs\Ipfs;

/**
 * Get file metadata
 *
 * @param int $post_id postId.
 * @return object cid and filename
 * @package kredeum/nfts
 */
function get_attached_file_meta( $post_id ) {
	$ret = new \stdClass();

	$ret->cid      = get_post_meta( $post_id, 'cid', true );
	$ret->filename = basename( get_post_meta( $post_id, '_wp_attached_file', true ) );

	return $ret;
}
