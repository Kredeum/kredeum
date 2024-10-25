<?php
/**
 * IPFS PINATA STORAGE
 *
 * @package kredeum/nfts
 */

namespace KredeumNFTs\Storage;

/**
 * IPFS add and pin file with Pinata
 * See : // see : https://docs.pinata.cloud/api-reference/endpoint/ipfs/pin-file-to-ipfs
 *
 * @param string $file_id id of file to upload.
 *
 * @return string CID hash
 */
function nft_storage_add_and_pin( $file_id ) {
	if ( defined( 'IPFS_ENDPOINT' ) ) {
		$api = new \RestClient( array( 'base_url' => IPFS_ENDPOINT ) );

		$file_content = file_get_contents( get_attached_file( $file_id ) );
		$filename     = get_attached_file_meta( $file_id )->filename;

		$boundary = md5( rand() );
		$buffer   = "--{$boundary}\r\n";
		$buffer  .= 'Content-Disposition: form-data; name="file"; filename="' . $filename . "\"\r\n";
		$buffer  .= "Content-Type: application/octet-stream\r\n\r\n";
		$buffer  .= $file_content . "\r\n";

		$buffer .= "--{$boundary}\r\n";
		$buffer .= "Content-Disposition: form-data; name=\"pinataOptions\"\r\n\r\n";
		$buffer .= json_encode( array( 'cidVersion' => 1 ) ) . "\r\n";

		$buffer .= "--{$boundary}--\r\n";

		$headers = array(
			'Authorization' => 'Bearer ' . IPFS_STORAGE_KEY,
			'Content-Type'  => 'multipart/form-data; boundary=' . $boundary,
		);

		$result = $api->post( '/pinning/pinFileToIPFS', $buffer, $headers );

		// var_dump( $result->decode_response()->IpfsHash ); die();.

		return ( 200 === $result->info->http_code ) ? $result->decode_response()->IpfsHash : $result->error;
	}
}
