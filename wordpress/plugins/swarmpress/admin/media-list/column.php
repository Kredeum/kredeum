<?php
/**
 * Storage columns
 *
 * @package swarmpress
 */

namespace SwarmPress\Storage;

/**
 *  Storage 2 columns filter
 */
add_filter(
	'manage_media_columns',
	function ( $columns ) {
		$columns['kre-nft'] = __( 'NFTs', 'swarmpress' ) . wp_nonce_field( 'ajax-token', 'knonce' );
		$columns['kre-cid'] = __( 'Decentralized Archive', 'swarmpress' );
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
			if ( $post->{SWARM_STORAGE_REF} ) {
				echo wp_kses(
					link( $post->{SWARM_STORAGE_REF}, substr( $post->{SWARM_STORAGE_REF}, 0, 12 ) . '...' ),
					array(
						'a'  => array( 'href' => array() ),
						'br' => '',
					)
				);
			}
		}

		if ( 'kre-nft' === $name ) {
			if ( $post->_kre_nid ) {
				printf( '<a href="/wp-admin/admin.php?page=nfts" nid=' . esc_attr( $post->_kre_nid ) . '>NFT link</a>' );
			} else {

				$metadata = get_metadata( 'post', $post->ID );

				printf(
					'<div class="' . esc_attr( SWARM_STORAGE ) . '-mint"'
					// . ' ipfs="' . esc_url( url( $post->_kre_cid ) ) . '"'
					// . ' cid="' . esc_url( $post->_kre_cid ) . '"'
					. ' src="' . esc_attr( wp_get_attachment_url( $post->ID ) ) . '"'
					. ' pid="' . esc_attr( $post->ID ) . '"'
					. ' metadata="' . esc_attr( wp_json_encode( $metadata ) ) . '"'
					. ' alt="' . esc_attr( $post->post_title ) . '"'
					. esc_attr( get_optional_storage_attrs() )
					. ' storage="' . esc_attr( SWARM_STORAGE )
					. '"/>'
				);
			}
		}
	}
);
