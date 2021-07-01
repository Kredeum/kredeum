<?php
/**
 * IPFS IMPORT
 *
 * @package kredeum/nfts
 */

namespace KredeumNFTs\Ipfs;

/**
 * IPFS import url
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
 * IPFS import CID
 *
 * @param string $cid IPFS CID to import.
 *
 * @return string $post_id
 */
function import_cid( $cid ) {
	global $wpdb;
	$res = $wpdb->query( $wpdb->prepare( "SELECT * FROM `%1s` WHERE meta_key='_kre_cid' AND meta_value=%s", _get_meta_table( 'post' ), $cid ) );

	if ( 0 == $res ) {
		$ret = import_url( url( $cid ) );
	}
	return $ret;
}

/**
 * IPFS import NFT
 *
 * @param string $nid nft Id.
 *
 * @return string $post_id
 */
function import_nft( $nft ) {
	if ( isset( $nft->cid ) ) {
		$pid = import_cid( $nft->cid );
	} elseif ( isset( $nft->image ) ) {
		$pid = import_url( $nft->image );
	}

	if ( isset( $nft->nid ) ) {
		add_post_meta( $pid, '_kre_nid', $nft->nid, true );
	}
	return $pid;
}
