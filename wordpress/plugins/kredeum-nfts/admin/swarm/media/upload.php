<?php
/**
 * SWARM auto upload
 *
 * @package kredeum/nfts
 */

namespace KredeumNFTs\Swarm;

/**
 * SWARM new action
 * archive SWARM on media upload
 */
if ( AUTO_ARCHIVE ) {
	add_action(
		'add_attachment',
		function ( $post_id ) {
			return upsert( $post_id );
		}
	);
}
