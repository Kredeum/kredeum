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
	$fields = array(
		array(
			'uid'     => '_kre_select_collection',
			'label'   => 'Connect Metamask and select Network and Collection to Mint',
			'section' => 'first_section',
			'type'    => 'kcollections',
			'default' => '',
		),

		array(
			'uid'     => '_kre_storage_auto',
			'label'   => 'STORAGE_AUTO',
			'default' => '1',
			'section' => 'first_section',
			'type'    => 'select',
			'options' => array( __( 'No', 'kredeum-nfts' ), __( 'Yes', 'kredeum-nfts' ) ),
			'helper'  => __( 'Choose "yes" to automaticaly push your new medias to decentralized storage on upload', 'kredeum-nfts' ),
		),

		array(
			'uid'     => '_kre_storage_choice',
			'label'   => 'STORAGE_CHOICE',
			'default' => '1',
			'section' => 'first_section',
			'type'    => 'select',
			'options' => array(
				'IPFS'  => __( 'IPFS', 'kredeum-nfts' ),
				'SWARM' => __( 'Swarm', 'kredeum-nfts' ),
			),
			'helper'  => __( 'Choose on witch decentralized storage you want to upload your files', 'kredeum-nfts' ),
		),
	);

	if ( defined( 'STORAGE_CHOICE' ) ) {
		switch ( STORAGE_CHOICE ) {
			case 'IPFS':
				array_push(
					$fields,
					array(
						'uid'         => '_kre_nft_storage_key',
						'label'       => 'NFT_STORAGE_KEY',
						'section'     => 'first_section',
						'type'        => 'textarea',
						'placeholder' => 'NFT Storage key',
						'default'     => '',
						'helper'      => __( 'Enter your own NFT Storage Key, or leave blank to use common key', 'kredeum-nfts' ),
					),
				);
				break;
			case 'SWARM':
				array_push(
					$fields,
					array(
						'uid'         => '_kre_swarm_node_url',
						'label'       => 'SWARM_NODE_URL',
						'section'     => 'first_section',
						'type'        => 'text',
						'placeholder' => 'Your Swarm Bee node URL',
						'default'     => '',
						'helper'      => __( 'Enter your own Swarm Bee node Url (ex: http://localhost:1633), or leave blank to use Swarm free(limited) Gateway', 'kredeum-nfts' ),
					),
					array(
						'uid'         => '_kre_swarm_batch_id',
						'label'       => 'SWARM_BATCH_ID',
						'section'     => 'first_section',
						'type'        => 'text',
						'placeholder' => 'Your Swarm Bee Batch of stamps ID',
						'default'     => '',
						'helper'      => __( 'Enter your own Swarm Bee Batch of stamps ID, or leave blank to use Swarm free(limited) Gateway', 'kredeum-nfts' ),
					),
				);
				break;
		}
	}

	 return $fields;
}
