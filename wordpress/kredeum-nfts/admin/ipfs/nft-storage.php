<?php
/**
 * IPFS NFT STORAGE
 *
 * @package kredeum/nfts
 */

namespace KredeumNFTs\Ipfs;

/**
 * IPFS add and pin file with NFT Storage
 *
 * @param string $attachment_id Id attachment file.
 * @param int    $version CID version : 1 (or 0).
 *
 * @return string CID hash
 */
function nft_storage_add_and_pin( $attachment_id, $version = IPFS_CID_VERSION ) {
	$api = new \RestClient( array( 'base_url' => 'https://api.nft.storage' ) );

	$boundary = md5( time() );
	$file     = file_get_contents( get_attached_file( $attachment_id ) );
	$filename = get_attached_file_meta( $attachment_id )->filename;
	$parts    = array(
		array(
			'type'    => 'file',
			'name'    => $filename,
			'content' => $file,
		),
	);

	$buffer  = multipart( $parts, $boundary );
	$headers = array(
		'Authorization'  => 'Bearer ' . IPFS_NFT_STORAGE_KEY,
		'Content-Type'   => 'multipart/form-data; boundary=' . $boundary,
		'Content-Length' => strlen( $buffer ),
	);
	$result  = $api->post( '/upload', $buffer, $headers );

	// var_dump($result->decode_response()->value->cid);
	// var_dump($result->decode_response()->value->files[0]->name);
	// .

	return ( 200 === $result->info->http_code ) ?
	$result->decode_response()->value->cid . '/' .
	$result->decode_response()->value->files[0]->name
	: $result->error;
}
