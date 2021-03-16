<?php
/*
Plugin Name: Metamask
Plugin URI: https://wordpress.org/plugins/metamask23_131/
Description: intégration metamask
Author: Al P
Version: 0.0.3
Author URI: https://www.kredeum.com
*/

add_action('admin_enqueue_scripts', function () {
  wp_enqueue_script('metamask', plugin_dir_url(__FILE__) . "metamask.js");
}, 100);
