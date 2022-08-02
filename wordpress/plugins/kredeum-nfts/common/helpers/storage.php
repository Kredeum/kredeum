<?php
/**
 * Storages helpers
 *
 * @package kredeum/nfts
 */

namespace KredeumNFTs\Storage;

/**
 * Get storage optional fields.
 */
function get_optional_storage_attrs() {
	return ( ( KRE_STORAGE === 'swarm' ) ? ( defined( 'SWARM_NODE_URL' ) && defined( 'SWARM_BATCH_ID' ) && defined( 'SWARM_SERVER' ) ) ? ( SWARM_NODE_URL !== SWARM_SERVER ) ? ' swarmnode=' . esc_attr( SWARM_NODE_URL ) . ' batchid=' . esc_attr( SWARM_BATCH_ID ) : '' : '' : '' );
}

/**
 * Get optional settings parameters
 */
function get_storage_special_fields() {
	if ( KRE_STORAGE === 'ipfs' ) {
		return (
			array(
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
					'uid'         => 'nft_storage_key',
					'label'       => 'NFT_STORAGE_KEY',
					'section'     => 'first_section',
					'type'        => 'textarea',
					'placeholder' => 'NFT Storage key',
					'default'     => '',
					'helper'      => __( 'Enter your own NFT Storage Key, or leave blank to use common key', 'kredeum-nfts' ),
				),
			)
		);
	} elseif( KRE_STORAGE === 'swarm' ) {
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
}

/**
 * Get Settings page intro text
 */
function get_settings_info() {
	return (
		'<p>' .
		__( 'Setup here your decentralized storage options and connect your Metamask account with WordPress', 'kredeum-nfts' ) .
		'</p><p>' .
		__( 'For any help read the', 'kredeum-nfts' ) .
		' <a href="https://docs.kredeum.tech/user-guide" target="_blank">' .
		__( 'User Guide', 'kredeum-nfts' ) .
		'</a> ' .
		__( 'and related ', 'kredeum-nfts' ) .
		' <a href="https://docs.kredeum.tech/wordpress-setup/settings" target="_blank">' .
		__( 'Settings instructions', 'kredeum-nfts' ) .
		'</a> ' .
		__( 'or join us on', 'kredeum-nfts' ) .
		' <a href="https://discord.gg/Vz5AyU2Nfx" target="_blank">' .
		__( 'Discord', 'kredeum-nfts' ) .
		'</a></p>'
	);
}
