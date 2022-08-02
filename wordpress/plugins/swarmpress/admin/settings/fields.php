<?php
/**
 * Fields
 *
 * @package swarmpress
 */

namespace SwarmPress\Settings;

use function SwarmPress\Storage\get_storage_special_fields;

/**
 * Kredeum NFTs fields definition
 */
function fields() {
	return array_merge(
		array(

			array(
				'uid'     => 'swarm_auto_archive',
				'label'   => 'SWARM_AUTO_ARCHIVE',
				'default' => '1',
				'section' => 'first_section',
				'type'    => 'select',
				'options' => array( __( 'No', 'swarmpress' ), __( 'Yes', 'swarmpress' ) ),
				'helper'  => __( 'Choose "yes" to automaticaly push your new medias to Swarm decentralized storage on upload', 'swarmpress' ),
			),
			array(
				'uid'     => 'swarm_select_collection',
				'label'   => 'Connect Metamask and select Network and Collection to Mint',
				'section' => 'first_section',
				'type'    => 'kcollections',
				'default' => '',
			),
		),
		get_storage_special_fields()
	);
}
