<?php
/**
 * IPFS NFT STORAGE
 *
 * @package kredeum/nfts
 */

namespace KredeumNFTs\Ipfs;

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

	/**
	 * SWARM add and pin file with Swarm Gateway
	 *
	 * @param string $attachment_id Id attachment file.
	 *
	 * @return string CID hash
	 */
function swarm_add_and_pin( $attachment_id ) {
	if ( defined( 'SWARM_NODE_URL' ) && defined( 'SWARM_BATCH_ID' ) ) {
		$swarm_pin = false;

		if ( SWARM_BATCH_ID !== '0000000000000000000000000000000000000000000000000000000000000000' ) {
			$swarm_pin = true;
		}

		$api = new \RestClient( array( 'base_url' => SWARM_NODE_URL ) );

		$file         = file_get_contents( get_attached_file( $attachment_id ) );
		$filename     = get_attached_file_meta( $attachment_id )->filename;
		$content_type = get_post_mime_type( $attachment_id );

		$headers = array(
			'swarm-postage-batch-id' => SWARM_BATCH_ID,
			'swarm-pin'              => $swarm_pin,
			'Content-Type'           => $content_type,
		);

		$result = $api->post( '/bzz', $file, $headers );
	}

	// var_dump($result->decode_response()->reference);
	// var_dump(SWARM_NODE_URL);
	// var_dump($result->info->http_code);
	// die();
	// .

	return ( 201 === $result->info->http_code ) ? 'swarm-' . $result->decode_response()->reference : $result->error;
}
