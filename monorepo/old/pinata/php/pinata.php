<?php
/**
 * IPFS PINITA
 *
 * @package kredeum/nfts
 */

namespace KredeumNFTs\Ipfs;

/**
 * IPFS add and pin file with PINATA
 *
 * @param string $attachment_id Id attachment file.
 * @param int    $version CID version : 1 (or 0).
 *
 * @return string CID hash
 */
function pinata_add_and_pin( $attachment_id, $version = IPFS_CID_VERSION ) {
	$api = new \RestClient( array( 'base_url' => 'https://api.pinata.cloud' ) );

	$boundary = md5( time() );
	$file     = file_get_contents( get_attached_file( $attachment_id ) );
	$filename = get_attached_file_meta( $attachment_id )->filename;
	$parts    = array(
		array(
			'type'    => 'file',
			'name'    => $filename,
			'content' => $file,
		),
		array(
			'type'    => 'json',
			'name'    => 'pinataOptions',
			'content' => '{"cidVersion": "' . $version . '"}',
		),
		array(
			'type'    => 'json',
			'name'    => 'pinataMetadata',
			'content' => '{"name": "' . $filename . '", "keyvalues":{ "type": "image", "address": "' .
			  get_user_meta( get_current_user_id(), 'ADDR', true ) . '"}}',
		),
	);

	$buffer  = multipart( $parts, $boundary );
	$headers = array(
		'pinata_api_key'        => IPFS_PINATA_KEY,
		'pinata_secret_api_key' => IPFS_PINATA_SECRET,
		'Content-Type'          => 'multipart/form-data; boundary=' . $boundary,
		'Content-Length'        => strlen( $buffer ),
	);
	$result  = $api->post( '/pinning/pinFileToIPFS', $buffer, $headers );

	// var_dump($result);
	// .

	return ( 200 == $result->info->http_code ) ? $result->decode_response()->IpfsHash : $result->error;
}
