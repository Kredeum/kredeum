<?php
/**
 * IPFS NFT STORAGE
 *
 * @package kredeum/nfts
 */

namespace KredeumNFTs\Storage;

/**
 * IPFS add and pin file inside directory with NFT Storage
 *
 * @param string $attachment_id Id attachment file.
 *
 * @return string CID hash
 */
function nft_storage_add_and_pin_dir( $attachment_id ) {
	$api = new \RestClient( array( 'base_url' => IPFS_ENDPOINT ) );

	$file     = file_get_contents( get_attached_file( $attachment_id ) );
	$filename = get_attached_file_meta( $attachment_id )->filename;

	$boundary = md5( time() );
	$parts    = array(
		array(
			'type'    => 'file',
			'name'    => $filename,
			'content' => $file,
		),
	);
	$buffer   = multipart( $parts, $boundary );
	$headers  = array(
		'Authorization'  => 'Bearer ' . IPFS_STORAGE_KEY,
		'Content-Type'   => 'multipart/form-data; boundary=' . $boundary,
		'Content-Length' => strlen( $buffer ),
	);

	$result = $api->post( '/', $buffer, $headers );

	// var_dump($result->decode_response()->value->cid);
	// var_dump($result->decode_response()->value->files[0]->name);
	// .

	return ( 200 === $result->info->http_code ) ?
	$result->decode_response()->value->IpfsHash . '/' .
	$result->decode_response()->value->files[0]->name
	: $result->error;
}

	/**
	 * IPFS add and pin file with NFT Storage
	 *
	 * @param string $file file to upload.
	 *
	 * @return string CID hash
	 */
function nft_storage_add_and_pin( $file_id ) {
	if ( defined( 'IPFS_ENDPOINT' ) ) {
		$api = new \RestClient( array( 'base_url' => IPFS_ENDPOINT ) );

		$file_content     = file_get_contents( get_attached_file( $file_id ) );
		$filename = get_attached_file_meta( $file_id )->filename;

		$boundary = md5( rand() );
		$buffer = "--{$boundary}\r\n";
		$buffer .= "Content-Disposition: form-data; name=\"file\"; filename=\"" . $filename . "\"\r\n";
		$buffer .= "Content-Type: application/octet-stream\r\n\r\n";
		$buffer .= $file_content . "\r\n";

		$buffer .= "--{$boundary}\r\n";
		$buffer .= "Content-Disposition: form-data; name=\"pinataOptions\"\r\n\r\n";
		$buffer .= json_encode( [
			"cidVersion" => 1
		] ) . "\r\n";

		$buffer .= "--{$boundary}--\r\n";

		$headers  = array(
			'Authorization'  => 'Bearer ' . IPFS_STORAGE_KEY,
			'Content-Type'   => 'multipart/form-data; boundary=' . $boundary,
		);

		$result = $api->post( '/', $buffer, $headers );

		// var_dump( $result->decode_response()->IpfsHash ); die();

		return ( 200 === $result->info->http_code ) ? $result->decode_response()->IpfsHash : $result->error;
	}
}
