<?php
/**
 * IPFS auto upload
 *
 * @package kredeum/nfts
 */

namespace KredeumNFTs\Storage;

/**
 * IPFS new action
 * archive IPFS on media upload
 */
if ( AUTO_ARCHIVE ) {
	add_action(
		'add_attachment',
		function ( $post_id ) {
			return upsert( $post_id );
		}
	);
}
