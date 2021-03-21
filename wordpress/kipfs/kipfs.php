<?php
/*
Plugin Name: WP Plugin IPFS
Description: Allow media storage into IPFS
Plugin URI: https://www.kredeum.com/kipfs
Version: 0.1.3
Requires at least: 4.0.0
Requires PHP: 5.4
Author: Kredeum <alain@kredeum.com>
Author URI: https://www.kredeum.com
License: GPLv3
License URI: https://www.gnu.org/licenses/gpl-3.0.html
Text domain: kipfs
Domain Path: /languages

Copyright 2020-2021 kredeum  
*/


defined('ABSPATH') or die(__('Not allowed', 'kipfs'));
define('KIPFS_PLUGIN_PATH', plugin_dir_path(__FILE__));

if (is_admin()) {
  define('IPFS_AUTO', get_option('IPFS_AUTO', [0])[0]);
  define('IPFS_CID_VERSION', get_option('IPFS_CID_VERSION', [0])[0]);
  define('IPFS_API', get_option('IPFS_API', [''])[0]);
  define('IPFS_CLUSTER_API', get_option('IPFS_CLUSTER_API', [''])[0]);
  define('IPFS_PINNING_API', get_option('IPFS_PINNING_API', [''])[0]);

  require_once(KIPFS_PLUGIN_PATH . 'admin/ajax/ajax.php');

  require_once(KIPFS_PLUGIN_PATH . 'admin/ipfs/add.php');
  require_once(KIPFS_PLUGIN_PATH . 'admin/ipfs/pin.php');
  require_once(KIPFS_PLUGIN_PATH . 'admin/ipfs/pinata.php');
  require_once(KIPFS_PLUGIN_PATH . 'admin/ipfs/query.php');

  require_once(KIPFS_PLUGIN_PATH . 'admin/media/delete.php');
  require_once(KIPFS_PLUGIN_PATH . 'admin/media/new.php');
  require_once(KIPFS_PLUGIN_PATH . 'admin/media/post.php');

  require_once(KIPFS_PLUGIN_PATH . 'admin/media_list/actions.php');
  require_once(KIPFS_PLUGIN_PATH . 'admin/media_list/column.php');

  require_once(KIPFS_PLUGIN_PATH . 'admin/settings/fields.php');
  require_once(KIPFS_PLUGIN_PATH . 'admin/settings/settings.php');

  require_once(KIPFS_PLUGIN_PATH . 'lib/php/restclient.php');

  $api = new RestClient(['base_url' => '']);
}



define('IPFS_GATEWAY', get_option('IPFS_GATEWAY', [''])[0]);
define('IPFS_PINATA_API', 'https://api.pinata.cloud');
define('IPFS_PINATA_KEY', get_option('IPFS_PINATA_KEY', ''));
define('IPFS_PINATA_SECRET', get_option('IPFS_PINATA_SECRET', ''));

require_once(KIPFS_PLUGIN_PATH . 'public/ipfs/cid.php');
require_once(KIPFS_PLUGIN_PATH . 'public/ipfs/link.php');
require_once(KIPFS_PLUGIN_PATH . 'public/ipfs/links.php');
require_once(KIPFS_PLUGIN_PATH . 'public/post/bottom.php');

add_action('plugins_loaded', function () {
  load_plugin_textdomain('kipfs', FALSE, KIPFS_PLUGIN_PATH . '/languages/');
});




/** Step 2 (from text above). */
add_action('admin_menu', 'my_plugin_menu');

/** Step 1. */
function my_plugin_menu()
{
  add_options_page('My Plugin Options', 'Kredeum NFTs', 'manage_options', 'my-unique-identifier', 'my_plugin_options');
}

/** Step 3. */
function my_plugin_options()
{
  if (!current_user_can('manage_options')) {
    wp_die(__('You do not have sufficient permissions to access this page.'));
  }
  echo '<kredeum-nft/>';
}
