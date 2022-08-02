<?php
/**
 * Storage helpers
 *
 * @package swarmpress
 */

namespace SwarmPress\Storage;

/**
 * Get Swarm custom node url & batchId
 */
function get_optional_storage_attrs() {
	return ( ( SWARM_STORAGE === 'swarm' ) ? ( defined( 'SWARM_NODE_URL' ) && defined( 'SWARM_BATCH_ID' ) && defined( 'SWARM_SERVER' ) ) ? ( SWARM_NODE_URL !== SWARM_SERVER ) ? ' swarmnode=' . esc_attr( SWARM_NODE_URL ) . ' batchid=' . esc_attr( SWARM_BATCH_ID ) : '' : '' : '' );
}

/**
 * Get optional settings
 */
function get_storage_special_fields() {
	return (
		array(
			array(
				'uid'         => 'swarm_node_url',
				'label'       => 'SWARM_NODE_URL',
				'section'     => 'first_section',
				'type'        => 'text',
				'placeholder' => 'Your Swarm Bee node URL',
				'default'     => '',
				'helper'      => __( 'Enter your own Swarm Bee node Url (ex: http://localhost:1633), or leave blank to use Swarm free(limited) Gateway', 'swarmpress' ),
			),
			array(
				'uid'         => 'swarm_batch_id',
				'label'       => 'SWARM_BATCH_ID',
				'section'     => 'first_section',
				'type'        => 'text',
				'placeholder' => 'Your Swarm Bee Batch of stamps ID',
				'default'     => '',
				'helper'      => __( 'Enter your own Swarm Bee Batch of stamps ID, or leave blank to use Swarm free(limited) Gateway', 'swarmpress' ),
			),
		)

	);
}

/**
 * Get Settings page intro text
 */
function get_settings_info() {
	return (
		'<p>' .
		__( 'Setup here your decentralized storage options and connect your Metamask account with WordPress', 'swarmpress' ) .
		'</p><p>' .
		__( 'For any help read the', 'swarmpress' ) .
		' <a href="https://docs.ethswarm.org/docs/" target="_blank">' .
		__( 'User Guide', 'swarmpress' ) .
		'</a> ' .
		__( 'or join us on', 'swarmpress' ) .
		' <a href="https://discord.gg/wdghaQsGq5" target="_blank">' .
		__( 'Discord', 'swarmpress' ) .
		'</a></p>'
	);
}
