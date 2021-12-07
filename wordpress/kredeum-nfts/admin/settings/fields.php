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
			'uid'     => 'ipfs_auto',
			'label'   => 'IPFS_AUTO',
			'default' => '1',
			'section' => 'first_section',
			'type'    => 'select',
			'options' => array( __( 'No', 'kredeum-nfts' ), __( 'Yes', 'kredeum-nfts' ) ),
			'helper'  => __( 'Choose "yes" to automaticaly push your new medias to IPFS on upload', 'kredeum-nfts' ),
		),
		// array(
		// 'uid'     => 'ipfs_cid_version',
		// 'label'   => 'IPFS_CID_VERSION',
		// 'default' => '1',
		// 'section' => 'first_section',
		// 'type'    => 'select',
	  // 'options' => array(0, 1),
	  // 'helper' => __('Choose IPFS CID version', 'kredeum-nfts'),
		// ),
		// array(
		// 'uid'     => 'ipfs_gateway',
		// 'label'   => 'IPFS_GATEWAY',
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
	  // array(
		// 'uid'         => 'ipfs_nft_storage_key',
		// 'label'       => 'IPFS_NFT_STORAGE_KEY',
		// 'section'     => 'first_section',
		// 'type'        => 'textarea',
		// 'placeholder' => 'NFT Storage key',
		// 'default'     => '',
		// 'helper'      => __( 'Enter your own NFT Storage Key (leave blank to use Kredeum generic key)', 'kredeum-nfts' ),
	  // ),.
	array(
		'uid'     => 'kredeum_beta',
		'label'   => 'KREDEUM_BETA',
		'default' => '0',
		'section' => 'first_section',
		'type'    => 'select',
		'options' => array( __( 'No', 'kredeum-nfts' ), __( 'Yes', 'kredeum-nfts' ) ),
		'helper'  => __( 'For degens ! Choose "yes" to use beta features...', 'kredeum-nfts' ),
	),
		array(
			'uid'         => 'default_collection',
			'label'       => 'DEFAULT_COLLECTION',
			'section'     => 'first_section',
			'type'        => 'text',
			'placeholder' => 'Default Collection Address',
			'default'     => '',
			'helper'      => __( 'Default Collection Address to Mint into (may change for each network)', 'kredeum-nfts' ),
		),
		array(
			'uid'         => null,
			'label'       => 'METAMASK_ADDRESS',
			'section'     => 'first_section',
			'type'        => 'metamask',
			'default'     => '',
			'placeholder' => __( 'Connect to Metamask', 'kredeum-nfts' ),
		),

	// array(
	// 'uid' => 'ipfs_api',
	// 'label' => 'IPFS_API',
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
	// 'uid' => 'ipfs_cluster_api',
	// 'label' => 'IPFS_CLUSTER_API',
	// 'section' => 'first_section',
	// 'type' => 'select',
	// 'options' => array('http://192.168.1.43:9094' => 'http://192.168.1.43:9094'),
	// 'default' => 'http://192.168.1.43:9094',
	// 'helper' => __('Choose your prefered IPFS Cluster API', 'kredeum-nfts'),
	// ),
	// array(
	// 'uid' => 'ipfs_pinning_api',
	// 'label' => 'IPFS_PINNING_API',
	// 'section' => 'first_section',
	// 'type' => 'select',
	// 'options' => array(false),
	// 'default' => false,
	// 'helper' => __('Choose your prefered IPFS Pinning API', 'kredeum-nfts'),
	// ),
	// .
	);
}
