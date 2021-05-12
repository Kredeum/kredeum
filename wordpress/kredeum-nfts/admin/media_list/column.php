<?php
/**
 * IPFS columns
 *
 * @package kredeum/nfts
 */

/**
 *  IPFS 2 columns filter
 */
add_filter(
	'manage_media_columns',
	function ( $columns ) {
		$columns['nft'] = __( 'KREDEUM NFTs', 'kredeum-nfts' );
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
				echo wp_kses( ipfs_link( $post->cid, substr( $post->cid, 0, 12 ) . '...' ), array( 'a' => array( 'href' => array() ) ) );
			} elseif ( 'nft' === $name ) {
				if ( get_post_meta( $post->ID, 'tokenId' )[0] ) {
					printf( '<a href="/wp-admin/admin.php?page=nfts" krd-nft=' . esc_attr( get_post_meta( $post->ID, 'tokenId' )[0] ) . '>NFT created</a>' );
				} else {
					printf(
						'<kredeum-nft-mint minted'
						. ' pid="' . esc_attr( $post->ID ) . '"'
						. ' src="' . esc_url( ipfs_url( $post->cid ) ) . '"'
						. ' alt="' . esc_attr( $post->post_title ) . '"/>'
					);
				}
			}
		}
	}
);
