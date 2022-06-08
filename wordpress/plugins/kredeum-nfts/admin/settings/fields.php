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
			'uid'     => 'auto_archive',
			'label'   => 'AUTO_ARCHIVE',
			'default' => '1',
			'section' => 'first_section',
			'type'    => 'select',
			'options' => array( __( 'No', 'kredeum-nfts' ), __( 'Yes', 'kredeum-nfts' ) ),
			'helper'  => __( 'Choose "yes" to automaticaly push your new medias to Decentralized storage on upload (default IPFS)', 'kredeum-nfts' ),
		),
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
			'uid'     => 'select_collection',
			'label'   => 'Connect Metamask and select Network and Collection to Mint',
			'section' => 'first_section',
			'type'    => 'kcollections',
			'default' => '',
		),
		array(
			'uid'         => 'nft_storage_key',
			'label'       => 'NFT_STORAGE_KEY',
			'section'     => 'first_section',
			'type'        => 'textarea',
			'placeholder' => 'NFT Storage key',
			'default'     => '',
			'helper'      => __( 'Enter your own NFT Storage Key, or leave blank to use common key', 'kredeum-nfts' ),
		),
		array(
			'uid'     => 'swarm_archive',
			'label'   => 'SWARM_ARCHIVE',
			'default' => '0',
			'section' => 'first_section',
			'type'    => 'select',
			'options' => array( __( 'No', 'kredeum-nfts' ), __( 'Yes', 'kredeum-nfts' ) ),
			'helper'  => __( '"IPFS" is default storage. If you want to archive files on "Swarm bee" instead of "IPFS" chose "YES"', 'kredeum-nfts' ),
		),
		array(
			'uid'         => 'swarm_node_url',
			'label'       => 'SWARM_NODE_URL',
			'section'     => 'first_section',
			'type'        => 'text',
			'placeholder' => 'Your Swarm Bee node URL',
			'default'     => '',
			'helper'      => __( 'Enter your own Swarm Bee node Url (ex: http://localhost:1633), or leave blank to use Swarm limited(free) Gateway', 'kredeum-nfts' ),
		),
		array(
			'uid'         => 'swarm_batch_id',
			'label'       => 'SWARM_BATCH_ID',
			'section'     => 'first_section',
			'type'        => 'text',
			'placeholder' => 'Your Swarm Bee Batch of stamps ID',
			'default'     => '',
			'helper'      => __( 'Enter your own Swarm Bee Batch of stamps ID, or leave blank to use Swarm limited(free) Gateway', 'kredeum-nfts' ),
		),

	);
}
