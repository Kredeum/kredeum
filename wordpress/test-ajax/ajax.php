<?php
add_action('wp_ajax_sample_test', 'ajax_sample_test_callback'); /* for logged in user */

function ajax_sample_test_callback()
{
  check_ajax_referer('nonce_action', 'security');

  global $wpdb;
  $result = intval($_POST['num'] * 2);
  echo $result;

  wp_die();
}
