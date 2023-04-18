<?php
/**
 * Decentralized Storage auto upload
 *
 * @package kredeum/nfts
 */

namespace KredeumNFTs\Storage;

/**
 * Decentralized Storage new action
 * archive Decentralized Storage on media upload
 */
if ( STORAGE_AUTO ) {
	add_action(
		'add_attachment',
		function ( $post_id ) {
			return upsert( $post_id );
		}
	);
}