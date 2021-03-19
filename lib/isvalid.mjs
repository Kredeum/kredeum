const isValid = {}

isValid.ethAddress = function (_address) {
  if (!/^(0x)?[0-9a-f]{40}$/i.test(_address)) {
    ret = false;
  } else if (/^(0x)?[0-9a-f]{40}$/.test(_address) || /^(0x)?[0-9A-F]{40}$/.test(_address)) {
    ret = true;
  } else {
    ret = isChecksumAddress(_address);
  }

  if (!ret) console.log('isValid.ethAddress NOT VALID FORMAT', _address)
  return ret;
};

var isChecksumAddress = function (_address) {
  _address = _address.replace('0x', '');

  let _addressHash = sha3(_address.toLowerCase());

  for (var i = 0; i < 40; i++) {
    // the nth letter should be uppercase if the nth digit of casemap is 1
    if (
      (parseInt(_addressHash[i], 16) > 7 && _address[i].toUpperCase() !== _address[i])
      ||
      (parseInt(_addressHash[i], 16) <= 7 && _address[i].toLowerCase() !== _address[i])
    ) {
      return false;
    }
  }
  return true;
};


export default isValid;