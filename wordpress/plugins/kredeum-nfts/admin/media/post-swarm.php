<?php
/**
 * SWARM meta_boxes
 *
 * @package kredeum/nfts
 */

namespace KredeumNFTs\Swarm;

/**
 * SWARM meta_boxes action
 * affiche box avec CID
 */
add_action(
	'add_meta_boxes_attachment',
	function () {
		add_meta_box(
			'swarm_link_box',
			'SWARM',
			function ( $post ) {
				$cid = $post->_kre_swarmref;
				if ( $cid ) {
					echo esc_html( __( 'Archive link', 'kredeum-nfts' ) ) . ' : ' .
					wp_kses( link( $cid ), array( 'a' => array( 'href' => array() ) ) );
				}
			}
		);
	}
);

/**
 * SWARM fileds filter
 */
add_filter(
	'attachment_fields_to_edit',
	function ( $form_fields, $post ) {
		$file = get_attached_file_meta( $post->ID );

		if ( ! $file->cid ) {
			$form_fields['_kre_swarmref'] = array(
				'label' => __( 'Archive to SWARM' ),
				'value' => '',
				'input' => 'html',
				'html'  => '<label for="attachments-' . $post->ID . '-swarm"> ' .
				'<input type="checkbox" id="attachments-' . $post->ID . '-swarm" name="attachments[' . $post->ID . '][swarm]" value="1" /></label>  ',
			);
		}
		return $form_fields;
	},
	10,
	2
);

/**
 * SWARM edit attachement action
 */
add_action(
	'edit_attachment',
	function ( $attachment_id ) {
		if ( isset( $_REQUEST['attachments'][ $attachment_id ]['swarm'] )
		&& sanitize_text_field( wp_unslash( $_REQUEST['attachments'][ $attachment_id ]['swarm'] ) ) ) {
			insert( $attachment_id );
		}
	}
);
