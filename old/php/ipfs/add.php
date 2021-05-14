<?php
/**
 * IPFS add
 *
 * @package kredeum/nfts
 */

namespace \Admin\Ipfs;
/**
 * IPFS add file function
 *
 * @param string $attachment_id Id attachment file.
 * @param int    $version CID version : 1 (or 0).
 *
 * @return string CID hash
 */
function add( $attachment_id, $version = IPFS_CID_VERSION ) {
	$api = new RestClient( array( 'base_url' => IPFS_API ) );

	$boundary = md5( time() );
	$file     = file_get_contents( get_attached_file( $attachment_id ) );
	$parts    = array(
		array(
			'type'    => 'file',
			'name'    => ipfs_get_attached_file_meta( $attachment_id )->filename,
			'content' => $file,
		),
	);
	$buffer   = multipart( $parts, $boundary );
	$headers  = array(
		'Content-Type'   => 'multipart/form-data; boundary=' . $boundary,
		'Content-Length' => strlen( $buffer ),
	);

	$result = $api->post( "/add?cid-version=$version", $buffer, $headers );

	return ( 200 === $result->info->http_code ) ? $result->decode_response()->Hash : $result->error;
}
