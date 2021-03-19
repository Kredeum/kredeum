
// comment to use browser fetch
import fetch from 'node-fetch';

const pinata = {};
const ipfsGateway = 'https://gateway.pinata.cloud/ipfs';


pinata.call = async function (path = '/', method = 'GET', body) {
  let resp;

  try {
    const url = 'https://api.pinata.cloud' + path;

    const headers = {
      "Content-Type": "application/json",
      pinata_api_key: "b253abf46663a21f0e40",
      pinata_secret_api_key: "34b0951ff74f6bd1bd30463d50c4de61b8cb4183503fb26fd59595d5c78fced2"
    };
    let options = { method, headers };
    if (body) options.body = JSON.stringify(body, null, '  ');

    console.log('pinata.call fetch', url, options);
    resp = await fetch(url, options);
  }
  catch (e) {
    console.error('pinata.call ERROR', e);
  }
  return resp;
}

pinata.list = async function () {
  const pinataMap = new Map();

  const pinataPins = (await (await pinata.call('/psa/pins?limit=99')).json()).results;

  pinataPins.forEach(pinata => {
    pinataMap.set(pinata.pin.cid, pinata);
  })

  return pinataMap;
}

pinata.pinJson = async function (pin) {
  const cid = pin.cid;
  const address = pin.meta.address;
  const name = pin.name;
  const description = 'Kredeum NFT ' + name + '.json';
  const image = ipfsGateway + '/' + cid;
  const strength = 20;
  const type = 'json';

  const body = {
    pinataContent: { name, description, image, strength },
    pinataMetadata: { name: description, keyvalues: { cid, image, address, type } }
  };
  const pinJson = await (await pinata.call('/pinning/pinJSONToIPFS', 'POST', body)).json();

  console.log('pinata.pinJson', pinJson, body);
  return pinJson;
}

pinata.pinFile = async function () { }

export default pinata;