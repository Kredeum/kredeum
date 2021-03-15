<?php
/**
 * @package Metamask
 * @version 0.0.3
 */
/*
Plugin Name: Metamask
Plugin URI: https://wordpress.org/plugins/metamask23_131/
Description: intégration metamask
Author: Al P
Version: 0.0.3
Author URI: https://www.kredeum.com
*/

function metamask_script(){
	printf('<script defer src="' . WP_PLUGIN_URL . '/metamask/metamask.js"></script>' );
}
add_action( 'wp_head', 'metamask_script' );

function metamask() {
	printf('<li id="metamask"><kredeum-metamask></li>' );
}
add_action( 'wp_meta', 'metamask' );
