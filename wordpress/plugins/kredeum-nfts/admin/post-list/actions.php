<?php
/**
 * Posts archive
 *
 * @package kredeum/nfts
 */

namespace KredeumNFTs\Storage;

/**
 * Posts bulk archive action
 */
add_filter(
	'bulk_actions-edit-post',
	function ( $bulk_actions ) {
		$bulk_actions['kre-post-archive'] = __( 'Archive post to Storage', 'kredeum-nfts' );
		return $bulk_actions;
	}
);

/**
 * Storage bulk archive bulk action
 */
add_filter(
	'handle_bulk_actions-edit-post',
	function ( $redirect_url, $action, $post_ids ) {
		$na = 0; // number of archived files.
		$nm = 0; // number of modified files.
		$nu = 0; // number of unchanged files.
		if ( 'kre-post-archive' === $action ) {
			// foreach ( $post_ids as $post_id ) {
			// 	$file = get_attached_file_meta( $post_id );
			// 	$uri  = insert( $post_id );
			// 	if ( $file->uri ) {
			// 		if ( $file->uri === $uri ) {
			// 			$nu++;
			// 		} else {
			// 			$nm++;
			// 		}
			// 	} else {
			// 		$na++;
			// 	}
			// }
			// $redirect_url = add_query_arg( 'bulk_archived', $na, $redirect_url );
			// $redirect_url = add_query_arg( 'bulk_modified', $nm, $redirect_url );
			// $redirect_url = add_query_arg( 'bulk_unchanged', $nu, $redirect_url );
		}
		return $redirect_url;
	},
	10,
	3
);