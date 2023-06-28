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
	$columns['kre-post-nft'] = __( 'NFT Article', 'kredeum-nfts' ) . wp_nonce_field( 'ajax-token', 'knonce' );
	$columns['kre-post-uri'] = __( 'Archive', 'kredeum-nfts' );
	return $columns;
});

/**
 *  Posts storage 2 columns action
 */
add_action(
	'manage_posts_custom_column',
	function ($name) {
		global $post;
		
		$pdf_id = $post->_kre_pdf_id;
		
		if ($name === 'kre-post-uri') {
			if($pdf_id) {
				$pdf = get_post($pdf_id);
				echo wp_kses( link( $pdf->_kre_uri, short_uri( $pdf->_kre_uri ) ), array( 'a' => array( 'href' => array() ) ) );
				echo '<br>';
				echo wp_kses( '<a href="' . wp_get_attachment_url($pdf_id) . '">> view PDF file</a>', array( 'a' => array( 'href' => array() ) ) );
			}
		}
		
		if ($name === 'kre-post-nft') {
			$nid = '';
			if ( $post->_kre_nid ) {
				$nid = $post->_kre_nid;
			}
						
			$metadata = get_metadata( 'post', $post->ID );

			if($pdf_id) {
				echo(
					'<div class="kredeum-mint-button" txt="true"'
					. ' src="' . esc_attr( get_the_post_thumbnail_url($post->ID) ) . '"'
					. ' pid="' . esc_attr( $post->ID ) . '"'
					. ' nid="' . esc_attr( $nid ) . '"'
					. ' metadata="' . esc_attr( wp_json_encode( $metadata ) ) . '"'
					. ' alt="' . esc_attr( $post->post_title ) . '"'
					. ' pdf="' . esc_attr( wp_get_attachment_url($pdf_id) ) . '"'
					. ' posttitle="' . esc_attr( $post->post_title ) . '"'
					. ' postcontent="' . esc_attr( (apply_filters('the_content', $post->post_content)) ) . '"'
					. ' postauthor="' . esc_attr( get_the_author_meta('display_name', $post->post_author) ) . '"'
					. ' postdate="' . esc_attr( get_the_date('', $post->ID) ) . '"'
					. '/>'
				);
			}
		}
	},
	10,
	2
);