import pinata from '../lib/pinata.mjs';

let resp;
// resp = await pinata.call('/pinning/unpin/QmYjLPodnen9g3fH4FxFW1eSpwL5GvGMi9rrpMJ9dNBRJP', { method: 'DELETE' });
// console.log(await resp.text());

resp = await (await pinata.call('/psa/pins?limit=3')).json();
console.log(resp);

resp.results.forEach(async result => {
  console.log(result.pin.cid);
  const resp = await (await pinata.call('/pinning/unpin/' + result.pin.cid, { method: 'DELETE' })).text();
  console.log(resp);
});
