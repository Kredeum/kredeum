jQuery(document).ready(function ($) {

  $('[btn-ajax-test]').click(function () {
    var data = {
      action: 'sample_test',
      num: $('input[name = num]').val(),
      security: $('input[name = nonce_field]').val()
    }
    console.log('AJAX CALL', data);

    $.post(ajaxurl, data, function (response) {
      console.log('AJAX RESPONSE', response);
      $('input[name = test_result]').val(response);
    })
  })
})