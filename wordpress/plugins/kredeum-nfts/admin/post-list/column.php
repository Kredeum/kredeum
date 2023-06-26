<?php
/**
 * Posts columns
 *
 * @package kredeum/nfts
 */

namespace KredeumNFTs\Storage;

/**
 *  Posts storage 2 columns filter
 */
add_filter('manage_posts_columns', function ($columns) {
	$columns['kre-post-nft'] = __( 'Article NFT', 'kredeum-nfts' );
	$columns['kre-post-uri'] = __( 'Archive', 'kredeum-nfts' );
	return $columns;
});

/**
 *  Posts storage 2 columns action
 */
add_action(
	'manage_posts_custom_column',
	function ($column, $post_id) {
		if ($column === 'kre-post-uri') {
			$post_metadatas = wp_get_attachment_metadata($post_id);
			
			if($post_metadatas && $post_metadatas['pdf_id']) {
				$pdf = get_post($post_metadatas['pdf_id']);
				echo wp_kses( link( $pdf->_kre_uri, short_uri( $pdf->_kre_uri ) ), array( 'a' => array( 'href' => array() ) ) );
				echo '<br>';
				echo wp_kses( '<a href="' . wp_get_attachment_url($post_metadatas['pdf_id']) . '">> view file</a>', array( 'a' => array( 'href' => array() ) ) );
			}
		}
		
		if ($column === 'kre-post-nft') {
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
	},
	10,
	2
);