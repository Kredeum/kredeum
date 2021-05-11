<?php
/**
 * Public IPFS LINK function
 *
 * @package kredeum/nfts
 */

/**
 * Return IPFS url
 *
 * @param string $cid file CID.
 * @return string cid with path
 */
function ipfs_url( $cid ) {
	return $cid ? IPFS_GATEWAY . "/ipfs/$cid" : '';
}

/**
 * Return IPFS link
 *
 * @param string $cid : file CID.
 * @param string $text : text for the link.
 * @return string html link to CID with text
 */
function ipfs_link( $cid, $text = '' ) {
	if ( ! $text ) {
		$text = $cid;
	}
	$url = esc_url( ipfs_url( $cid ) );
	$txt = esc_html( $text );

	return $cid ? "<a href='$url'>$txt</a>" : '';
}
