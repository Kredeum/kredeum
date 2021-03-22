import CID from 'cids';
import multihashing from 'multihashing-async';

const hash = async function (input) {

  const bytes = new TextEncoder('utf8').encode(input);
  const _hash = await multihashing(bytes, 'sha2-256');

  const cid = (new CID(1, 'raw', _hash)).toString();

  console.log("hash function", input, "=>", cid);
  return cid;
}

export default hash;
