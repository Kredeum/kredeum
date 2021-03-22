import fetch from 'node-fetch';
import multipart from './multipart.mjs';


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

pinata.pinFile = async function (buffer, name, pinataMetadata, pinataOptions) {

  const boundary = (Math.random() * 100000000).toString();

  const parts = [
    { "type": "file", "name": name, "content": buffer },
    { "type": "json", "name": "pinataMetadata", "content": JSON.stringify(pinataMetadata) },
    { "type": "json", "name": "pinataOptions", "content": JSON.stringify(pinataOptions) }
  ];

  const method = 'POST';
  const body = multipart(parts, boundary);
  const headers = {
    'Content-Type': 'multipart/form-data; boundary=' + boundary,
    'Content-Length': body.length
  };
  console.log(body);

  const pinJson = await (await pinata.call('/pinning/pinFileToIPFS', { method, body, headers })).json();

  console.log('pinata.pinFile', pinJson);
  return pinJson;
}

pinata.pinJson = async function (pin, asFile = true) {
  const { cid, name, owner } = pin;
  const description = 'Kredeum NFT ' + name + '.json';
  const image = ipfsGateway + '/' + cid;
  const strength = 20;
  const type = 'json';
  const cidVersion = 1;

  let pinJson;
  const json = JSON.stringify({ name, description, image, strength }, null, '  ');
  const pinataMetadata = { name: description, keyvalues: { cid, image, owner, type } };
  const pinataOptions = { cidVersion };

  if (asFile) {

    pinJson = await pinata.pinFile(json, name, pinataMetadata, pinataOptions);

  } else {
    console.log('pinata.pinJson asJson');
    const method = 'POST';
    const body = JSON.stringify({ pinataContent: json, pinataMetadata, pinataOptions });
    const headers = { "Content-Type": "application/json" };

    pinJson = await (await pinata.call('/pinning/pinJSONToIPFS', { method, body, headers })).json();

  }

  console.log('pinata.pinJson', pinJson, pin);
  return pinJson;
}

export default pinata;