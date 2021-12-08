<?php
/**
 * IPFS columns
 *
 * @package kredeum/nfts
 */

namespace KredeumNFTs\Ipfs;

/**
 *  IPFS 2 columns filter
 */
add_filter(
	'manage_media_columns',
	function ( $columns ) {
		$columns['kredeum-nfts-nft'] = __( 'KREDEUM NFTs', 'kredeum-nfts' ) . wp_nonce_field( 'ajax-token', 'knonce' );
		$columns['kredeum-nfts-cid'] = __( 'IPFS Archive', 'kredeum-nfts' );
		return $columns;
	}
);

/**
 *  IPFS 2 columns action
 */
add_action(
	'manage_media_custom_column',
	function ( $name ) {
		global $post;

		if ( 'kredeum-nfts-cid' === $name ) {
			if ( $post->_kredeum_ntfs_cid ) {
				echo wp_kses( link( $post->_kredeum_ntfs_cid, substr( $post->_kredeum_ntfs_cid, 0, 12 ) . '...' ), array( 'a' => array( 'href' => array() ) ) );
			}
		}

		if ( 'kredeum-nfts-nft' === $name ) {
			if ( $post->_kredeum_ntfs_nid ) {
				printf( '<a href="/wp-admin/admin.php?page=nfts" nid=' . esc_attr( $post->_kredeum_ntfs_nid ) . '>NFT link</a>' );
			} else {

				$metadata = get_metadata( 'post', $post->ID );
				// $metadata['post'] = get_post( $post->ID );

				printf(
					'<div class="kredeum-nfts-mint"'
					// . ' key="' . esc_attr( KREDEUM_NFTS_IPFS_NFT_STORAGE_KEY ) . '"'
					. ' src="' . esc_url( url( $post->_kredeum_ntfs_cid ) ) . '"'
					. ' pid="' . esc_attr( $post->ID ) . '"'
					. ' cid="' . esc_attr( $post->_kredeum_ntfs_cid ) . '"'
					. ' collection="' . esc_attr( KREDEUM_NFTS_DEFAULT_COLLECTION ) . '"'
					. ' metadata="' . esc_attr( json_encode( $metadata ) ) . '"'
					. ' alt="' . esc_attr( $post->post_title ) . '"/>'
				);
			}
		}
	}
);
