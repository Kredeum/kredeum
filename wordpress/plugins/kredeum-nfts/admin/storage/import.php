<?php
/**
 * Decentralized Storage IMPORT
 *
 * @package kredeum/nfts
 */

namespace KredeumNFTs\Storage;

/**
 * Decentralized Storage import url
 *
 * @param string $url URL to import.
 *
 * @return string $post_id
 */
function import_url( $url ) {
	global $wpdb;
	$res = $wpdb->query( $wpdb->prepare( "SELECT * FROM `%1s` WHERE meta_key='_kre_url' AND meta_value=%s", _get_meta_table( 'post' ), $url ) );

	if ( 0 == $res ) {
		$file_array         = array();
		$file_array['name'] = 'media.png';
		$ret                = download_url( $url );
		if ( ! is_wp_error( $ret ) ) {
			$file_array['tmp_name'] = $ret;
			$ret                    = media_handle_sideload( $file_array );
			if ( is_wp_error( $ret ) ) {
				@unlink( $file_array['tmp_name'] );
			} else {
				add_post_meta( $ret, '_kre_url', $url );
			}
		}
	}
	return $ret;
}

/**
 * Decentralized Storage import URI
 *
 * @param string $uri Dec Storage URI to import.
 *
 * @return string $post_id
 */
function import_uri( $uri ) {
	global $wpdb;
	$res = $wpdb->query( $wpdb->prepare( "SELECT * FROM `%1s` WHERE meta_key='_kre_uri' AND meta_value=%s", _get_meta_table( 'post' ), $uri ) );

	if ( 0 == $res ) {
		$ret = import_url( url( $uri ) );
	}
	return $ret;
}

/**
 * Decentralized Storage import NFT
 *
 * @param string $nft nft data.
 *
 * @return string $post_id
 */
function import_nft( $nft ) {
	if ( isset( $nft->uri ) ) {
		$pid = import_uri( $nft->uri );
	} elseif ( isset( $nft->image ) ) {
		$pid = import_url( $nft->image );
	}

	if ( isset( $nft->nid ) ) {
		add_post_meta( $pid, '_kre_nid', $nft->nid, true );
	}
	return $pid;
}