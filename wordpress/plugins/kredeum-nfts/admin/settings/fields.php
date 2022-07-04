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
			'helper'  => __( 'Choose "yes" to automaticaly push your new medias to IPFS on upload', 'kredeum-nfts' )
		),
		array(
			'uid'     => 'kredeum_beta',
			'label'   => 'KREDEUM_BETA',
			'default' => '0',
			'section' => 'first_section',
			'type'    => 'select',
			'options' => array( __( 'No', 'kredeum-nfts' ), __( 'Yes', 'kredeum-nfts' ) ),
			'helper'  => __( 'For degens ! Choose "yes" to use beta features...', 'kredeum-nfts' )
		),
		array(
			'uid'     => 'select_collection',
			'label'   => 'Connect Metamask and select Network and Collection to Mint',
			'section' => 'first_section',
			'type'    => 'kcollections',
			'default' => ''
		),
		array(
			'uid'         => 'nft_storage_key',
			'label'       => 'NFT_STORAGE_KEY',
			'section'     => 'first_section',
			'type'        => 'textarea',
			'placeholder' => 'NFT Storage key',
			'default'     => '',
			'helper'      => __( 'Enter your own NFT Storage Key, or leave blank to use common key', 'kredeum-nfts' )
		)

	);
}
