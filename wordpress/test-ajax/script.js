jQuery(document).ready(function ($) {

  $('[btn-ajax-test]').click(function () {

    var data = {
      action: 'test',
      address: document.querySelector('kredeum-metamask').signer,
      security: document.querySelector('input[name = nonce_field]').getAttribute('value')
    }
    console.log('AJAX CALL', data);

    $.post(ajaxurl, data, function (response) {
      console.log('AJAX RESPONSE', response);
      $('input[name = result]').val(response);
    })
  })
})