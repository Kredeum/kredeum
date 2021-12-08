<?php
/**
 * Fields
 *
 * @package kredeum/nfts
 */

namespace KredeumNFTs\Settings;

/**
 * Kredeum NFTs fields definition
 */
function fields() {
	return array(
		array(
			'uid'     => 'kredeum_ntfs_ipfs_auto',
			'label'   => 'KREDEUM_NFTS_IPFS_AUTO',
			'default' => '1',
			'section' => 'first_section',
			'type'    => 'select',
			'options' => array( __( 'No', 'kredeum-nfts' ), __( 'Yes', 'kredeum-nfts' ) ),
			'helper'  => __( 'Choose "yes" to automaticaly push your new medias to IPFS on upload', 'kredeum-nfts' ),
		),
		// array(
		// 'uid'     => 'kredeum_ntfs_ipfs_cid_version',
		// 'label'   => 'KREDEUM_NFTS_IPFS_CID_VERSION',
		// 'default' => '1',
		// 'section' => 'first_section',
		// 'type'    => 'select',
	  // 'options' => array(0, 1),
	  // 'helper' => __('Choose IPFS CID version', 'kredeum-nfts'),
		// ),
		// array(
		// 'uid'     => 'kredeum_ntfs_ipfs_gateway',
		// 'label'   => 'KREDEUM_NFTS_IPFS_GATEWAY',
		// 'default' => 'https://ipfs.io/ipfs/',
		// 'section' => 'first_section',
		// 'type'    => 'select',
		// 'options' => array(
		// 'https://dweb.link' => 'https://dweb.link',
		// 'https://ipfs.io' => 'https://ipfs.io/ipfs/',
		// 'https://ipfs.infura.io' => 'https://ipfs.infura.io',
		// 'http://ipfs.kredeum.tech:8080' => 'http://ipfs.kredeum.tech:8080',
		// 'http://ipfs.lan' => 'http://ipfs.lan',
		// 'http://127.0.0.1:8080' => 'http://127.0.0.1:8080',
		// ),
		// 'helper' => __('Choose your prefered IPFS gateway', 'kredeum-nfts'),
		// ), .
	array(
		'uid'     => 'kredeum_ntfs_beta',
		'label'   => 'KREDEUM_NFTS_BETA',
		'default' => '0',
		'section' => 'first_section',
		'type'    => 'select',
		'options' => array( __( 'No', 'kredeum-nfts' ), __( 'Yes', 'kredeum-nfts' ) ),
		'helper'  => __( 'For degens ! Choose "yes" to use beta features...', 'kredeum-nfts' ),
	),
		array(
			'uid'         => 'kredeum_ntfs_ipfs_nft_storage_key',
			'label'       => 'KREDEUM_NFTS_IPFS_NFT_STORAGE_KEY',
			'section'     => 'first_section',
			'type'        => 'textarea',
			'placeholder' => 'NFT Storage key',
			'default'     => '',
			'helper'      => __( 'Enter your own NFT Storage Key', 'kredeum-nfts' ),
		),
		array(
			'uid'         => 'kredeum_ntfs_default_collection',
			'label'       => 'KREDEUM_NFTS_DEFAULT_COLLECTION',
			'section'     => 'first_section',
			'type'        => 'kredeum_ntfs_collection',
			'default'     => '',
			'placeholder' => __( 'Default Collection Address', 'kredeum-nfts' ),
		),
		array(
			'uid'         => 'kredeum_ntfs_metamask_address',
			'label'       => 'KREDEUM_NFTS_METAMASK_ADDRESS',
			'section'     => 'first_section',
			'type'        => 'kredeum_ntfs_metamask',
			'default'     => '',
			'placeholder' => __( 'Connect to Metamask', 'kredeum-nfts' ),
		),

	// array(
	// 'uid' => 'kredeum_ntfs_ipfs_api',
	// 'label' => 'KREDEUM_NFTS_IPFS_API',
	// 'section' => 'first_section',
	// 'type' => 'select',
	// 'options' => array(
	// 'http://192.168.1.43:5001/api/v0' => 'http://192.168.1.43:5001/api/v0',
	// 'http://ipfs.kredeum.tech:5001/api/v0' => 'http://ipfs.kredeum.tech:5001/api/v0',
	// 'https://ipfs.infura.io:5001/api/v0' => 'https://ipfs.infura.io:5001/api/v0',
	// 'http://localhost:5001/api/v0' => 'http://localhost:5001/api/v0',
	// ),
	// 'default' => 'https://ipfs.infura.io:5001/api/v0',
	// 'helper' => __('Choose your prefered IPFS API', 'kredeum-nfts'),
	// ),
	// array(
	// 'uid' => 'kredeum_ntfs_ipfs_cluster_api',
	// 'label' => 'KREDEUM_NFTS_IPFS_CLUSTER_API',
	// 'section' => 'first_section',
	// 'type' => 'select',
	// 'options' => array('http://192.168.1.43:9094' => 'http://192.168.1.43:9094'),
	// 'default' => 'http://192.168.1.43:9094',
	// 'helper' => __('Choose your prefered IPFS Cluster API', 'kredeum-nfts'),
	// ),
	// array(
	// 'uid' => 'kredeum_ntfs_ipfs_pinning_api',
	// 'label' => 'KREDEUM_NFTS_IPFS_PINNING_API',
	// 'section' => 'first_section',
	// 'type' => 'select',
	// 'options' => array(false),
	// 'default' => false,
	// 'helper' => __('Choose your prefered IPFS Pinning API', 'kredeum-nfts'),
	// ),
	// .
	);
}
