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
		$columns['kre-nft'] = __( 'Kredeum NFTs', 'kredeum-nfts' ) . wp_nonce_field( 'ajax-token', 'knonce' );
		$columns['kre-uri'] = __( 'Archive', 'kredeum-nfts' );
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

		if ( 'kre-uri' === $name ) {
			if ( $post->_kre_uri ) {
				echo wp_kses( link( $post->_kre_uri, short_uri( $post->_kre_uri ) ), array( 'a' => array( 'href' => array() ) ) );
			}
		}

		if ( 'kre-nft' === $name ) {
			$nid = '';
			if ( $post->_kre_nid ) {
				$nid = $post->_kre_nid;
			}

			$metadata = get_metadata( 'post', $post->ID );

			printf(
				'<div class="kredeum-mint-button" txt="true"'
				. ' src="' . esc_attr( wp_get_attachment_url( $post->ID ) ) . '"'
				. ' pid="' . esc_attr( $post->ID ) . '"'
				. ' nid="' . esc_attr( $nid ) . '"'
				. ' metadata="' . esc_attr( wp_json_encode( $metadata ) ) . '"'
				. ' alt="' . esc_attr( $post->post_title ) . '"'
				. '/>'
			);
		}
	}
);