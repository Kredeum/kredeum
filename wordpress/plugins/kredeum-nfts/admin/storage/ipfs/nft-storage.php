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
		// $api     = new \RestClient( array( 'base_url' => IPFS_ENDPOINT ) );
		// $headers = array( 'Authorization' => 'Bearer ' . IPFS_STORAGE_KEY );

		// $file_stream = fopen( $file, 'r' );

		// if ( ! $file_stream ) {
		// 	die( "Impossible d'ouvrir le fichier en tant que stream" );
		// }

		// fclose( $file_stream );

		// $body = array(
		// 	'file'          => $file_stream,
		// 	'pinataOptions' => json_encode( array( 'cidVersion' => 1 ) ),
		// );

		// $result = $api->post( '/', $body, $headers );

		// // var_dump( $result->decode_response() ); die();.

		// return ( 200 === $result->info->http_code ) ? $result->decode_response()->value->IpfsHash : $result->error;
		///////////////////////////////////////////
		// $encoded_file_content = base64_encode($file);

		$boundary = md5(rand());
		$post_fields = "--{$boundary}\r\n";
		$post_fields .= "Content-Disposition: form-data; name=\"file\"; filename=\"" . basename($file) . "\"\r\n";
		$post_fields .= "Content-Type: application/octet-stream\r\n\r\n";
		$post_fields .= file_get_contents($file) . "\r\n";

		$post_fields .= "--{$boundary}\r\n";
		$post_fields .= "Content-Disposition: form-data; name=\"pinataOptions\"\r\n\r\n";
		$post_fields .= json_encode([
			"cidVersion" => 1
		]) . "\r\n";

		$post_fields .= "--{$boundary}--\r\n";

		// var_dump( $post_fields ); die();

		$curl = curl_init();

		curl_setopt_array($curl, [
			CURLOPT_URL => "https://api.pinata.cloud/pinning/pinFileToIPFS",
			CURLOPT_RETURNTRANSFER => true,
			CURLOPT_ENCODING => "",
			CURLOPT_MAXREDIRS => 10,
			CURLOPT_TIMEOUT => 30,
			CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
			CURLOPT_CUSTOMREQUEST => "POST",
			CURLOPT_POSTFIELDS => $post_fields,
			CURLOPT_HTTPHEADER => [
				"Authorization: Bearer " . IPFS_STORAGE_KEY,
				"Content-Type: multipart/form-data; boundary=" . $boundary,
			],
		]);

		$response = curl_exec($curl);
		$err = curl_error($curl);

		// var_dump( $err ); die();
		return ( ! $err ) ? $response->IpfsHash : $err;
		///////////////////////////////////////////

		// $client = new \GuzzleHttp\Client(
	    //     [
		//         'base_uri' => 'https://api.pinata.cloud//pinning/pinFileToIPFS',
		//         'headers' => [
		// 	        'pinata_api_key' => IPFS_STORAGE_KEY,
		// 	        // 'pinata_secret_api_key' => Env::get('PINATA_SECRET_API_KEY'),
		//         ],
	    //     ]
        // );

		// if(file_exists($file)){
		// 	$contents = fopen($file, 'r');
		// } else {
		// 	$contents = $file;
		// }
        // $result = json_decode($client->post('/', [
        //     'multipart' => [
        //         [
        //             'name'     => 'file',
        //             'contents' => $contents,
	    //             'pinataMetadata' => $metadata,
        //         ],
        //     ]
        // ])->getBody()->getContents(), true);

		// var_dump( $result ); die();

	}
}
