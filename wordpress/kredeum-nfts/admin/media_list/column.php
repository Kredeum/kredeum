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
		$columns['nft'] = __( 'KREDEUM NFTs', 'kredeum-nfts' ) . wp_nonce_field( 'get-token-id', 'knonce' );
		$columns['cid'] = __( 'IPFS Archive', 'kredeum-nfts' );
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
		if ( $post->cid ) {
			if ( 'cid' === $name ) {
				echo wp_kses( link( $post->cid, substr( $post->cid, 0, 12 ) . '...' ), array( 'a' => array( 'href' => array() ) ) );
			} elseif ( 'nft' === $name ) {
				$token_id = get_post_meta( $post->ID, 'tokenId' );
				if ( isset( $token_id[0] ) ) {
					printf( '<a href="/wp-admin/admin.php?page=nfts" krd-nft=' . esc_attr( $token_id[0] ) . '>NFT created</a>' );
				} else {
					printf(
						'<kredeum-nft-mint'
						  . ' key="' . esc_attr( IPFS_NFT_STORAGE_KEY ) . '"'
							. ' pid="' . esc_attr( $post->ID ) . '"'
							. ' src="' . esc_url( url( $post->cid ) ) . '"'
							. ' alt="' . esc_attr( $post->post_title ) . '"/>'
					);
				}
			}
		}
	}
);
