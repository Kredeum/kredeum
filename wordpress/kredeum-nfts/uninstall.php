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
$postmeta_table = $wpdb->postmeta;
$postmeta_table = str_replace( $wpdb->base_prefix, $wpdb->prefix, $postmeta_table );
$wpdb->query( $wpdb->prepare( 'DELETE FROM %s WHERE meta_key = "_kre_cid"', $postmeta_table ) );
