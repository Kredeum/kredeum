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

/**
 * admin menu
 */
add_action('admin_menu', 'test_ajax_menu');
function test_ajax_menu()
{
  add_menu_page('Test Ajax', 'Test Ajax', 'moderate_comments', 'test-ajax/test.php');
}

/**
 * admin_enqueue_scripts
 */
add_action('admin_enqueue_scripts', 'test_ajax_admin_enqueue_scripts', 100);
function test_ajax_admin_enqueue_scripts()
{
  wp_enqueue_script('test-ajax-admin-js', plugin_dir_url(__FILE__) . "script.js");
}
