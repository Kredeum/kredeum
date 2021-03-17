jQuery(document).ready(function () {
  document.querySelector('kredeum-metamask').$on('address', ajaxTestCall);
});

function ajaxTestCall() {
  var data = {
    action: 'test',
    address: document.querySelector('kredeum-metamask').signer,
    security: document.querySelector('input[name = nonce_field]').getAttribute('value')
  }
  console.log('AJAX CALL', data);

  jQuery.post(ajaxurl, data, function (response) {
    console.log('AJAX RESPONSE', response);
    jQuery('input[name = result]').val(response);
  })
}
