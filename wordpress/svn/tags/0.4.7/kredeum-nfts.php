<?php
/**
 *
 * Plugin Name: Kredeum NFTs
 * Description: Plugin to archive your medias to IPFS and mint them as NFTs
 * Plugin URI: https://docs.kredeum.tech
 * Version: 0.4.7
 * Author: Kredeum <alain@kredeum.com>
 * Author URI: https://www.kredeum.com
 * Text domain: kredeum-nfts
 * Domain Path: /languages
 *
 * Contributors: apaz, yoannr35, alexr35
 * Donate link:  https://www.kredeum.com/
 * Tags: nft, blockchain, ethereum, ipfs
 * Requires at least: 5.0
 * Tested up to: 5.7.2
 * Stable tag: 0.4.7
 * Requires PHP: 7.0
 * License: GPLv3 or later
 * License URI: https://www.gnu.org/licenses/gpl-3.0.html
 *
 * Copyright 2020-2021 kredeum
 *
 * @package kredeum/nfts
 */

namespace KredeumNFTs;

define( 'KREDEUM_NFTS_VERSION', '0.4.7' );

defined( 'ABSPATH' ) || die( esc_html( __( 'Not allowed', 'kredeum-nfts' ) ) );
define( 'KREDEUM_NFTS_PLUGIN_PATH', plugin_dir_path( __FILE__ ) );

if ( is_admin() ) {
	define( 'IPFS_CID_VERSION', '1' );
	define( 'IPFS_AUTO', get_option( 'IPFS_AUTO', array( '' ) )[0] );
	define( 'IPFS_API', get_option( 'IPFS_API', array( '' ) )[0] );
	define( 'IPFS_CLUSTER_API', get_option( 'IPFS_CLUSTER_API', array( '' ) )[0] );
	define( 'IPFS_PINNING_API', get_option( 'IPFS_PINNING_API', array( '' ) )[0] );

	require_once KREDEUM_NFTS_PLUGIN_PATH . 'admin/nfts/index.php';

	require_once KREDEUM_NFTS_PLUGIN_PATH . 'admin/ajax/ajax.php';
	require_once KREDEUM_NFTS_PLUGIN_PATH . 'admin/ajax/ajax-token.php';

	require_once KREDEUM_NFTS_PLUGIN_PATH . 'admin/ipfs/nft-storage.php';
	require_once KREDEUM_NFTS_PLUGIN_PATH . 'admin/ipfs/pinata.php';
	require_once KREDEUM_NFTS_PLUGIN_PATH . 'admin/ipfs/query.php';
	require_once KREDEUM_NFTS_PLUGIN_PATH . 'admin/ipfs/multipart.php';

	require_once KREDEUM_NFTS_PLUGIN_PATH . 'admin/media/post.php';
	require_once KREDEUM_NFTS_PLUGIN_PATH . 'admin/media/upload.php';

	require_once KREDEUM_NFTS_PLUGIN_PATH . 'admin/media_list/actions.php';
	require_once KREDEUM_NFTS_PLUGIN_PATH . 'admin/media_list/column.php';

	require_once KREDEUM_NFTS_PLUGIN_PATH . 'admin/settings/class-settings.php';
	require_once KREDEUM_NFTS_PLUGIN_PATH . 'admin/settings/fields.php';


	require_once KREDEUM_NFTS_PLUGIN_PATH . 'vendor/tcdent/php-restclient/restclient.php';

	$api = new \RestClient( array( 'base_url' => '' ) );

	add_action(
		'admin_enqueue_scripts',
		function () {
			wp_enqueue_script( 'kredeum_nft', plugin_dir_url( __FILE__ ) . 'lib/js/kredeum_nft.js', array(), KREDEUM_NFTS_VERSION, true );
		},
		110
	);}

define( 'IPFS_GATEWAY', 'https://ipfs.io' );
// define('IPFS_GATEWAY', get_option('IPFS_GATEWAY', [''])[0]); ?
define( 'IPFS_NFT_STORAGE_KEY', get_option( 'IPFS_NFT_STORAGE_KEY', '' ) );
define( 'IPFS_PINATA_KEY', get_option( 'IPFS_PINATA_KEY', '' ) );
define( 'IPFS_PINATA_SECRET', get_option( 'IPFS_PINATA_SECRET', '' ) );

require_once KREDEUM_NFTS_PLUGIN_PATH . 'lib/ipfs/cid.php';
require_once KREDEUM_NFTS_PLUGIN_PATH . 'lib/ipfs/link.php';
require_once KREDEUM_NFTS_PLUGIN_PATH . 'lib/ipfs/links.php';
require_once KREDEUM_NFTS_PLUGIN_PATH . 'public/post/bottom.php';

add_action(
	'plugins_loaded',
	function () {
		load_plugin_textdomain( 'kredeum-nfts', false, KREDEUM_NFTS_PLUGIN_PATH . '/languages/' );
	}
);
