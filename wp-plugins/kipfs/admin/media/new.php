<?php

// archive IPFS on media upload
if (IPFS_AUTO){
  add_action('add_attachment', function ($postId) {
    return ipfs_upsert($postId);
  });  
}
