<?php
/**
 * IPFS meta_boxes
 *
 * @package kredeum/nfts
 */

namespace KredeumNFTs\Ipfs;

/**
 * IPFS meta_boxes action
 * affiche box avec CID
 */
add_action(
	'add_meta_boxes_attachment',
	function () {
		add_meta_box(
			'ipfs_link_box',
			'IPFS',
			function ( $post ) {
				$cid = $post->_kre_cid;
				if ( $cid ) {
					echo esc_html( __( 'Archive link', 'kredeum-nfts' ) ) . ' : ' .
					wp_kses( link( $cid ), array( 'a' => array( 'href' => array() ) ) );
				}
			}
		);
	}
);

/**
 * IPFS fileds filter
 */
add_filter(
	'attachment_fields_to_edit',
	function ( $form_fields, $post ) {
		$file = get_attached_file_meta( $post->ID );

		if ( ! $file->cid ) {
			$form_fields['_kre_cid'] = array(
				'label' => __( 'Archive to IPFS' ),
				'value' => '',
				'input' => 'html',
				'html'  => '<label for="attachments-' . $post->ID . '-ipfs"> ' .
				'<input type="checkbox" id="attachments-' . $post->ID . '-ipfs" name="attachments[' . $post->ID . '][ipfs]" value="1" /></label>  '
			);
		}
		return $form_fields;
	},
	10,
	2
);

/**
 * IPFS edit attachement action
 */
add_action(
	'edit_attachment',
	function ( $attachment_id ) {
		if ( isset( $_REQUEST['attachments'][ $attachment_id ]['ipfs'] )
		&& sanitize_text_field( wp_unslash( $_REQUEST['attachments'][ $attachment_id ]['ipfs'] ) ) ) {
			insert( $attachment_id );
		}
	}
);
