<?php
/**
 * Posts archive
 *
 * @package kredeum/nfts
 */

namespace KredeumNFTs\Storage;

use Dompdf\Dompdf;
use Dompdf\Options;

/**
 * Posts bulk archive action
 */
add_filter(
	'bulk_actions-edit-post',
	function ( $bulk_actions ) {
		$bulk_actions['kre-post-archive'] = __( 'Archive to Storage', 'kredeum-nfts' );
		return $bulk_actions;
	}
);

/**
 * Posts storage bulk archive bulk action
 */
add_filter(
	'handle_bulk_actions-edit-post',
	function ( $redirect_url, $action, $post_ids ) {
		$na = 0; // number of archived files.
		$nm = 0; // number of modified files.
		$nu = 0; // number of unchanged files.

		if ( 'kre-post-archive' === $action ) {
			foreach ( $post_ids as $post_id ) {
				$post = get_post( $post_id );

				$post_metadatas = get_attached_file_meta( $post_id );

				// Get Modified post and pdf file last modified Timestamp.
				$post_modified_date     = get_the_modified_date( 'U', $post_id );
				$post_pdf_modified_date = intval( get_post_meta( $post_id, '_kre_pdf_modified_date' )[0] );

				if ( ! $post->_kre_uri || $post_modified_date > $post_pdf_modified_date ) {
					update_post_meta( $post_id, '_kre_pdf_modified_date', $post_modified_date );

					$post_title     = $post->post_title;
					$post_content   = apply_filters( 'the_content', $post->post_content );
					$post_author    = get_the_author_meta( 'display_name', $post->post_author );
					$post_date      = get_the_date( '', $post_id );
					$post_date_full = get_the_date( 'Y-m-d H:i:s', $post_id );

					$featured_image_url = '';
					if ( has_post_thumbnail( $post_id ) ) {
						$featured_image_url = get_the_post_thumbnail_url( $post_id, 'full' );
					}

					//
					// Create pdf.
					//
					$options = new Options();
					$options->setIsHtml5ParserEnabled( true );
					$options->set( 'isRemoteEnabled', true );
					$options->set( 'defaultFont', 'Arial' );
					$dompdf = new Dompdf( $options );

					$dompdf->loadHtml( html_content_get( $post_title, $post_author, $post_date, $post_content, $featured_image_url ) );
					$dompdf->render();

					// add pages numerotation.
					$dompdf->getCanvas()->page_text( 280, 770, 'Page {PAGE_NUM} / {PAGE_COUNT}', null, 8, array( 0, 0, 0 ) );

					// Generates pdf file
					$output = $dompdf->output();

					$uri = insert( $output, 'application/pdf', $post_id );

					if ( $post_metadatas->uri && $post_metadatas->uri !== $uri ) {
						$nm++;
					} else {
						$na++;
					}
				} else {
					$nu++;
				}
			}

			$redirect_url = add_query_arg( 'bulk_post_archived', $na, $redirect_url );
			$redirect_url = add_query_arg( 'bulk_post_modified', $nm, $redirect_url );
			$redirect_url = add_query_arg( 'bulk_post_unchanged', $nu, $redirect_url );
		}
		return $redirect_url;
	},
	10,
	3
);

/**
 * Post storage bulk archive notice
 */
add_action(
	'admin_notices',
	function () {
		if ( ! empty( $_REQUEST['bulk_post_archived'] ) ) {
			$archived_count = intval( $_REQUEST['bulk_post_archived'] );
			printf(
				'<div id="message" class="notice notice-success is-dismissible"><p>'
				// translators: %s = $archived_count = number of medias archived.
				. esc_html( _n( '%s article archived to Storage', '%s articles archived to Storage', $archived_count, 'kredeum-nfts' ) )
				. '</p></div>',
				esc_html( $archived_count ),
			);
		}
		if ( ! empty( $_REQUEST['bulk_post_modified'] ) ) {
			$modified_count = intval( $_REQUEST['bulk_post_modified'] );
			printf(
			// translators: must explain %1 %2.
				'<div id="message" class="notice notice-warning is-dismissible"><p>'
				// translators: %s = $modified_count = number of medias modified.
				. esc_html( _n( '%s Storage article link modified', '%s Storage articles links modified', $modified_count, 'kredeum-nfts' ) )
				. '</p></div>',
				esc_html( $modified_count )
			);
		}
		if ( ! empty( $_REQUEST['bulk_post_unchanged'] ) ) {
			$unchanged_count = intval( $_REQUEST['bulk_post_unchanged'] );
			printf(
			// translators: must explain %1 %2.
				'<div id="message" class="notice is-dismissible"><p>'
				// translators: %s = $unchanged_count = number of medias unchanged.
				. esc_html( _n( '%s Storage article link unchanged', '%s Storage articles links unchanged', $unchanged_count, 'kredeum-nfts' ) )
				. '</p></div>',
				esc_html( $unchanged_count )
			);
		}
	}
);
