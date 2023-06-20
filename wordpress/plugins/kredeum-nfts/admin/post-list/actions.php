<?php
/**
 * Posts archive
 *
 * @package kredeum/nfts
 */

namespace KredeumNFTs\Storage;

require_once('tcpdf/tcpdf.php');

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
 * Posts storage bulk archive bulk action
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
            
            foreach ( $post_ids as $post_id ) {
                $post_data = get_post($post_id);
                $post_title = $post_data->post_title; // Get the post title
                $post_content = apply_filters('the_content', $post_data->post_content); // Apply necessary filters to get the formatted content
                $post_author = get_the_author_meta('display_name', $post_data->post_author); // Get the author name
                $post_date = get_the_date('', $post_id); // Get the publication date

                // Get the featured image URL
                $featured_image_url = '';
                if (has_post_thumbnail($post_id)) {
                    $image_id = get_post_thumbnail_id($post_id);
                    $image_data = wp_get_attachment_image_src($image_id, 'full');
                    $featured_image_url = $image_data[0];
                }
                // var_dump($post_content); die();
                
                $pdf = new \TCPDF(); // Initialize TCPDF instance
                $pdf->AddPage(); // Add a new page
                $pdf->SetFont('times', '', 12); // Set font and font size
                
                $header = '<h1>' . $post_title . '</h1>';
                if ($featured_image_url) {
                    $header .= '<img src="' . $featured_image_url . '">';
                }
                $header .= '<p><strong>Author:</strong> ' . $post_author . '</p>';
                $header .= '<p><strong>Date:</strong> ' . $post_date . '</p>';

                $pdf->writeHTML($header, true, false, true, false, '');
                
                $pdf->writeHTML($post_content, true, false, true, false, ''); // Write the HTML content to the PDF

                // Output the PDF to the browser
                // $pdf->Output('post_content.pdf', 'D'); // 'D' parameter prompts the user to download the PDF

                // You can also save the PDF to a file using the following:
                // $pdf->Output('path/to/save/page_content.pdf', 'F');
                
                
                // Get the PDF content as a string
                $pdf_content = $pdf->Output('', 'S');

                // Generate a unique filename for the PDF
                $filename = 'post_content_' . $post_id . '_' . time() . '.pdf';

                // Save the PDF in the WordPress media library
                $wp_upload_dir = wp_upload_dir(); // Retrieve the upload directory path
                $upload_path = $wp_upload_dir['path'] . '/' . $filename; // Create the full path to the PDF
                file_put_contents($upload_path, $pdf_content); // Save the PDF to the file
                $attachment = array(
                    'guid'           => $wp_upload_dir['url'] . '/' . $filename,
                    'post_mime_type' => 'application/pdf',
                    'post_title'     => sanitize_file_name($filename),
                    'post_content'   => '',
                    'post_status'    => 'inherit'
                );
                $attachment_id = wp_insert_attachment($attachment, $upload_path); // Insert the attachment into the media library

                // Generate attachment metadata and update the attachment
                $attachment_data = wp_generate_attachment_metadata($attachment_id, $upload_path);
                wp_update_attachment_metadata($attachment_id, $attachment_data);

                // Display the attachment URL
                $attachment_url = wp_get_attachment_url($attachment_id);
                echo "PDF saved: <a href=\"$attachment_url\">$attachment_url</a>";
            }
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
		if ( ! empty( $_REQUEST['bulk_archived'] ) ) {
			$archived_count = intval( $_REQUEST['bulk_archived'] );
			printf(
				'<div id="message" class="notice notice-success is-dismissible"><p>'
				// translators: %s = $archived_count = number of medias archived.
				. esc_html( _n( '%s media archived to Storage', '%s medias archived to Storage', $archived_count, 'kredeum-nfts' ) )
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
				. esc_html( _n( '%s Storage media link modified', '%s Storage medias links modified', $modified_count, 'kredeum-nfts' ) )
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
				. esc_html( _n( '%s Storage media link unchanged', '%s Storage medias links unchanged', $unchanged_count, 'kredeum-nfts' ) )
				. '</p></div>',
				esc_html( $unchanged_count )
			);
		}
	}
);