<div class="wrap">

  <?php wp_nonce_field('nonce_action', 'nonce_field'); ?>

  <p><input type="text" name="num" size="9"></p>
  <a btn-ajax-test href="javascript:;" class="button button-primary">Test AJAX</a>
  <p><input type="text" name="test_result" size="9" readonly></p>

</div>