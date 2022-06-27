<?php
/**
 * SWARM INSERT and UPSERT
 *
 * @package kredeum/nfts
 */

namespace KredeumNFTs\Swarm;

/**
 * SWARM upsert file
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
	update_post_meta( $post_id, '_kre_swarmref', $cid );
	return $cid;
}
