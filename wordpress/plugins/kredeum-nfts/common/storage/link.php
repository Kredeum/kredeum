<?php
/**
 * Public Storage LINK function
 *
 * @package kredeum/nfts
 */

namespace KredeumNFTs\Storage;

/**
 * Return Storage url
 *
 * @param string $uri file URI.
 * @return string uri with path
 */
function url( $uri ) {
	$parts   = explode( '://', $uri );
	$storage = $parts[0];
	$hash    = $parts[1];

	if ( 'ipfs' === $storage ) {
		return IPFS_GATEWAY . $hash;
	}

	if ( 'swarm' === $storage ) {
		return SWARM_GATEWAY . $hash;
	}
}

/**
 * Return Short uri text
 *
 * @param string $uri file URI.
 * @return string uri short
 */
function short_uri( string $uri ) {
	$parts   = explode( '://', $uri );
	$storage = $parts[0];
	$hash    = $parts[1];
	if ( ! ( $storage && $hash && strlen( $hash ) > 20 ) ) {
		return $uri;
	}

	return sprintf( '%s://%s...%s', $storage, substr( $hash, 0, 8 ), substr( $hash, -8 ) );
}


/**
 * Return Storage link
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
