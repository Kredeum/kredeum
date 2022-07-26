<?php
/**
 * Storages helpers
 *
 * @package kredeum/nfts
 */

namespace KredeumNFTs\Storage;

function getStorageRef() {
	return STORAGE === 'ipfs' ? '_kre_cid' : '_kre_swarmref';
}

function uploadOnStorage($post_id) {
    return STORAGE === 'ipfs' ? Ipfs\insert($post_id) : \Swarm\insert($post_id);
}