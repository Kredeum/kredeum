<?php
/**
 * IPFS new
 *
 * @package kredeum/nfts
 */

/**
 * IPFS new action
 * archive IPFS on media upload
 */
if ( IPFS_AUTO ) {
	add_action(
		'add_attachment',
		function ( $post_id ) {
			return ipfs_upsert( $post_id );
		}
	);
}
