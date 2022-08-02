<?php
/**
 * IPFS auto upload
 *
 * @package swarmpress
 */

namespace SwarmPress\Storage;

/**
 * IPFS new action
 * archive IPFS on media upload
 */
if ( SWARM_AUTO_ARCHIVE ) {
	add_action(
		'add_attachment',
		function ( $post_id ) {
			return upsert( $post_id );
		}
	);
}
