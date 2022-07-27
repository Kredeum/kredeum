<?php
/**
 * SWARM INSERT and UPSERT
 *
 * @package kredeum/nfts
 */

namespace KredeumNFTs\Storage\Swarm;

/**
 * SWARM insert file
 *
 * @param string $post_id Id post.
 *
 * @return string CID hash
 */
function insert( $post_id ) {
	if ( defined( 'SWARM_NODE_URL' ) && defined( 'SWARM_BATCH_ID' ) ) {
		$cid = swarm_add_and_pin( $post_id );
	}
	return $cid;
}
