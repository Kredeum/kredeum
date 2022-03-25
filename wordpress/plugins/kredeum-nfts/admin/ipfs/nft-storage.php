<?php
/**
 * IPFS NFT STORAGE
 *
 * @package kredeum/nfts
 */

namespace KredeumNFTs\Ipfs;

define( 'NFT_STORAGE_KEY', get_option( 'NFT_STORAGE_KEY', array( 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweEVkYzMzMjZEODc3OGU5QWVhMGZGMzc0MmEyRERGRDREM0E0NTYzNTciLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTYyMTAwMjI3ODIzNywibmFtZSI6Im9wZW4tbmZ0cyJ9.EJeI37e2D9k09coXLIz8IgqFi85gHlLteE-ETMcRt8I' ) )[0] );

/**
 * IPFS add and pin file inside directory with NFT Storage
 *
 * @param string $attachment_id Id attachment file.
 *
 * @return string CID hash
 */
function nft_storage_add_and_pin_dir( $attachment_id ) {
	$api = new \RestClient( array( 'base_url' => 'https://api.nft.storage' ) );

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
		'Authorization'  => 'Bearer ' . NFT_STORAGE_KEY,
		'Content-Type'   => 'multipart/form-data; boundary=' . $boundary,
		'Content-Length' => strlen( $buffer ),
	);

	$result = $api->post( '/upload', $buffer, $headers );

	// var_dump($result->decode_response()->value->cid);
	// var_dump($result->decode_response()->value->files[0]->name);
	// .

	return ( 200 === $result->info->http_code ) ?
	$result->decode_response()->value->cid . '/' .
	$result->decode_response()->value->files[0]->name
	: $result->error;
}

	/**
	 * IPFS add and pin file with NFT Storage
	 *
	 * @param string $attachment_id Id attachment file.
	 *
	 * @return string CID hash
	 */
function nft_storage_add_and_pin( $attachment_id ) {
	$api = new \RestClient( array( 'base_url' => 'https://api.nft.storage' ) );

	$file     = file_get_contents( get_attached_file( $attachment_id ) );
	$filename = get_attached_file_meta( $attachment_id )->filename;

	$headers = array(
		'Authorization' => 'Bearer ' . NFT_STORAGE_KEY,
	);

	$result = $api->post( '/upload', $file, $headers );

	// var_dump($result->decode_response()->value->cid);
	// var_dump($result->decode_response()->value->files[0]->name);
	// .

	return ( 200 === $result->info->http_code ) ? $result->decode_response()->value->cid : $result->error;
}
