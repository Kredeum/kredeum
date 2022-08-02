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
			SWARM_STORAGE . '_link_box',
			strtoupper( SWARM_STORAGE ),
			function ( $post ) {
				$cid = $post->{SWARM_STORAGE_REF};
				if ( $cid ) {
					echo esc_html( __( 'Archive link', 'swarmpress' ) ) . ' : ' .
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
			$form_fields[ SWARM_STORAGE_REF ] = array(
				'label' => __( 'Archive to ', 'swarmpress' ) . SWARM_STORAGE,
				'value' => '',
				'input' => 'html',
				'html'  => '<label for="attachments-' . $post->ID . '-' . SWARM_STORAGE . '"> ' .
				'<input type="checkbox" id="attachments-' . $post->ID . '-' . SWARM_STORAGE . '" name="attachments[' . $post->ID . '][' . SWARM_STORAGE . ']" value="1" /></label>  ',
			);
		}
		return $form_fields;
	},
	10,
	2
);

/**
 * Storage edit attachement action.
 */
add_action(
	'edit_attachment',
	function ( $attachment_id ) {
		if ( isset( $_REQUEST['attachments'][ $attachment_id ][ SWARM_STORAGE ] )
		&& sanitize_text_field( wp_unslash( $_REQUEST['attachments'][ $attachment_id ][ SWARM_STORAGE ] ) ) ) {
			insert( $attachment_id );
		}
	}
);
