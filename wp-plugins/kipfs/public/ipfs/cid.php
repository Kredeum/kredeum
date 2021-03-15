<?php
function ipfs_get_attached_file_meta($postId)
{
  $ret = new stdClass;

  $ret->cid  = get_post_meta($postId, 'CID', true);
  $ret->filename = basename(get_post_meta($postId, '_wp_attached_file', true));

  return $ret;
}
