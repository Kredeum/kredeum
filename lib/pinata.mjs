const pinata = {};


pinata.call = async function (path = '/', method = 'GET', body) {
  let json = {};

  try {
    const url = 'https://api.pinata.cloud' + path;

    const headers = {
      "Content-Type": "application/json",
      pinata_api_key: "a09dea243351f6f1ac7c",
      pinata_secret_api_key: "8a60480f3a07cf1ef26fad18272908e5537de33bc164cb431d00e3764150d716"
    };
    let options = { method, headers };
    if (body) options.body = JSON.stringify(body);

    console.log('pinata.call fetch', url, options);

    const response = await fetch(url, options);

    json = await response.json();
    console.log('pinata.call', url, options, '=>', json);
  }
  catch (e) {
    console.error('pinata.call', e);
  }

  return json;
}

pinata.list = async function () {
  const pinataPins = (await pinata.call('/psa/pins?limit=99')).results;

  // pinataPins = pinataPins.filter(function (item) {
  //   return item.pin.meta.address.toLowerCase() === signer.toLowerCase();
  // });
  // console.log(JSON.stringify(pinataPins, null, '  '));

  return pinataPins;
}

pinata.pinJson = async function (pin) {
  const cid = pin.cid;
  const address = pin.meta.address;
  const name = pin.name;
  const description = 'Kredeum NFT ' + name + '.json';
  const image = 'https://gateway.pinata.cloud/ipfs/' + cid;
  const strength = 20;

  const pinJson = await pinata.call('/pinning/pinJSONToIPFS', 'POST', {
    pinataContent: { name, description, image, strength },
    pinataMetadata: { name: description, keyvalues: { cid, image, address } }
  });

  return pinJson;
}

pinata.pinFile = async function () { }

export default pinata;