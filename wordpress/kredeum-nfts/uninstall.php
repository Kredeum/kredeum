<?php
/**
 * Uninstall IPFS
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
delete_option( 'ipfs_auto' );
delete_option( 'kredeum_beta' );
delete_option( 'ipfs_nft_storage_key' );
delete_option( 'select_collection' );
