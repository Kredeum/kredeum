<?php

// add bulk archive IPFS action 
add_filter('bulk_actions-upload', function ($bulk_actions) {
  $bulk_actions['archive'] = __('Archive to IPFS', 'kipfs');
  return $bulk_actions;
});

// handle bulk archive IPFS action 
add_filter('handle_bulk_actions-upload', function ($redirect_url, $action, $post_ids) {
  $na = $nm = $nu = 0;
  if ($action == 'archive') {
    foreach ($post_ids as $post_id) {
      $file = ipfs_get_attached_file_meta($post_id);
      $cid = ipfs_insert($post_id);
      if ($file->cid) {
        if ($file->cid === $cid)  $nu++;
        else $nm++;
      } else $na++;
    }
    $redirect_url = add_query_arg('bulk_archived', $na, $redirect_url);
    $redirect_url = add_query_arg('bulk_modified', $nm, $redirect_url);
    $redirect_url = add_query_arg('bulk_unchanged', $nu, $redirect_url);
  }
  return $redirect_url;
}, 10, 3);

// notice bulk archive IPFS action result
add_action('admin_notices', function () {
  if (!empty($_REQUEST['bulk_archived'])) {
    $archived_count = intval($_REQUEST['bulk_archived']);
    printf('<div id="message" class="notice notice-success is-dismissible"><p>' .
      _n('%s media archived to IPFS', '%s medias archived to IPFS', $archived_count, 'kipfs')
      . '</p></div>', $archived_count);
  }
  if (!empty($_REQUEST['bulk_modified'])) {
    $modified_count = intval($_REQUEST['bulk_modified']);
    printf('<div id="message" class="notice notice-warning is-dismissible"><p>' .
      _n('%s IPFS media link modified', '%s IPFS medias links modified', $modified_count, 'kipfs') . '</p></div>', $modified_count);
  }
  if (!empty($_REQUEST['bulk_unchanged'])) {
    $unchanged_count = intval($_REQUEST['bulk_unchanged']);
    printf('<div id="message" class="notice is-dismissible"><p>' .
      _n('%s IPFS media link unchanged', '%s IPFS medias links unchanged', $unchanged_count, 'kipfs')
      . '</p></div>', $unchanged_count);
  }
});
