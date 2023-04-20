<?php
/**
 * Uninstall Kredeum NFTs
 *
 * @package kredeum/nfts
 */

defined( 'WP_UNINSTALL_PLUGIN' ) || die( esc_html( __( 'Not allowed', 'kredeum-nfts' ) ) );


/**
 * Clear database data
 */
global $wpdb;
$wpdb->query( $wpdb->prepare( 'DELETE FROM %1s WHERE meta_key LIKE %s', _get_meta_table( 'post' ), '_kre_%' ) );


/**
 * Clear settings
 */
$wpdb->query( "DELETE FROM $wpdb->options WHERE option_name LIKE '_kre_%'" );
