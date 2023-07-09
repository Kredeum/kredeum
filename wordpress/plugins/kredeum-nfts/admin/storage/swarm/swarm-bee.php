<?php
/**
 * SWARM BEE NFT Storage
 *
 * @package swarmpress
 */

namespace KredeumNFTs\Storage;

/**
 * SWARM add and pin file with Swarm Gateway
 *
 * @param string $file File to upload.
 * @param string $content_type .
 *
 * @return string URI hash
 */
function swarm_add_and_pin( $file, $content_type ) {
	if ( defined( 'SWARM_ENDPOINT' ) && defined( 'SWARM_BATCH_ID' ) ) {
		$swarm_pin = false;

		if ( SWARM_BATCH_ID !== '0000000000000000000000000000000000000000000000000000000000000000' ) {
			$swarm_pin = true;
		}

		// $swarm_api = new \RestClient( array( 'base_url' => SWARM_ENDPOINT ) );

		// $headers = array(
		// 	'Swarm-Postage-Batch-Id' => SWARM_BATCH_ID,
		// 	'Swarm-Pin'              => $swarm_pin,
		// 	'Content-Type'           => $content_type,
		// );
		
		// $pinningParams = array(
		// 	'pin' => $swarm_pin
		// );
		
		
		
		// $result = $swarm_api->post( '/bzz', $file, $headers, $pinningParams );
		// var_dump($result->decode_response()->reference); die();
		
		$url = SWARM_ENDPOINT . '/bzz';
		$headers = array(
			'Swarm-Postage-Batch-Id: ' . SWARM_BATCH_ID,
			'Content-Type: ' . $content_type,
			'Swarm-Pin: ' . ($swarm_pin ? 'true' : 'false')
		);

		$curl = curl_init();
		curl_setopt($curl, CURLOPT_URL, $url);
		curl_setopt($curl, CURLOPT_POST, true);
		curl_setopt($curl, CURLOPT_POSTFIELDS, $file);
		curl_setopt($curl, CURLOPT_HTTPHEADER, $headers);
		curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);

		$response = curl_exec($curl);
		$httpCode = curl_getinfo($curl, CURLINFO_HTTP_CODE);

		curl_close($curl);

		if ($httpCode === 201) {
			$responseObj = json_decode($response);
			return $responseObj->reference;
		} else {
			return $response;
		}

		// return ( 201 === $result->info->http_code ) ? $result->decode_response()->reference : $result->error;
	}
}
