<?php
/**
 * Public IPFS LINKS function
 *
 * @package kredeum/nfts
 */

namespace KredeumNFTs\Ipfs;

/**
 * List IPFS links
 * caution : all medias included in the post are not attached :-(
 *
 * @return string links
 */
function links() {
	$ret         = '';
	$n           = 0;
	$attachments = get_attached_media( '' );
	foreach ( $attachments as $attachment ) {
		$file = get_attached_file_meta( $attachment->ID );
		if ( $file->cid ) {
			$ret .= '<li>' . link( $file->cid, $file->filename ) . '</li>';
			$n++;
		}
	}
	if ( $n > 0 ) {
		$s   = ( $n > 1 ) ? 's' : '';
		$ret = __( 'Archive', 'kredeum-nfts' ) . "$s<ul>" . $ret . '</ul>';
	}
	return $ret;
}
