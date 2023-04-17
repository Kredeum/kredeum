<?php
/**
 * Public IPFS LINK function
 *
 * @package kredeum/nfts
 */

namespace KredeumNFTs\Storage;

/**
 * Return IPFS url
 *
 * @param string $cid file CID.
 * @return string cid with path
 */
function url( $cid ) {
	return $cid ? IPFS_GATEWAY . $cid : '';
}

/**
 * Return IPFS link
 *
 * @param string $cid : file CID.
 * @param string $text : text for the link.
 * @return string html link to CID with text
 */
function link( $cid, $text = '' ) {
	if ( ! $text ) {
		$text = $cid;
	}
	$url = esc_url( url( $cid ) );
	$txt = esc_html( $text );

	return $cid ? "<a href='$url'>$txt</a>" : '';
}