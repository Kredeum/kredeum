<div class="wrap">

  <?php wp_nonce_field('nonce_action', 'nonce_field'); ?>

  <kredeum-metamask autoconnect="on"></kredeum-metamask>

  <p><a btn-ajax-test href="javascript:;" class="button button-primary">AJAX</a></p>
  <p><input type="text" name="result" size="48" value="<?= get_user_meta(get_current_user_id(), 'ADDR')[0] ?>" readonly></p>

</div>