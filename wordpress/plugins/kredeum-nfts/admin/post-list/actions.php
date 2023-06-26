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

				// Get previously created pdf metadata 
				$post_attachment_metadatas = wp_get_attachment_metadata($post_id);
				$pdfId = $post_attachment_metadatas['pdf_id'];
				$pdfFileMeta = get_attached_file_meta($pdfId);
				
				// Get Modified post and pdf file last modified Timestamp
				$post_modified_date = get_the_modified_date('U', $post_id);
				$pdf_modified_date = get_the_modified_date('U', $pdfId);
				
				if(!$pdfFileMeta->filename || $post_modified_date > $pdf_modified_date) {
					$post_title = $post->post_title; // Get the post title
					$post_content = apply_filters('the_content', $post->post_content);
					$post_author = get_the_author_meta('display_name', $post->post_author);
					$post_date = get_the_date('', $post_id); 
					$post_date_full = get_the_date('Y-m-d H:i:s', $post_id);
					
					// Get the featured image URL
					$featured_image_url = '';
					if (has_post_thumbnail($post_id)) {
						$image_id = get_post_thumbnail_id($post_id);
						$image_data = wp_get_attachment_image_src($image_id, 'full');
						$featured_image_url = $image_data[0];
					}
					
					// Generate a unique filename for the PDF and image
					$filename = sanitize_file_name($post_title  . '_PID' . $post_id . '_' . $post_date_full);
					$pdfFilename = $filename . '.pdf';
					$imageFilename = $filename . '_img.jpg';
					
					$uploadDir = wp_upload_dir();
					
					///////////////////////////////////////////////////////////////////////////
					// Create Image
					///////////////////////////////////////////////////////////////////////////
					$imageSourceData = file_get_contents($featured_image_url);
					$imageSource = imagecreatefromstring($imageSourceData);

					// Create new image 130px higher
					$newImage = imagecreatetruecolor(imagesx($imageSource), imagesy($imageSource) + 130);

					$textColor = imagecolorallocate($newImage, 255, 255, 255); // Blanc
					$backgroundColor = imagecolorallocate($newImage, 0, 0, 0); // Noir
					// Black background
					imagefill($newImage, 0, 0, $backgroundColor);

					// Copy source image to new image
					imagecopy($newImage, $imageSource, 0, 130, 0, 0, imagesx($imageSource), imagesy($imageSource));
					
					// Add text on image
					imagestring($newImage, 5, 10, 30, $post_title, $textColor);
					imagestring($newImage, 5, 10, 60, $post_author, $textColor);

					// if (extension_loaded('gd') && extension_loaded('freetype')) {
					// 	// Votre code de génération d'image ici
					// } else {
					// 	var_dump('L\'extension GD ou FreeType n\'est pas activée.'); die();;
					// }
					
					// $fontPath = KREDEUM_NFTS_PLUGIN_PATH . 'lib/fonts/fa-solid-900';

					// // Ajouter la première chaîne de caractères à l'image
					// imagettftext($newImage, 20, 0, 10, 30, $textColor, $fontPath, $post_title);

					// // Ajouter la deuxième chaîne de caractères à l'image
					// imagettftext($newImage, 20, 0, 10, 60, $textColor, $fontPath, $post_author);

					// Afficher l'image générée dans le navigateur ou enregistrer l'image sur le disque
					// header('Content-Type: image/jpeg');
					// imagejpeg($newImage);
					
					
					$uploadFolderName = '/kre-article-images';
					$kreImagesUploadPath = $uploadDir['basedir'] . $uploadFolderName;
					$kreImagesUploadUrl = $uploadDir['baseurl'] . $uploadFolderName;
					
					wp_mkdir_p($kreImagesUploadPath);

					$imagePath = $kreImagesUploadPath . '/' . $imageFilename;
					$imageUrl = $kreImagesUploadUrl . '/' . $imageFilename;

					// save image 
					imagejpeg($newImage, $imagePath);
					
					// Free memory
					imagedestroy($imageSource);
					imagedestroy($newImage);
					
					$post_attachment_metadatas['pdf_coverimg_url'] = $imageUrl;
					wp_update_attachment_metadata($post_id, $post_attachment_metadatas);
					
					///////////////////////////////////////////////////////////////////////////
					// Create pdf
					///////////////////////////////////////////////////////////////////////////
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
					$upload_path = $uploadDir['path'] . '/' . $pdfFilename; // Create the full path to the PDF
					file_put_contents($upload_path, $pdf_content); // Save the PDF to the file
					
					$attachment = array(
						'guid'           => $uploadDir['url'] . '/' . $pdfFilename,
						'post_mime_type' => 'application/pdf',
						'post_title'     => $pdfFilename,
						'post_content'   => '',
						'post_status'    => 'inherit',
					);
					$attachment_id = wp_insert_attachment($attachment, $upload_path); // Insert the pdf attachment into the media library
	
					// Generate attachment metadata and update the attachment
					$attachment_data = wp_generate_attachment_metadata($attachment_id, $upload_path);
					wp_update_attachment_metadata($attachment_id, $attachment_data);
					
					$post_attachment_metadatas['pdf_id'] = $attachment_id;
					wp_update_attachment_metadata($post_id, $post_attachment_metadatas);
					
					///////////////////////////////////////////////////////////////////////////
					// Upload pdf on decentralized storage
					///////////////////////////////////////////////////////////////////////////
					$uri  = insert( $attachment_id );
					
					
					
					if ( $pdfFileMeta->uri && $pdfFileMeta->uri !== $uri ) {
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