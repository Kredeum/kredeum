<?php
/**
 * Multipart addtion to tcdent/php-restclient
 *
 * @package kredeum/nfts
 */

namespace KredeumNFTs\Storage\Ipfs;

/**
 * Multipart
 *
 * @param array  $parts parts to assemble.
 * @param string $boundary boundary to split parts.
 *
 * @return string $ret multipart
 */
function multipart( $parts, $boundary ) {
	$ret = '';
	foreach ( $parts as $part ) {

		$type    = array_key_exists( 'type', $part ) ? $part['type'] : 'text';
		$name    = array_key_exists( 'name', $part ) ? $part['name'] : 'name';
		$content = array_key_exists( 'content', $part ) ? $part['content'] : '';
		$headers = array_key_exists( 'headers', $part ) ? $part['headers'] : array();
		$disp    = "Content-Disposition: form-data; name=$name;\r\n";

		$ret .= "--$boundary\r\n";

		if ( 'text' === $type ) {
			$ret .= "Content-Type: text/plain\r\n";
		} elseif ( 'file' === $type ) {
			$ret .= "Content-Type: application/octet-stream\r\n";
			$disp = "Content-Disposition: form-data; name=file; filename=$name\r\n";
		} elseif ( 'json' === $type ) {
			$ret .= "Content-Type: application/json\r\n";
		} elseif ( 'text' === $type ) {
			$ret .= "Content-Type: text/plain\r\n";
		} elseif ( 'html' === $type ) {
			$ret .= "Content-Type: text/html\r\n";
		}
		foreach ( $headers as $key => $value ) {
			$ret .= "$key: $value\r\n";
		}
		$ret .= "$disp\r\n$content\r\n";
	}
	$ret .= "--$boundary--\r\n";

	return $ret;
}
