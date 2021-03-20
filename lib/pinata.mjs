import fetch from 'node-fetch';

const pinata = {};
const ipfsGateway = 'https://gateway.pinata.cloud/ipfs';


pinata.call = async function (path = '/', options = {}) {
  let resp;
  try {
    const url = 'https://api.pinata.cloud' + path;
    options.headers = options.headers || {};
    options.headers.pinata_api_key = "b253abf46663a21f0e40";
    options.headers.pinata_secret_api_key = "34b0951ff74f6bd1bd30463d50c4de61b8cb4183503fb26fd59595d5c78fced2";
    console.log('pinata.call fetch', url, options);

    resp = await fetch(url, options);

  }
  catch (e) {
    console.error('pinata.call ERROR', e);
  }
  return resp;
}

pinata.list = async function () {
  const pinataList = new Map();

  const pinataPins = (await (await pinata.call('/psa/pins?limit=99')).json()).results;
  pinataPins.forEach(pinata => {
    pinataList.set(pinata.pin.cid, pinata);
  })

  // console.log('pinata.list', pinataList);
  return pinataList;
}

pinata.pinFile = async function (file, pinataMetadata, pinataOptions) {
  const method = 'POST';
  const body = new FormData();
  body.append('file', file);
  if (pinataOptions) body.append('pinataOptions');
  if (pinataMetadata) body.append('pinataMetadata');

  const pinJson = await (await pinata.call('/pinning/pinFileToIPFS', { method, body })).json();

  return pinJson;
}

pinata.pinJson = async function (pin, asFile = false) {
  const cid = pin.cid;
  const address = pin.meta.address;
  const name = pin.name;
  const description = 'Kredeum NFT ' + name + '.json';
  const image = ipfsGateway + '/' + cid;
  const strength = 20;
  const type = 'json';

  let pinJson;
  const json = { name, description, image, strength };
  const pinataMetadata = { name: description, keyvalues: { cid, image, address, type } };
  if (asFile) {

    pinJson = await pinata.pinFile(json, pinataMetadata);

  } else {
    const body = { pinataContent: json, pinataMetadata };

    pinJson = await (await pinata.call('/pinning/pinJSONToIPFS', { method: 'POST', body })).json();

  }

  console.log('pinata.pinJson', pinJson, body);
  return pinJson;
}

pinata.pinFile = async function () { }

export default pinata;