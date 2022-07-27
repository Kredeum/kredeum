<?php
/**
 * Storage columns
 *
 * @package kredeum/nfts
 */

namespace KredeumNFTs\Storage;

/**
 *  Storage 2 columns filter
 */
add_filter(
	'manage_media_columns',
	function ( $columns ) {
		$columns['kre-nft'] = __( 'KREDEUM NFTs', 'kredeum-nfts' ) . wp_nonce_field( 'ajax-token', 'knonce' );
		$columns['kre-cid'] = __( 'Decentralized Archive', 'kredeum-nfts' );
		return $columns;
	}
);

/**
 *  Storage 2 columns action
 */
add_action(
	'manage_media_custom_column',
	function ( $name ) {
		global $post;

		if ( 'kre-cid' === $name ) {
			if ( $post->{getStorageRef()} ) {
				echo wp_kses(
					link( $post->{getStorageRef()}, substr( $post->{getStorageRef()}, 0, 12 ) . '...' ),
					array( 'a' => array( 'href' => array() ) )
				);
			}
		}

		if ( 'kre-nft' === $name ) {
			if ( $post->_kre_nid ) {
				printf( '<a href="/wp-admin/admin.php?page=nfts" nid=' . esc_attr( $post->_kre_nid ) . '>NFT link</a>' );
			} else {

				$metadata = get_metadata( 'post', $post->ID );

				printf(
					'<div class="kredeum-nfts-mint"'
					// . ' ipfs="' . esc_url( url( $post->_kre_cid ) ) . '"'
					// . ' cid="' . esc_url( $post->_kre_cid ) . '"'
					. ' src="' . esc_attr( wp_get_attachment_url( $post->ID ) ) . '"'
					. ' pid="' . esc_attr( $post->ID ) . '"'
					. ' metadata="' . esc_attr( wp_json_encode( $metadata ) ) . '"'
					. ' alt="' . esc_attr( $post->post_title ) . '"'
					. esc_attr( getOptionalStorageAttrs() )
					. ' storage="' . esc_attr( STORAGE )
					. '"/>'
				);
			}
		}
	}
);
