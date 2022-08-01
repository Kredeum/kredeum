<?php
/**
 * Uninstall SWARMPRESS
 *
 * @package swarmpress
 */

defined( 'WP_UNINSTALL_PLUGIN' ) || die( esc_html( __( 'Not allowed', 'swarmpress' ) ) );


/**
 * Clear database data
*/
global $wpdb;
$wpdb->query( $wpdb->prepare( 'DELETE FROM %1s WHERE meta_key LIKE %s', _get_meta_table( 'post' ), '_kre_%' ) );


/**
 * Clear settings
*/
delete_option( 'auto_archive' );
delete_option( 'SWARM_NODE_URL' );
delete_option( 'SWARM_BATCH_ID' );
delete_option( 'select_collection' );
