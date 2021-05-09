<?php
// Uninstall IPFS
defined("WP_UNINSTALL_PLUGIN") or die(__('Not allowed', 'kredeum-nfts'));

// clear database data
global $wpdb;
$postmeta_table = $wpdb->postmeta;
$postmeta_table = str_replace($wpdb->base_prefix, $wpdb->prefix, $postmeta_table);
$wpdb->query("DELETE FROM " . $postmeta_table . " WHERE meta_key = 'CID'");
