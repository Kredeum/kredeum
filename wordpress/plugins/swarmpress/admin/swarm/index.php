<?php
/**
 * Swarm menu functions
 *
 * @package swarmpress
 */

namespace SwarmPress\Menu;

add_action(
	'admin_menu',
	function () {
		add_menu_page(
			__( 'SWARM', 'kredeum-nfts' ),
			__( 'SWARM', 'kredeum-nfts' ),
			'edit_posts',
			'swarm_settings',
			page_content(),
			'dashicons-format-gallery',
			11
		);

	}
);

// function page_content() {.
// echo '<div class="wrap">';.
// echo '<h2>' . esc_html( __( 'Swarm settings', 'kredeum-nfts' ) ) . '</h2>';.

// echo '<form action="options.php" method="POST">';.
// settings_fields( 'swarm_settings' );.
// do_settings_sections( 'swarm_settings' );.
// submit_button();.
// echo '</form></div>';.
// }.
