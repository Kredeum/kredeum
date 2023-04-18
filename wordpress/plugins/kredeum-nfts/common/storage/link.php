<?php
/**
 * Public Decentralized Storage LINK function
 *
 * @package kredeum/nfts
 */

namespace KredeumNFTs\Storage;

/**
 * Return Decentralized Storage url
 *
 * @param string $uri file URI.
 * @return string uri with path
 */
function url( $uri ) {
	$url = '';
	if ($uri) {
		if (strpos($uri, IPFS_URI) === 0) {
			$url = IPFS_GATEWAY . str_replace(IPFS_URI, '', $uri);
		} elseif (strpos($uri, SWARM_URI) === 0) {
			$url = SWARM_GATEWAY . str_replace(SWARM_URI, '', $uri);
		}
	}
	
	return $url;
}

/**
 * Return Decentralized Storage link
 *
 * @param string $uri : file URI.
 * @param string $text : text for the link.
 * @return string html link to URI with text
 */
function link( $uri, $text = '' ) {
	if ( ! $text ) {
		$text = $uri;
	}
	$url = esc_url( url( $uri ) );
	$txt = esc_html( $text );

	return $uri ? "<a href='$url'>$txt</a>" : '';
}