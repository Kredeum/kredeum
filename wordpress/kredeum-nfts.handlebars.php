<?php
/**
 *
 * Plugin Name: Kredeum NFTs
 * Description: Plugin to archive your medias to IPFS and mint them as NFTs
 * Plugin URI: https://docs.kredeum.tech
 * Version: {{version.latest}}
 * Author: Kredeum <alain@kredeum.com>
 * Author URI: https://www.kredeum.com
 * Text domain: kredeum-nfts
 * Domain Path: /languages
 *
 * Copyright 2020-2022 Kredeum
 *
 * @package kredeum/nfts
 */

namespace KredeumNFTs;

define( 'KREDEUM_NFTS_VERSION', '{{version.latest}}' );

defined( 'ABSPATH' ) || die( esc_html( __( 'Not allowed', 'kredeum-nfts' ) ) );
define( 'KREDEUM_NFTS_PLUGIN_PATH', plugin_dir_path( __FILE__ ) );
define( 'KREDEUM_NFTS_PLUGIN_URL', plugin_dir_url( __FILE__ ) );

if ( is_admin() ) {
	define( 'IPFS_CID_VERSION', '1' );
	define( 'STORAGE_AUTO', get_option( '_KRE_STORAGE_AUTO', array( '' ) )[0] );
	define( 'STORAGE_CHOICE', get_option( '_KRE_STORAGE_CHOICE', array( '' ) )[0] );
	define( 'IPFS_API', get_option( 'IPFS_API', array( '' ) )[0] );
	define( 'IPFS_CLUSTER_API', get_option( 'IPFS_CLUSTER_API', array( '' ) )[0] );
	define( 'IPFS_PINNING_API', get_option( 'IPFS_PINNING_API', array( '' ) )[0] );

	require_once KREDEUM_NFTS_PLUGIN_PATH . 'admin/nfts/index.php';

	require_once KREDEUM_NFTS_PLUGIN_PATH . 'admin/ajax/ajax.php';

	require_once KREDEUM_NFTS_PLUGIN_PATH . 'admin/storage/import.php';
	require_once KREDEUM_NFTS_PLUGIN_PATH . 'admin/storage/multipart.php';
	require_once KREDEUM_NFTS_PLUGIN_PATH . 'admin/storage/ipfs/nft-storage.php';
	require_once KREDEUM_NFTS_PLUGIN_PATH . 'admin/storage/swarm/swarm-bee.php';

	require_once KREDEUM_NFTS_PLUGIN_PATH . 'admin/storage/query.php';

	require_once KREDEUM_NFTS_PLUGIN_PATH . 'admin/media/post.php';
	require_once KREDEUM_NFTS_PLUGIN_PATH . 'admin/media/upload.php';

	require_once KREDEUM_NFTS_PLUGIN_PATH . 'admin/media-list/actions.php';
	require_once KREDEUM_NFTS_PLUGIN_PATH . 'admin/media-list/column.php';
	
	require_once KREDEUM_NFTS_PLUGIN_PATH . 'admin/post-list/actions.php';
	require_once KREDEUM_NFTS_PLUGIN_PATH . 'admin/post-list/column.php';
	require_once KREDEUM_NFTS_PLUGIN_PATH . 'admin/post-list/article-content.php';

	require_once KREDEUM_NFTS_PLUGIN_PATH . 'admin/settings/class-settings.php';
	require_once KREDEUM_NFTS_PLUGIN_PATH . 'admin/settings/fields.php';

	require_once KREDEUM_NFTS_PLUGIN_PATH . 'vendor/autoload.php';
	
	$api = new \RestClient( array( 'base_url' => '' ) );

	add_action(
		'admin_enqueue_scripts',
		function ( $hook ) {
			if ( 'nfts_page_storage_settings' === $hook || 'toplevel_page_nfts' === $hook || 'upload.php' === $hook || 'edit.php' === $hook ) {
				wp_enqueue_script( 'kredeum_nfts', plugin_dir_url( __FILE__ ) . 'lib/js/kredeum-nfts.js', array(), KREDEUM_NFTS_VERSION, true );
				wp_register_style( 'kredeum_nfts_css', plugin_dir_url( __FILE__ ) . 'lib/js/kredeum-nfts.css', KREDEUM_NFTS_VERSION, true );
				wp_enqueue_style( 'kredeum_nfts_css' );
			}
			if ( 'nfts_page_storage_settings' === $hook || 'toplevel_page_nfts' === $hook || 'upload.php' === $hook || 'edit.php' === $hook ) {
				wp_register_style( 'kredeum_nfts_front_css', plugin_dir_url( __FILE__ ) . 'lib/css/front.css', KREDEUM_NFTS_VERSION, true );
				wp_enqueue_style( 'kredeum_nfts_front_css' );
			}
			if ( 'nfts_page_storage_settings' === $hook ) {
				wp_enqueue_script( 'kredeum_nfts_js', plugin_dir_url( __FILE__ ) . 'admin/settings/storage-choice.js', array(), KREDEUM_NFTS_VERSION, true );
			}
		},
		110
	);
}

// IPFS.
define( 'IPFS_GATEWAY', '{{storage.ipfs.gateway}}' );
define( 'NFT_STORAGE_ENDPOINT', '{{storage.ipfs.apiEndpoint}}' );
define( 'NFT_STORAGE_KEY', get_option( '_KRE_IPFS_STORAGE_KEY', '' ) ? get_option( '_KRE_IPFS_STORAGE_KEY', '' ) : '{{storage.ipfs.apiKey}}' );

// SWARM.
define( 'SWARM_GATEWAY', '{{storage.swarm.gateway}}' );
define( 'SWARM_ENDPOINT', get_option( '_KRE_SWARM_ENDPOINT', '' ) ? get_option( '_KRE_SWARM_ENDPOINT', '' ) : '{{storage.swarm.apiEndpoint}}' );
define( 'SWARM_BATCH_ID', get_option( '_KRE_SWARM_STORAGE_KEY', '' ) ? get_option( '_KRE_SWARM_STORAGE_KEY', '' ) : '{{storage.swarm.apiKey}}' );

require_once KREDEUM_NFTS_PLUGIN_PATH . 'common/storage/uri.php';
require_once KREDEUM_NFTS_PLUGIN_PATH . 'common/storage/link.php';
require_once KREDEUM_NFTS_PLUGIN_PATH . 'common/storage/links.php';

require_once KREDEUM_NFTS_PLUGIN_PATH . 'common/shortcode/shortcode.php';
require_once KREDEUM_NFTS_PLUGIN_PATH . 'public/front/automarket.php';

// require_once KREDEUM_NFTS_PLUGIN_PATH . 'public/post/bottom.php'; .

add_action(
	'plugins_loaded',
	function () {
		load_plugin_textdomain( 'kredeum-nfts', false, 'kredeum-nfts/languages' );
	}
);