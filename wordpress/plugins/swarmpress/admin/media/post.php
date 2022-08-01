<?php
/**
 * Storage meta_boxes
 *
 * @package swarmpress
 */

namespace SwarmPress\Storage;

/**
 * Storage meta_boxes action
 * affiche box avec CID
 */
add_action(
	'add_meta_boxes_attachment',
	function () {
		add_meta_box(
			STORAGE . '_link_box',
			strtoupper( STORAGE ),
			function ( $post ) {
				$cid = $post->{get_storage_ref()};
				if ( $cid ) {
					echo esc_html( __( 'Archive link', 'kredeum-nfts' ) ) . ' : ' .
					wp_kses( link( $cid ), array( 'a' => array( 'href' => array() ) ) );
				}
			}
		);
	}
);

/**
 * Storage fileds filter
 */
add_filter(
	'attachment_fields_to_edit',
	function ( $form_fields, $post ) {
		$file = get_attached_file_meta( $post->ID );

		if ( ! $file->cid ) {
			$form_fields[ get_storage_ref() ] = array(
				'label' => __( 'Archive to ' ) . STORAGE,
				'value' => '',
				'input' => 'html',
				'html'  => '<label for="attachments-' . $post->ID . '-' . STORAGE . '"> ' .
				'<input type="checkbox" id="attachments-' . $post->ID . '-' . STORAGE . '" name="attachments[' . $post->ID . '][' . STORAGE . ']" value="1" /></label>  ',
			);
		}
		return $form_fields;
	},
	10,
	2
);

/**
 * Storage edit attachement action
 */
add_action(
	'edit_attachment',
	function ( $attachment_id ) {
		if ( isset( $_REQUEST['attachments'][ $attachment_id ][ STORAGE ] )
		&& sanitize_text_field( wp_unslash( $_REQUEST['attachments'][ $attachment_id ][ STORAGE ] ) ) ) {
			insert( $attachment_id );
		}
	}
);
