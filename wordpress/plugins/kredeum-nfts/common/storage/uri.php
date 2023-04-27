<?php
/**
 * Public Storage URI function
 *
 * @package kredeum/nfts
 */

namespace KredeumNFTs\Storage;

/**
 * Get file metadata
 *
 * @param int $post_id postId.
 * @return object uri and filename
 * @package kredeum/nfts
 */
function get_attached_file_meta( $post_id ) {
	$ret = new \stdClass();

	$ret->uri      = get_post_meta( $post_id, '_kre_uri', true );
	$ret->filename = basename( get_post_meta( $post_id, '_wp_attached_file', true ) );

	return $ret;
}
