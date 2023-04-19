<?php
/**
 * Decentralized Storage archive
 *
 * @package kredeum/nfts
 */

namespace KredeumNFTs\Storage;

/**
 * Decentralized Storage bulk archive action
 */
add_filter(
	'bulk_actions-upload',
	function ( $bulk_actions ) {
		$bulk_actions['archive'] = __( 'Archive to Decentralized Storage', 'kredeum-nfts' );
		return $bulk_actions;
	}
);

/**
 * Decentralized Storage bulk archive bulk action
 */
add_filter(
	'handle_bulk_actions-upload',
	function ( $redirect_url, $action, $post_ids ) {
		$na = 0; // number of archived files.
		$nm = 0; // number of modified files.
		$nu = 0; // number of unchanged files.
		if ( 'archive' === $action ) {
			foreach ( $post_ids as $post_id ) {
				$file = get_attached_file_meta( $post_id );
				$uri  = insert( $post_id );
				if ( $file->uri ) {
					if ( $file->uri === $uri ) {
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
 * IPDecentralized StorageFS bulk archive notice
 */
add_action(
	'admin_notices',
	function () {
		if ( ! empty( $_REQUEST['bulk_archived'] ) ) {
			$archived_count = intval( $_REQUEST['bulk_archived'] );
			printf(
				'<div id="message" class="notice notice-success is-dismissible"><p>'
				// translators: %s = $archived_count = number of medias archived.
				. esc_html( _n( '%s media archived to Decentralized Storage', '%s medias archived to Decentralized Storage', $archived_count, 'kredeum-nfts' ) )
				. '</p></div>',
				esc_html( $archived_count ),
			);
		}
		if ( ! empty( $_REQUEST['bulk_modified'] ) ) {
			$modified_count = intval( $_REQUEST['bulk_modified'] );
			printf(
			// translators: must explain %1 %2.
				'<div id="message" class="notice notice-warning is-dismissible"><p>'
				// translators: %s = $modified_count = number of medias modified.
				. esc_html( _n( '%s Decentralized Storaged media link modified', '%s Decentralized Storaged medias links modified', $modified_count, 'kredeum-nfts' ) )
				. '</p></div>',
				esc_html( $modified_count )
			);
		}
		if ( ! empty( $_REQUEST['bulk_unchanged'] ) ) {
			$unchanged_count = intval( $_REQUEST['bulk_unchanged'] );
			printf(
			// translators: must explain %1 %2.
				'<div id="message" class="notice is-dismissible"><p>'
				// translators: %s = $unchanged_count = number of medias unchanged.
				. esc_html( _n( '%s Decentralized Storaged media link unchanged', '%s Decentralized Storaged medias links unchanged', $unchanged_count, 'kredeum-nfts' ) )
				. '</p></div>',
				esc_html( $unchanged_count )
			);
		}
	}
);
