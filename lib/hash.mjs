import axios from 'axios';
import CID from 'cids';
import multihashing from 'multihashing-async';

const hash = async function (url) {

  const input = (await axios(url, { responseType: 'arraybuffer' })).data;
  const multihash = await multihashing(input, 'sha2-256');
  const cid = (new CID(1, 'raw', multihash)).toString();

  console.log("hash", url, "=>", cid);
  return cid;
}

export default hash;
