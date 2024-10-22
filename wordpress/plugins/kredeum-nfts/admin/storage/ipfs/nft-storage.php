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
function nft_storage_add_and_pin( $file ) {
	if ( defined( 'IPFS_ENDPOINT' ) ) {
		$api     = new \RestClient( array( 'base_url' => IPFS_ENDPOINT ) );
		$headers = array( 'Authorization' => 'Bearer ' . IPFS_STORAGE_KEY );

		$file_stream = fopen( $file, 'r' );

		if ( ! $file_stream ) {
			die( "Impossible d'ouvrir le fichier en tant que stream" );
		}

		fclose( $file_stream );

		$body = array(
			'file'          => $file_stream,
			'pinataOptions' => json_encode( array( 'cidVersion' => 1 ) ),
		);

		$result = $api->post( '/', $body, $headers );

		// var_dump( $result->decode_response() ); die();.

		return ( 200 === $result->info->http_code ) ? $result->decode_response()->value->IpfsHash : $result->error;
	}
}
