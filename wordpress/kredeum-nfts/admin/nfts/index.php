<?php
/**
 * NFTs menu functions
 *
 * @package kredeum/nfts
 */

namespace KredeumNFTs\Menu;

add_action(
	'admin_menu',
	function () {
		add_menu_page(
			__( 'NFTs Kredeum', 'kredeum-nfts' ),
			__( 'NFTs', 'kredeum-nfts' ),
			'edit_posts',
			'nfts',
			function () {
				wp_nonce_field( 'ajax-import', 'knonce' );
				printf(
					// '<kredeum-nft />'
					'<kredeum-nft'
					// . ' contract="' . esc_attr( KREDEUM_NFTS_ADDRESS ) . '"'
					// . ' platform="wordpress"'
					. ' />'
				);
			},
			'dashicons-format-gallery',
			11
		);
		add_submenu_page(
			'nfts',
			__( 'NFTs Kredeum', 'kredeum-nfts' ),
			__( 'NFTs Kredeum', 'kredeum-nfts' ),
			'edit_posts',
			'nfts'
		);
	}
);
