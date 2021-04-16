<?php

// add one IPFS column
add_filter('manage_media_columns', function ($columns) {
  $columns['mint'] = __('MINT', 'kipfs');
  $columns['cid'] = __('IPFS Archive', 'kipfs');
  return $columns;
});

// manage IPFS column content
add_action('manage_media_custom_column',  function ($name) {
  global $post;
  if ($post->CID) {
    if ($name === 'cid') {
      echo ipfs_link($post->CID, substr($post->CID, 0, 12) . "...");
    } else if ($name === 'mint') {
      printf('<kredeum-nft-mint src="' . ipfs_url($post->CID) . '" alt="' . $post->post_title . '"/>');
    }
  }
});
