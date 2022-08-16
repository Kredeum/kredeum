<?php
/**
 *
 * Plugin Name: SwarmPress
 * Description: Plugin to archive your medias to SWARM and mint them as NFTs
 * Plugin URI: https://docs.kredeum.tech
 * Version: 0.1.0
 * Author: Kredeum <alain@kredeum.com>
 * Author URI: https://www.kredeum.com
 * Text domain: swarmpress
 * Domain Path: /languages
 *
 * Copyright 2020-2022 Kredeum
 *
 * @package swarmpress
 */

namespace SwarmPress;

define( 'SWARMPRESS_VERSION', '0.1.0' );
define( 'SWARM_STORAGE', 'swarm' );
define( 'SWARM_STORAGE_REF', '_kre_swarmref' );

defined( 'ABSPATH' ) || die( esc_html( __( 'Not allowed', 'swarmpress' ) ) );
define( 'SWARMPRESS_PLUGIN_PATH', plugin_dir_path( __FILE__ ) );

if ( is_admin() ) {
	define( 'SWARM_AUTO_ARCHIVE', get_option( 'SWARM_AUTO_ARCHIVE', array( '' ) )[0] );

	require_once SWARMPRESS_PLUGIN_PATH . 'admin/storage/query.php';

	require_once SWARMPRESS_PLUGIN_PATH . 'admin/swarm/swarm-bee.php';
	require_once SWARMPRESS_PLUGIN_PATH . 'admin/swarm/query.php';

	require_once SWARMPRESS_PLUGIN_PATH . 'admin/media/post.php';
	require_once SWARMPRESS_PLUGIN_PATH . 'admin/media/upload.php';

	require_once SWARMPRESS_PLUGIN_PATH . 'admin/media-list/actions.php';
	require_once SWARMPRESS_PLUGIN_PATH . 'admin/media-list/column.php';

	require_once SWARMPRESS_PLUGIN_PATH . 'admin/settings/class-settings.php';
	require_once SWARMPRESS_PLUGIN_PATH . 'admin/settings/fields.php';

	if ( ! class_exists( 'RestClientException' ) ) {
		require_once SWARMPRESS_PLUGIN_PATH . 'vendor/tcdent/php-restclient/restclient.php';
	}

	$swarm_api = new \RestClient( array( 'base_url' => '' ) );

	add_action(
		'admin_enqueue_scripts',
		function ( $hook ) {
			if ( 'toplevel_page_swarm_settings' === $hook || 'upload.php' === $hook ) {
				wp_enqueue_script( 'kredeum_nfts', plugin_dir_url( __FILE__ ) . 'lib/js/kredeum-nfts.js', array(), SWARMPRESS_VERSION, true );
				wp_register_style( 'kredeum_nfts_css', plugin_dir_url( __FILE__ ) . 'lib/js/kredeum-nfts.css', SWARMPRESS_VERSION, true );
				wp_enqueue_style( 'kredeum_nfts_css' );
			}
		},
		110
	);
}

define( 'SWARM_SERVER', 'https://api.gateway.ethswarm.org' );
define( 'SWARM_GATEWAY', 'https://api.gateway.ethswarm.org/bzz/' );
define( 'SWARM_NODE_URL', get_option( 'SWARM_NODE_URL', '' ) ? get_option( 'SWARM_NODE_URL', '' ) : SWARM_SERVER );
define( 'SWARM_BATCH_ID', get_option( 'SWARM_BATCH_ID', '' ) ? get_option( 'SWARM_BATCH_ID', '' ) : '0000000000000000000000000000000000000000000000000000000000000000' );

require_once SWARMPRESS_PLUGIN_PATH . 'common/storage/cid.php';
require_once SWARMPRESS_PLUGIN_PATH . 'common/storage/link.php';

require_once SWARMPRESS_PLUGIN_PATH . 'common/helpers/storage.php';

add_action(
	'plugins_loaded',
	function () {
		load_plugin_textdomain( 'swarmpress', false, 'swarmpress/languages' );
	}
);
