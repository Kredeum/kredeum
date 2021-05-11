<?php
/**
 * IPFS pin
 *
 * @package kredeum/nfts
 */

/**
 * IPFS pin CID proxy
 *
 * @param string $cid CID.
 *
 * @return string pin result
 */
function ipfs_pin( $cid ) {

	// if (IPFS_PINNING_API) $ret = _ipfs_pinnning($cid);
	// else if (IPFS_CLUSTER_API) $ret = _ipfs_cluster_pin($cid);
	// else $ret = _ipfs_pin($cid);
	// return $ret;
	// .

	return _ipfs_pin( $cid );
}

/**
 * IPFS pin via IPFS API
 *
 * @param string $cid CID.
 *
 * @return string pin result
 */
function _ipfs_pin( $cid ) {
	$ch = curl_init();

	curl_setopt( $ch, CURLOPT_URL, IPFS_API . '/pin/add?arg=' . $cid );
	curl_setopt( $ch, CURLOPT_RETURNTRANSFER, 1 );
	curl_setopt( $ch, CURLOPT_POST, 1 );

	$exec = curl_exec( $ch );
	$ret  = ( false === $exec ) ? curl_error( $ch ) : json_decode( $exec )->Pins[0];
	curl_close( $ch );

	return $ret;
}

/**
 * IPFS pin via IPFS CLUSTER API
 *
 * @param string $cid CID.
 *
 * @return string pin result
 */
function _ipfs_cluster_pin( $cid ) {
	$ch = curl_init();

	curl_setopt( $ch, CURLOPT_URL, IPFS_CLUSTER_API . '/pins/' . $cid );
	curl_setopt( $ch, CURLOPT_RETURNTRANSFER, 1 );
	curl_setopt( $ch, CURLOPT_POST, 1 );

	$exec = curl_exec( $ch );

	$ret = ( false === $exec ) ? curl_error( $ch ) : json_decode( $exec );
	curl_close( $ch );

	return $ret;
}

/**
 * IPFS pin via PINNING API
 *
 * @param string $cid CID.
 *
 * @return string pin result
 */
function _ipfs_pinnning( $cid ) {
	$postfields = json_encode(
		array(
			'cid'  => $cid,
			'name' => 'kredeum-nfts ' . $cid,
		)
	);
	$ch         = curl_init();

	curl_setopt( $ch, CURLOPT_URL, IPFS_PINNING_API . '/pins' );
	curl_setopt( $ch, CURLOPT_RETURNTRANSFER, 1 );
	curl_setopt( $ch, CURLOPT_POST, 1 );
	curl_setopt( $ch, CURLOPT_POSTFIELDS, $postfields );
	// curl_setopt($ch, CURLOPT_HEADER, true); .
	curl_setopt(
		$ch,
		CURLOPT_HTTPHEADER,
		array(
			'Content-Type: application/json',
			'Content-Length: ' . strlen( $postfields ),
		)
	);

	$exec = curl_exec( $ch );
	$ret  = ( false === $exec ) ? curl_error( $ch ) : json_decode( $exec )->Hash;
	curl_close( $ch );

	return $ret;
}
