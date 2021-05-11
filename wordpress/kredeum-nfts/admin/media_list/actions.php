<?php
/**
 * IPFS archive
 *
 * @package kredeum/nfts
 */

/**
 * IPFS bulk archive action
 */
add_filter(
	'bulk_actions-upload',
	function ( $bulk_actions ) {
		$bulk_actions['archive'] = __( 'Archive to IPFS', 'kredeum-nfts' );
		return $bulk_actions;
	}
);

/**
 * IPFS bulk archive bulk action
 */
add_filter(
	'handle_bulk_actions-upload',
	function ( $redirect_url, $action, $post_ids ) {
		$na = 0; // number of archived files.
		$nm = 0; // number of modified files.
		$nu = 0; // number of unchanged files.
		if ( 'archive' === $action ) {
			foreach ( $post_ids as $post_id ) {
				$file = ipfs_get_attached_file_meta( $post_id );
				$cid  = ipfs_insert( $post_id );
				if ( $file->cid ) {
					if ( $file->cid === $cid ) {
						$nu++;
					} else {
						$nm++;
					}
				} else {
					$na++;
				}
			}
			$redirect_url = add_query_arg( 'bulk_archived', $na, $redirect_url );
			$redirect_url = add_query_arg( 'bulk_modified', $nm, $redirect_url );
			$redirect_url = add_query_arg( 'bulk_unchanged', $nu, $redirect_url );
		}
		return $redirect_url;
	},
	10,
	3
);

/**
 * IPFS bulk archive notice
 */
add_action(
	'admin_notices',
	function () {
		if ( ! empty( $_REQUEST['bulk_archived'] ) ) {
			$archived_count = intval( $_REQUEST['bulk_archived'] );
			$medias         = _n( 'media', 'medias', $archived_count );
			printf(
				'<div id="message" class="notice notice-success is-dismissible"><p>%s %s archived to IPFS</p></div>',
				esc_html( $archived_count ),
				esc_html( $medias )
			);
		}
		if ( ! empty( $_REQUEST['bulk_modified'] ) ) {
			$modified_count = intval( $_REQUEST['bulk_modified'] );
			$medias_links   = _n( 'media link', 'medias links', $modified_count );
			printf(
				'<div id="message" class="notice notice-warning is-dismissible"><p>%s IPFS %s modified</p></div>',
				esc_html( $modified_count ),
				esc_html( $medias_links )
			);
		}
		if ( ! empty( $_REQUEST['bulk_unchanged'] ) ) {
			$unchanged_count = intval( $_REQUEST['bulk_unchanged'] );
			$medias_links    = _n( 'media link', 'medias links', $modified_count );
			printf(
				'<div id="message" class="notice is-dismissible"><p>%s IPFS %s unchanged</p></div>',
				esc_html( $unchanged_count ),
				esc_html( $medias_links )
			);
		}
	}
);
