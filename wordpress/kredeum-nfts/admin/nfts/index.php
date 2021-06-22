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
				printf(
					'<kredeum-nft />'
					// '<kredeum-nft'
					// . ' contract="' . esc_attr( KREDEUM_NFTS_ADDRESS ) . '"/>'
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
