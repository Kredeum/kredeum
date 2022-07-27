<?php
/**
 * Storages helpers
 *
 * @package kredeum/nfts
 */

namespace KredeumNFTs\Storage;

/**
 * Get storage ref
 */
function get_storage_ref() {
	return STORAGE === 'ipfs' ? '_kre_cid' : '_kre_swarmref';
}

/**
 * Get Swarm custom node url & batchId
 */
function get_optional_storage_attrs() {
	return ( ( STORAGE === 'swarm' ) ? ( defined( 'SWARM_NODE_URL' ) && defined( 'SWARM_BATCH_ID' ) && defined( 'SWARM_SERVER' ) ) ? ( SWARM_NODE_URL !== SWARM_SERVER ) ? ' swarmnode=' . esc_attr( SWARM_NODE_URL ) . ' batchid=' . esc_attr( SWARM_BATCH_ID ) : '' : '' : '' );
}

/**
 * Upload file on Ipfs or Swarm storage
 *
 * @param string $post_id ID of the post uploaded.
 *
 * @return string $post_id
 */
function upload_on_storage( $post_id ) {
	return STORAGE === 'ipfs' ? Ipfs\insert( $post_id ) : Swarm\insert( $post_id );
}

/**
 * Get options regarding to the storage
 */
function get_storage_special_fields() {
	return (
		STORAGE === 'ipfs' ?
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
			:
			array(
				array(
					'uid'         => 'swarm_node_url',
					'label'       => 'SWARM_NODE_URL',
					'section'     => 'first_section',
					'type'        => 'text',
					'placeholder' => 'Your Swarm Bee node URL',
					'default'     => '',
					'helper'      => __( 'Enter your own Swarm Bee node Url (ex: http://localhost:1633), or leave blank to use Swarm free(limited) Gateway', 'kredeum-nfts' ),
				),
				array(
					'uid'         => 'swarm_batch_id',
					'label'       => 'SWARM_BATCH_ID',
					'section'     => 'first_section',
					'type'        => 'text',
					'placeholder' => 'Your Swarm Bee Batch of stamps ID',
					'default'     => '',
					'helper'      => __( 'Enter your own Swarm Bee Batch of stamps ID, or leave blank to use Swarm free(limited) Gateway', 'kredeum-nfts' ),
				),
			)

			);
}

/**
 * Get Settings page intro text
 */
function get_settings_info() {
	return STORAGE === 'ipfs' ?
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
		:
		'<p>' .
		__( 'Setup here your decentralized storage options and connect your Metamask account with WordPress', 'kredeum-nfts' ) .
		'</p><p>' .
		__( 'For any help read the', 'kredeum-nfts' ) .
		' <a href="https://docs.ethswarm.org/docs/" target="_blank">' .
		__( 'User Guide', 'kredeum-nfts' ) .
		'</a> ' .
		__( 'or join us on', 'kredeum-nfts' ) .
		' <a href="https://discord.gg/wdghaQsGq5" target="_blank">' .
		__( 'Discord', 'kredeum-nfts' ) .
		'</a></p>';
}
