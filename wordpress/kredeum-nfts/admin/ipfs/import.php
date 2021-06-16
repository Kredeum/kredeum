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
function import( $url ) {
	$file_array         = array();
	$file_array['name'] = 'media.png';
	$ret                = download_url( $url );
	if ( ! is_wp_error( $ret ) ) {
		$file_array['tmp_name'] = $ret;
		$ret                    = media_handle_sideload( $file_array );
		if ( is_wp_error( $ret ) ) {
			@unlink( $file_array['tmp_name'] );
		} else {
			add_post_meta( $ret, '_source_url', $url );
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
	return import( IPFS_GATEWAY . $cid );
}

/**
 * IPFS import NFT
 *
 * @param string $nft_token_id tokenId of NFT.
 * @param string $nft_contract address of NFT contract.
 * @param string $nft_chain_id chainId of NFT contract.
 *
 * @return string $post_id
 */
function import_nft( $nft_token_id, $nft_contract, $nft_chain_id ) {
	return import( '' );
}
