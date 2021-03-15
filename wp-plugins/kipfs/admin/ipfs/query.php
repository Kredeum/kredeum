<?php
function ipfs_upsert($postId)
{
  $file = ipfs_get_attached_file_meta($postId);
  if ($file->cid === "") {
    $cid = ipfs_insert($postId, $file->filename);
  }
  return $cid;
}
function ipfs_insert($postId)
{
  if(defined('IPFS_PINATA_SECRET') ) {
    $cid = ipfs_pinata_insert($postId);
  }
  else{
    $cid = ipfs_add($postId);
    ipfs_pin($cid);
  }
  update_post_meta($postId, 'CID', $cid);
  return $cid;
}
