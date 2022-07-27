<?php
/**
 * Fields
 *
 * @package kredeum/nfts
 */

namespace KredeumNFTs\Settings;

use function KredeumNFTs\Storage\getStorageSpecialFields;

/**
 * Kredeum NFTs fields definition
 */
function fields() {
	return array_merge(
		array(

			array(
				'uid'     => 'auto_archive',
				'label'   => 'AUTO_ARCHIVE',
				'default' => '1',
				'section' => 'first_section',
				'type'    => 'select',
				'options' => array( __( 'No', 'kredeum-nfts' ), __( 'Yes', 'kredeum-nfts' ) ),
				'helper'  => __( 'Choose "yes" to automaticaly push your new medias to IPFS decentralized storage on upload', 'kredeum-nfts' ),
			),
			array(
				'uid'     => 'select_collection',
				'label'   => 'Connect Metamask and select Network and Collection to Mint',
				'section' => 'first_section',
				'type'    => 'kcollections',
				'default' => '',
			),
		),
		getStorageSpecialFields()
	);
}
