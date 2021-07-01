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
		if ( $post->_kre_cid ) {
			if ( 'kre-cid' === $name ) {
				echo wp_kses( link( $post->_kre_cid, substr( $post->_kre_cid, 0, 12 ) . '...' ), array( 'a' => array( 'href' => array() ) ) );
			} elseif ( 'kre-nft' === $name ) {
				$token_id = get_post_meta( $post->ID, '_kre_token_id' );
				if ( isset( $token_id[0] ) ) {
					printf( '<a href="/wp-admin/admin.php?page=nfts" token-id=' . esc_attr( $token_id[0] ) . '>NFT created</a>' );
				} else {
					printf(
						'<kredeum-nft-mint'
						  . ' key="' . esc_attr( IPFS_NFT_STORAGE_KEY ) . '"'
							. ' src="' . esc_url( url( $post->_kre_src ) ) . '"'
							. ' pid="' . esc_attr( $post->ID ) . '"'
							. ' cid="' . esc_attr( $post->_kre_cid ) . '"'
							. ' nid="' . esc_attr( $post->_kre_nid ) . '"'
							. ' alt="' . esc_attr( $post->post_title ) . '"/>'
					);
				}
			}
		}
	}
);
