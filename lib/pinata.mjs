import axios from 'axios';

const pinata = {};
const ipfsGateway = 'https://gateway.pinata.cloud/ipfs';

pinata.call = async function (config = {}) {
  let resp;
  try {
    config.url = 'https://api.pinata.cloud' + config.path;
    config.headers = config.headers || {};
    config.headers.pinata_api_key = "b253abf46663a21f0e40";
    config.headers.pinata_secret_api_key = "34b0951ff74f6bd1bd30463d50c4de61b8cb4183503fb26fd59595d5c78fced2";

    console.log('pinata.call axios', config);

    resp = await axios(config);
  }
  catch (e) {
    console.error('pinata.call ERROR', e);
  }
  return resp;
}

pinata.list = async function () {
  const pinataList = new Map();

  const pinataPins = ((await pinata.call({ path: '/psa/pins?limit=99' })).data).results;
  pinataPins.forEach(pinata => {
    pinataList.set(pinata.pin.cid, pinata);
  })

  // console.log('pinata.list', pinataList);
  return pinataList;
}

pinata.pinFileToIPFS = async function (buffer, pinataMetadata) {

  const path = '/pinning/pinFileToIPFS';
  const method = 'POST';
  const pinataOptions = { cidVersion: 1 };

  const data = new FormData();
  data.append('file', buffer);
  data.append('pinataMetadata', JSON.stringify(pinataMetadata));
  data.append('pinataOptions', JSON.stringify(pinataOptions));

  const maxBodyLength = 'Infinity';
  const config = { path, method, data, maxBodyLength };
  console.log('pinata.pinFileToIPFS', config);

  const pinFileJson = (await pinata.call(config)).data;

  console.log('pinata.pinFileToIPFS', pinFileJson);
  return pinFileJson;
}

pinata.pinImage = async function (image) {
  console.log('pinata.pinImage', image);

  const { url, name, owner } = image;
  const description = 'Kredeum NFT image ' + name;
  const type = 'image';
  const pinataMetadata = { name: description, keyvalues: { owner, type } };

  const blob = (await axios({ url, responseType: 'blob' })).data;

  const pinImage = await pinata.pinFileToIPFS(blob, pinataMetadata);
  return { cid: pinImage.IpfsHash, imageIpfs: ipfsGateway + '/' + pinImage.IpfsHash }
}

pinata.pinJSONToIPFS = async function (json, pinataMetadata) {
  const path = '/pinning/pinJSONToIPFS';
  const method = 'POST';
  const pinataOptions = { cidVersion: 1 };
  const pinataContent = json;

  const data = { pinataContent, pinataMetadata, pinataOptions };
  const config = { path, method, data };
  console.log('pinata.pinJSONToIPFS', config);

  const pinFileJson = (await pinata.call(config)).data;

  console.log('pinata.pinJSONToIPFS', pinFileJson);
  return pinFileJson;
}

pinata.pinJson = async function (image) {
  console.log('pinata.pinJson', image);

  const { url, cid, name, owner } = image;
  const description = 'Kredeum NFT json ' + name;
  const imageIpfs = ipfsGateway + '/' + cid;
  const strength = 20;
  const type = 'json';
  const pinataMetadata = { name: description, keyvalues: { owner, type } };

  const json = { name, description, image: imageIpfs, strength, cid, imageOrigin: url, firstOwner: owner };
  console.log(json);

  const pinJson = await pinata.pinJSONToIPFS(json, pinataMetadata);
  return { cid: pinJson.IpfsHash, jsonIpfs: ipfsGateway + '/' + pinJson.IpfsHash }
}

export default pinata;