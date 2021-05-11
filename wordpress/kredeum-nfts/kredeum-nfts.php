<?php
/**
 *
 * Plugin Name: Kredeum NFTs
 * Description: Plugin to archive your medias to IPFS and mint them as NFTs
 * Plugin URI: https://docs.kredeum.tech
 * Version: 0.4.2
 * Requires at least: 4.0.0
 * Requires PHP: 5.4
 * Author: Kredeum <alain@kredeum.com>
 * Author URI: https://www.kredeum.com
 * License: GPLv3
 * License URI: https://www.gnu.org/licenses/gpl-3.0.html
 * Text domain: kredeum-nfts
 * Domain Path: /languages
 *
 * Copyright 2020-2021 kredeum
 *
 * @package kredeum/nfts
 */

defined( 'ABSPATH' ) || die( esc_html( __( 'Not allowed', 'kredeum-nfts' ) ) );
define( 'KREDEUM_NFTS_PLUGIN_PATH', plugin_dir_path( __FILE__ ) );

if ( is_admin() ) {
	define( 'IPFS_AUTO', '1' );
	define( 'IPFS_CID_VERSION', '1' );
	// define('IPFS_AUTO', get_option('IPFS_AUTO', [0])[0]); ?
	// define('IPFS_CID_VERSION', get_option('IPFS_CID_VERSION', [0])[0]); ?

	define( 'IPFS_API', get_option( 'IPFS_API', array( '' ) )[0] );
	define( 'IPFS_CLUSTER_API', get_option( 'IPFS_CLUSTER_API', array( '' ) )[0] );
	define( 'IPFS_PINNING_API', get_option( 'IPFS_PINNING_API', array( '' ) )[0] );

	require_once KREDEUM_NFTS_PLUGIN_PATH . 'admin/nfts/index.php';

	require_once KREDEUM_NFTS_PLUGIN_PATH . 'admin/ajax/ajax.php';

	require_once KREDEUM_NFTS_PLUGIN_PATH . 'admin/ipfs/add.php';
	require_once KREDEUM_NFTS_PLUGIN_PATH . 'admin/ipfs/pin.php';
	require_once KREDEUM_NFTS_PLUGIN_PATH . 'admin/ipfs/nft-storage.php';
	require_once KREDEUM_NFTS_PLUGIN_PATH . 'admin/ipfs/pinata.php';
	require_once KREDEUM_NFTS_PLUGIN_PATH . 'admin/ipfs/query.php';

	require_once KREDEUM_NFTS_PLUGIN_PATH . 'admin/media/delete.php';
	require_once KREDEUM_NFTS_PLUGIN_PATH . 'admin/media/new.php';
	require_once KREDEUM_NFTS_PLUGIN_PATH . 'admin/media/post.php';

	require_once KREDEUM_NFTS_PLUGIN_PATH . 'admin/media_list/actions.php';
	require_once KREDEUM_NFTS_PLUGIN_PATH . 'admin/media_list/column.php';

	require_once KREDEUM_NFTS_PLUGIN_PATH . 'admin/settings/fields.php';
	require_once KREDEUM_NFTS_PLUGIN_PATH . 'admin/settings/class-kredeum-nfts-settings.php';

	require_once KREDEUM_NFTS_PLUGIN_PATH . 'lib/php/restclient.php';

	$api = new RestClient( array( 'base_url' => '' ) );

	add_action(
		'admin_enqueue_scripts',
		function () {
			wp_enqueue_script( 'kredeum_nft', plugin_dir_url( __FILE__ ) . 'lib/js/kredeum_nft.js', array(), 'v0.4.1', true );
		},
		110
	);}

define( 'IPFS_GATEWAY', 'https://ipfs.io' );
// define('IPFS_GATEWAY', get_option('IPFS_GATEWAY', [''])[0]); ?
define( 'IPFS_NFT_STORAGE_KEY', get_option( 'IPFS_NFT_STORAGE_KEY', '' ) );
define( 'IPFS_PINATA_KEY', get_option( 'IPFS_PINATA_KEY', '' ) );
define( 'IPFS_PINATA_SECRET', get_option( 'IPFS_PINATA_SECRET', '' ) );

require_once KREDEUM_NFTS_PLUGIN_PATH . 'public/ipfs/cid.php';
require_once KREDEUM_NFTS_PLUGIN_PATH . 'public/ipfs/link.php';
require_once KREDEUM_NFTS_PLUGIN_PATH . 'public/ipfs/links.php';
require_once KREDEUM_NFTS_PLUGIN_PATH . 'public/post/bottom.php';

add_action(
	'plugins_loaded',
	function () {
		load_plugin_textdomain( 'kredeum-nfts', false, KREDEUM_NFTS_PLUGIN_PATH . '/languages/' );
	}
);
