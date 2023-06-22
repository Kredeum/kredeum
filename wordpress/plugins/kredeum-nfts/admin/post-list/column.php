<?php
/**
 * Posts columns
 *
 * @package kredeum/nfts
 */

namespace KredeumNFTs\Storage;

/// Posts
add_filter('manage_posts_columns', function ($columns) {
	$columns['kre-post-archive'] = __( 'Article archive', 'article-archive' );
	$columns['kre-post-uri'] = __( 'Article uri', 'article-uri' );
	return $columns;
});


add_action(
	'manage_posts_custom_column',
	function ($column, $post_id) {
		if ($column === 'kre-post-uri') {
			$post_metadatas = wp_get_attachment_metadata($post_id);
			
			if($post_metadatas && $post_metadatas['pdf_id']) {
				$pdf = get_post($post_metadatas['pdf_id']);
				// var_dump($pdf->_kre_uri); //die();
				echo wp_kses( link( $pdf->_kre_uri, short_uri( $pdf->_kre_uri ) ), array( 'a' => array( 'href' => array() ) ) );
			}
			// echo '<a href="#" class="button">Archive</a>';
		}
	},
	10,
	2
	// function ( $name ) {
	// 	global $post;

	// 	if ( 'kre-post-uri' === $name ) {
	// 		if ( $post->_kre_uri ) {
	// 			echo wp_kses( link( $post->_kre_uri, short_uri( $post->_kre_uri ) ), array( 'a' => array( 'href' => array() ) ) );
	// 		}
	// 	}

	// 	// if ( 'kre-nft' === $name ) {
	// 	// 	$nid = '';
	// 	// 	if ( $post->_kre_nid ) {
	// 	// 		$nid = $post->_kre_nid;
	// 	// 	}

	// 	// 	$metadata = get_metadata( 'post', $post->ID );

	// 	// 	printf(
	// 	// 		'<div class="kredeum-mint-button" txt="true"'
	// 	// 		. ' src="' . esc_attr( wp_get_attachment_url( $post->ID ) ) . '"'
	// 	// 		. ' pid="' . esc_attr( $post->ID ) . '"'
	// 	// 		. ' nid="' . esc_attr( $nid ) . '"'
	// 	// 		. ' metadata="' . esc_attr( wp_json_encode( $metadata ) ) . '"'
	// 	// 		. ' alt="' . esc_attr( $post->post_title ) . '"'
	// 	// 		. '/>'
	// 	// 	);
	// 	// }
	// }
);