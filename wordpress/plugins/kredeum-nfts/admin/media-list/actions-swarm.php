<?php
/**
 * SWARM archive
 *
 * @package kredeum/nfts
 */

namespace KredeumNFTs\Swarm;

/**
 * SWARM bulk archive action
 */
add_filter(
	'bulk_actions-upload',
	function ( $bulk_actions ) {
		if ( ! SWARM_ARCHIVE ) {
			return $bulk_actions;
		} else {
			$bulk_actions['archive'] = __( 'Archive to SWARM', 'kredeum-nfts' );

			return $bulk_actions;
		}
	}
);

/**
 * SWARM bulk archive bulk action
 */
add_filter(
	'handle_bulk_actions-upload',
	function ( $redirect_url, $action, $post_ids ) {
		if ( ! SWARM_ARCHIVE ) {
			return $redirect_url;
		} else {
			$na = 0; // number of archived files.
			$nm = 0; // number of modified files.
			$nu = 0; // number of unchanged files.
			if ( 'archive' === $action ) {
				foreach ( $post_ids as $post_id ) {
					$file = get_attached_file_meta( $post_id );
					$cid  = insert( $post_id );
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
		}
	},
	10,
	3
);

/**
 * SWARM bulk archive notice
 */
add_action(
	'admin_notices',
	function () {
		if ( SWARM_ARCHIVE ) {
			if ( ! empty( $_REQUEST['bulk_archived'] ) ) {
				$archived_count = intval( $_REQUEST['bulk_archived'] );
				printf(
					'<div id="message" class="notice notice-success is-dismissible"><p>'
					// translators: %s = $archived_count = number of medias archived.
					. esc_html( _n( '%s media archived to SWARM', '%s medias archived to SWARM', $archived_count, 'kredeum-nfts' ) )
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
					. esc_html( _n( '%s SWARM media link modified', '%s SWARM medias links modified', $modified_count, 'kredeum-nfts' ) )
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
					. esc_html( _n( '%s SWARM media link unchanged', '%s SWARM medias links unchanged', $unchanged_count, 'kredeum-nfts' ) )
					. '</p></div>',
					esc_html( $unchanged_count )
				);
			}
		}
	}
);
