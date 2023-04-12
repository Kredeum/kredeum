<?php
/**
 * Post edit meta_boxes
 *
 * @package kredeum/nfts
 */

namespace KredeumNFTs\PostEdit;

// Krd_Text_Field class
class Krd_Text_Field {
	public function __construct() {
		add_action(
			'add_meta_boxes',
			array(
				$this,
				'register_meta_box',
			)
		);
		add_action(
			'save_post',
			array(
				$this,
				'save_meta_box_data',
			)
		);
	}

	public function register_meta_box() {
		add_meta_box(
			'krd_text_field',
			'Collection token gating',
			array( $this, 'render_meta_box_content' ),
			'post',
			'normal',
			'high'
		);
	}

	public function render_meta_box_content( $post ) {
		wp_nonce_field( 'krd_text_field_nonce', 'krd_text_field_nonce' );

		$value = get_post_meta( $post->ID, '_krd_text_field', true );

		echo '<input type="text" id="krd_text_field" name="krd_text_field" value="' . esc_attr( $value ) . '" style="width: 100%;" />';
		echo '<p class="description">Please add one of your NFT collection <a href="https://app.kredeum.com/" target="_blank">Kredeum</a>. Each internet user owning one of your NFTs will be able to access this post.</p>';
	}

	public function save_meta_box_data( $post_id ) {
		if ( ! isset( $_POST['krd_text_field_nonce'] ) || ! wp_verify_nonce( $_POST['krd_text_field_nonce'], 'krd_text_field_nonce' ) ) {
			return $post_id;
		}

		if ( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE ) {
			return $post_id;
		}

		if ( ! current_user_can( 'edit_post', $post_id ) ) {
			return $post_id;
		}

		$krd_text_field = sanitize_text_field( $_POST['krd_text_field'] );
		update_post_meta( $post_id, '_krd_text_field', $krd_text_field );
	}
}

new Krd_Text_Field();


