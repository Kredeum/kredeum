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
$wpdb->query( $wpdb->prepare( 'DELETE FROM %1s WHERE meta_key LIKE %s', _get_meta_table( 'post' ), '_kredeum_nfts_%' ) );
$wpdb->query( $wpdb->prepare( 'DELETE FROM %1s WHERE option_name LIKE %s', _get_meta_table( 'options' ), 'kredeum_nfts_%' ) );


/**
 * Clear settings
*/
delete_options( 'kredeum_ntfs_ipfs_auto' );
delete_options( 'kredeum_ntfs_beta' );
delete_options( 'kredeum_ntfs_ipfs_nft_storage_key' );
delete_options( 'kredeum_ntfs_default_collection' );
