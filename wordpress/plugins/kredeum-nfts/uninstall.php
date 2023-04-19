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
delete_option( '_kre_storage_auto' );
delete_option( '_kre_storage_choice' );
delete_option( '_kre_select_collection' );
delete_option( '_kre_nft_storage_key' );
delete_option( '_kre_swarm_node_url' );
delete_option( '_kre_swarm_batch_id' );
