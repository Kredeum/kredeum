<?php
/**
 * Storage INSERT and UPSERT
 *
 * @package kredeum/nfts
 */

namespace KredeumNFTs\Storage;

/**
 * Storage upsert file
 *
 * @param string $post_id Id post.
 *
 * @return string URI hash
 */
function upsert( $post_id ) {
	$file = get_attached_file_meta( $post_id );
	if ( '' === $file->uri ) {
		$uri = insert_post( $post_id, $file->filename );
	}
	return $uri;
}

/**
 * Storage insert post
 *
 * @param string $post_id Id post.
 *
 * @return string URI hash
 */
function insert_post( $post_id ) {
	$file         = file_get_contents( get_attached_file( $post_id ) );
	$content_type = get_post_mime_type( $post_id );

	$uri = insert( $file, $content_type, $post_id );

	return $uri;
}

  /**
   * Storage insert file
   *
   * @param string $file file.
   * @param string $content_type file's content type.
   * @param string $post_id post attached file.
   *
   * @return string URI hash
   */
function insert( $file, $content_type, $post_id ) {
	if ( defined( 'STORAGE_CHOICE' ) ) {
		switch ( STORAGE_CHOICE ) {
			case 'ipfs':
				$uri = 'ipfs://' . nft_storage_add_and_pin( $file );
				break;
			case 'swarm':
				$uri = 'swarm://' . swarm_add_and_pin( $file, $content_type );
				break;
		}
		update_post_meta( $post_id, '_kre_uri', $uri );
	}
	return $uri;
}
