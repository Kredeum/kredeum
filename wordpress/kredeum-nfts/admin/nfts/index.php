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
				wp_nonce_field( 'ajax-kredeum-nft', 'knonce' );
				if ( KREDEUM_BETA ) {
					$beta = ' beta="true"';
				}
					printf(
						'<kredeum-nft'
						. ' contract="' . esc_attr( DEFAULT_COLLECTION ) . '"'
						. esc_attr( $beta )
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
