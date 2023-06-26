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
				
				
				///////////////////////////////////////////////////////////////////////////
				// Chemin vers l'image source
				$imageSourcePath = $featured_image_url;
				
				// Lire le contenu binaire de l'image
				$imageSourceData = file_get_contents($imageSourcePath);

				// Charger l'image source à partir de la chaîne binaire
				$imageSource = imagecreatefromstring($imageSourceData);

				// Créer une nouvelle image avec les mêmes dimensions que l'image source
				$newImage = imagecreatetruecolor(imagesx($imageSource), imagesy($imageSource));

				// Définir des couleurs pour le texte et le fond
				$textColor = imagecolorallocate($newImage, 255, 255, 255); // Blanc
				$backgroundColor = imagecolorallocate($newImage, 0, 0, 0); // Noir
				
				// Remplir l'image avec la couleur d'arrière-plan
				imagefill($newImage, 0, 0, $backgroundColor);

				// Copier l'image source sur la nouvelle image
				imagecopy($newImage, $imageSource, 0, 130, 0, 0, imagesx($imageSource), imagesy($imageSource) + 130);
				
				// Ajouter la première chaîne de caractères à l'image
				imagestring($newImage, 5, 10, 30, $post_title, $textColor);

				// Ajouter la deuxième chaîne de caractères à l'image
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
				
				$uploadDir = wp_upload_dir();
				$kreImagesUploadPath = $uploadDir['basedir'] . '/kre-article-images';
				
				wp_mkdir_p($kreImagesUploadPath);

				
				// Chemin complet de l'image à enregistrer
				$imagePath = $kreImagesUploadPath . '/' . sanitize_file_name($post_title  . '_PID' . $post_id . '_' . $post_date_full . '_img.jpg');

				// Enregistrer l'image sur le disque
				imagejpeg($newImage, $imagePath);

				// Libérer la mémoire en détruisant les images créées
				imagedestroy($imageSource);
				imagedestroy($newImage);
				///////////////////////////////////////////////////////////////////////////
				
				die();
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