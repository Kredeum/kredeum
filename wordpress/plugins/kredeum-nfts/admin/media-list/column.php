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
		$columns['kre-nft'] = __( 'KREDEUM NFTs', 'kredeum-nfts' ) . wp_nonce_field( 'ajax-token', 'knonce' );
		$columns['kre-cid'] = __( 'IPFS Archive', 'kredeum-nfts' );
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

		if ( 'kre-cid' === $name ) {
			if ( $post->_kre_cid ) {
				echo wp_kses( link( $post->_kre_cid, substr( $post->_kre_cid, 0, 12 ) . '...' ), array( 'a' => array( 'href' => array() ) ) );
			}
		}

		if ( 'kre-nft' === $name ) {
			if ( $post->_kre_nid ) {
				printf( '<a href="/wp-admin/admin.php?page=nfts/#/' . esc_attr( str_replace( 'nft://', '', $post->_kre_nid ) ) . '" nid=' . esc_attr( $post->_kre_nid ) . '>NFT link</a>' );
			} else {

				$metadata = get_metadata( 'post', $post->ID );

				printf(
					'<div class="kredeum-nfts-mint"'
					// . ' ipfs="' . esc_url( url( $post->_kre_cid ) ) . '"'
					// . ' cid="' . esc_url( $post->_kre_cid ) . '"'
					. ' src="' . esc_attr( wp_get_attachment_url( $post->ID ) ) . '"'
					. ' pid="' . esc_attr( $post->ID ) . '"'
					. ' metadata="' . esc_attr( wp_json_encode( $metadata ) ) . '"'
					. ' alt="' . esc_attr( $post->post_title ) . '"/>'
				);
			}
		}
	}
);
