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
		$columns['mint'] = __( 'MINT', 'kredeum-nfts' );
		$columns['cid']  = __( 'IPFS Archive', 'kredeum-nfts' );
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
			} elseif ( 'mint' === $name ) {
				printf( '<kredeum-nft-mint src="' . esc_url( ipfs_url( $post->cid ) ) . '" alt="' . esc_attr( $post->post_title ) . '"/>' );
			}
		}
	}
);
