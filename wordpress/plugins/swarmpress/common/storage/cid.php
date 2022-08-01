<?php
/**
 * Public Storage CID function
 *
 * @package swarmpress
 */

namespace SwarmPress\Storage;

/**
 * Get file metadata
 *
 * @param int $post_id postId.
 * @return object cid and filename
 * @package swarmpress
 */
function get_attached_file_meta( $post_id ) {
	$ret = new \stdClass();

	$ret->cid      = get_post_meta( $post_id, get_storage_ref(), true );
	$ret->filename = basename( get_post_meta( $post_id, '_wp_attached_file', true ) );

	return $ret;
}
