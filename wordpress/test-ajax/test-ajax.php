<?php

/**
 * Plugin Name: Test Ajax
 * Plugin URI: 
 * Description: Test WordPress Ajax
 * Version: 1.0
 * Author: Haris Ainur Rozak
 * Author URI: https://github.com/harisrozak
 */

require_once(plugin_dir_path(__FILE__) . 'ajax.php');

add_action('admin_menu', function () {
  add_menu_page('Test Ajax', 'Test Ajax', 'moderate_comments', 'test-ajax/test.php');
});

add_action('admin_enqueue_scripts', function () {
  wp_enqueue_script('test-ajax', plugin_dir_url(__FILE__) . "script.js");
  wp_enqueue_script('metamask', plugin_dir_url(__FILE__) . "metamask.js");
}, 100);
