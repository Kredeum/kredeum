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
 * @param string $attachment_id Id attachment file.
 *
 * @return string URI hash
 */
function swarm_add_and_pin( $file, $content_type ) {
	if ( defined( 'SWARM_ENDPOINT' ) && defined( 'SWARM_BATCH_ID' ) ) {
		$swarm_pin = false;

		if ( SWARM_BATCH_ID !== '0000000000000000000000000000000000000000000000000000000000000000' ) {
			$swarm_pin = true;
		}

		$swarm_api = new \RestClient( array( 'base_url' => SWARM_ENDPOINT ) );

		$headers = array(
			'swarm-postage-batch-id' => SWARM_BATCH_ID,
			'swarm-pin'              => $swarm_pin,
			'Content-Type'           => $content_type,
		);

		$result = $swarm_api->post( '/bzz', $file, $headers );

    return ( 201 === $result->info->http_code ) ? $result->decode_response()->reference : $result->error;
	}
}
