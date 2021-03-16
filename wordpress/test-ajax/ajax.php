<?php
add_action('wp_ajax_test', 'ajax_test_callback'); /* for logged in user */

function ajax_test_callback()
{
  check_ajax_referer('nonce_action', 'security');

  echo $_POST['address'] . "\n";

  $user_id = get_current_user_id();
  update_user_meta($user_id, 'ADDR', $_POST['address']);

  // echo get_user_meta($user_id, 'ADDR')[0];
  wp_die();
}
