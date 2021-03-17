<?php
add_action('wp_ajax_test', function () {
  check_ajax_referer('nonce_action', 'security');

  $user_id = get_current_user_id();
  update_user_meta($user_id, 'ADDR', $_POST['address']);

  echo $_POST['address'] . "\n";
  echo get_user_meta($user_id, 'ADDR')[0];
  wp_die();
});
