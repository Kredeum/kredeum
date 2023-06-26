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
			
            
            foreach ( $post_ids as $post_id ) {
                $post = get_post($post_id);
                $post_title = $post->post_title; // Get the post title
                $post_content = apply_filters('the_content', $post->post_content); // Apply necessary filters to get the formatted content
                $post_author = get_the_author_meta('display_name', $post->post_author); // Get the author name
                $post_date = get_the_date('', $post_id); // Get the publication date
                $post_date_full = get_the_date('Y-m-d H:i:s', $post_id); // Get the publication date

                // Get the featured image URL
                $featured_image_url = '';
                if (has_post_thumbnail($post_id)) {
                    $image_id = get_post_thumbnail_id($post_id);
                    $image_data = wp_get_attachment_image_src($image_id, 'full');
                    $featured_image_url = $image_data[0];
                }
				
				// Get previously created pdf metadata 
				$post_metadatas = wp_get_attachment_metadata($post_id);
				$pdfFileMeta = get_attached_file_meta($post_metadatas['pdf_id']);
				// var_dump(get_post($post_id));
				// var_dump(get_post($post_metadatas['pdf_id']));
				// var_dump(get_post_field('post_modified', $post_metadatas['pdf_id']));
				// var_dump(strtotime(get_post_field('post_modified', $post_metadatas['pdf_id'])));
				// var_dump(get_the_modified_date('U', $post_id));
				// var_dump(get_the_modified_date('U', $post_metadatas['pdf_id']));
				// die();
				
				$post_modified_date = get_the_modified_date('U', $post_id);
				$pdf_modified_date = get_the_modified_date('U', $post_metadatas['pdf_id']);
				
				// Generate a unique filename for the PDF
                $filename = sanitize_file_name($post_title  . '_PID' . $post_id . '_' . $post_date_full . '.pdf');
				
				if(!$pdfFileMeta->filename || $post_modified_date > $pdf_modified_date) {
					
					$font = 'helvetica';
					$fontSize = 12;
					
					$pdf = new \TCPDF(); // Initialize TCPDF instance
					$pdf->AddPage(); // Add a new page
					$pdf->SetFont($font, '', $fontSize); // Set font and font siz

					
					$header = '<h1>' . $post_title . '</h1>';
					if ($featured_image_url) {
						$header .= '<div><img src="' . $featured_image_url . '"></div>';
					}
					$header .= '<p><strong>Author:</strong> ' . $post_author . '</p>';
					$header .= '<p><strong>Date:</strong> ' . $post_date . '</p>';
	
					$pdf->writeHTML($header, true, false, true, false, '');
					
					$pdf->writeHTML($post_content, true, false, true, false, ''); // Write the HTML content to the PDF
	
					// Output the PDF to the browser
					// $pdf->Output('post_content.pdf', 'D'); // 'D' parameter prompts the user to download the PDF
					
					// Get the PDF content as a string
					$pdf_content = $pdf->Output('', 'S');
	
	
					// Save the PDF in the WordPress media library
					$wp_upload_dir = wp_upload_dir(); // Retrieve the upload directory path
					$upload_path = $wp_upload_dir['path'] . '/' . $filename; // Create the full path to the PDF
					file_put_contents($upload_path, $pdf_content); // Save the PDF to the file
					
					$attachment = array(
						'guid'           => $wp_upload_dir['url'] . '/' . $filename,
						'post_mime_type' => 'application/pdf',
						'post_title'     => $filename,
						'post_content'   => '',
						'post_status'    => 'inherit',
					);
					$attachment_id = wp_insert_attachment($attachment, $upload_path); // Insert the attachment into the media library
	
					// Generate attachment metadata and update the attachment
					$attachment_data = wp_generate_attachment_metadata($attachment_id, $upload_path);
					wp_update_attachment_metadata($attachment_id, $attachment_data);
					
					$uri  = insert( $attachment_id );
					
					
					if ( $pdfFileMeta->uri && $pdfFileMeta->uri !== $uri ) {
						$nm++;
					} else {
						$na++;
					}
					
					$post_metadatas['pdf_id'] = $attachment_id;
					wp_update_attachment_metadata($post_id, $post_metadatas);
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

// add_action(
// 	'post_updated',
// 	function ( $post_id, $post_after, $post_before ) {
// 		var_dump('heo !'); die();
// 		// if ( current_user_can( 'edit_posts' ) ) {
// 		// 	if ( $post_after->post_content !== $post_before->post_content ) {
// 		// 		$post_data = array(
// 		// 			'ID'         => $post_id,
// 		// 			'post_date'  => current_time( 'mysql' ),
// 		// 			'post_date_gmt' => current_time( 'mysql', 1 )
// 		// 		);
// 		// 		wp_update_post( $post_data );
// 		// 	}
// 		// }
// 	},
// 	10,
// 	3
// );

// add_action( 'post_updated', function ( $post_id, $post_after, $post_before ) {
//     var_dump('hello!'); die();
// }, 10, 3 );

// function update_post_date_on_update( $post_ID, $post, $update ) {
// 	var_dump('heo !'); die();
//     // Vérifiez si l'utilisateur a la capacité de modifier l'article
//     // if ( current_user_can( 'edit_posts' ) ) {
//     //     // Vérifiez si le contenu de l'article a été modifié
//     //     if ( $post_after->post_content !== $post_before->post_content ) {
//     //         // Mettez à jour la date de modification de l'article
//     //         $post_data = array(
//     //             'ID'              => $post_ID,
//     //             'post_modified'   => current_time( 'mysql' ),
//     //             'post_modified_gmt' => current_time( 'mysql', 1 )
//     //         );
//     //         wp_update_post( $post_data );
//     //     }
//     // }
// }
// add_action( 'save_post_post', '\KredeumNFTs\Storage\update_post_date_on_update', 10, 3 );


// add_action(
// 	'save_post',
// 	function ( $post_id ) {
// 		var_dump('heo !'); die();
// 		// Vérifiez si l'utilisateur a la capacité de modifier l'article
// 		if ( current_user_can( 'edit_posts' ) ) {
// 			// Mettez à jour la date de modification de l'article
// 			$post_data = array(
// 				'ID'              => $post_id,
// 				'post_modified'   => current_time( 'mysql' ),
// 				'post_modified_gmt' => current_time( 'mysql', 1 )
// 			);
// 			wp_update_post( $post_data );
// 		}
// 	}, 10, 1
// );

// function update_post_date_on_update( $post_ID, $post_after, $post_before ) {
// 	var_dump('heo !'); die();
//     // Vérifiez si l'utilisateur a la capacité de modifier l'article
//     if ( current_user_can( 'edit_posts' ) ) {
//         // Vérifiez si le contenu de l'article a été modifié
//         if ( $post_after->post_content !== $post_before->post_content ) {
//             // Mettez à jour la date de modification de l'article
//             $post_data = array(
//                 'ID'              => $post_ID,
//                 'post_modified'   => current_time( 'mysql' ),
//                 'post_modified_gmt' => current_time( 'mysql', 1 )
//             );
//             wp_update_post( $post_data );
//         }
//     }
// }
// add_action( 'post_updated', '\KredeumNFTs\update_post_date_on_update', 10, 3 );



// add_filter(
// 	'wp_insert_post_data',
// 	function ( $data, $postarr ) {
// 		var_dump('heo !'); die();
// 		// Vérifiez si l'utilisateur a la capacité de modifier l'article
// 		// if ( current_user_can( 'edit_posts' ) ) {
// 		// 	// Vérifiez si le contenu de l'article a été modifié
// 		// 	if ( isset( $data['post_content'] ) && isset( $postarr['ID'] ) ) {
// 		// 		$post_id = $postarr['ID'];
// 		// 		$post = get_post( $post_id );
				
// 		// 		if ( $data['post_content'] !== $post->post_content ) {
// 		// 			// Mettez à jour la date de modification de l'article
// 		// 			$data['post_modified'] = current_time( 'mysql' );
// 		// 			$data['post_modified_gmt'] = current_time( 'mysql', 1 );
// 		// 		}
// 		// 	}
// 		// }
		
// 		return $data;
// 	}, 
// 	10, 2
// );