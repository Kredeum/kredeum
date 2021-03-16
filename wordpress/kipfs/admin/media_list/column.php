<?php

// add one IPFS column
add_filter('manage_media_columns', function ($columns) {
  $columns['cid'] = __('IPFS archive link', 'kipfs');
  return $columns;
});

// manage IPFS column content
add_action('manage_media_custom_column',  function ($name) {
  global $post;
  if ($name === 'cid') echo ipfs_link($post->CID, substr($post->CID, 0, 12) . "...");
});
