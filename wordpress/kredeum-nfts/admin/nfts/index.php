<?php
/**
 * NFTs menu functions
 *
 * @package kredeum/nfts
 */

add_action( 'admin_menu', 'nfts_menu' );

/**
 * NFTs menu action
 */
function nfts_menu() {
	add_menu_page(
		__( 'NFTs Kredeum', 'kredeum-nfts' ),
		__( 'NFTs', 'kredeum-nfts' ),
		'edit_posts',
		'nfts',
		'nfts_options',
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

/**
 * NFTs menu options
 */
function nfts_options() {
	echo '<kredeum-nft/>';
}
