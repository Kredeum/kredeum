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
		$columns['kre-cid'] = __( 'Decentralized Archive', 'kredeum-nfts' );
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
			if ( $post->_kre_swarmref ) {
				echo wp_kses( \KredeumNFTs\Swarm\link( $post->_kre_swarmref, substr( $post->_kre_swarmref, 0, 12 ) . '...' ), array( 'a' => array( 'href' => array() ) ) );
			}
		}

		if ( 'kre-nft' === $name ) {
			if ( $post->_kre_nid ) {
				printf( '<a href="/wp-admin/admin.php?page=nfts" nid=' . esc_attr( $post->_kre_nid ) . '>NFT link</a>' );
			} else {

				$metadata = get_metadata( 'post', $post->ID );

				$media_mint_class = 'kredeum-nfts-mint';
				if ( SWARM_ARCHIVE ) {
					$media_mint_class = 'kredeum-nfts-mint-swarm';
				}

				printf(
					'<div class="' . esc_attr( $media_mint_class ) . '"'
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
