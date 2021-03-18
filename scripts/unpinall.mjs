import pinata from '../lib/pinata.mjs';

let resp = await (await pinata.call('/psa/pins')).json();
console.log(resp);

resp.results.forEach(async result => {
  console.log(result.pin.cid);
  const resp = await (await pinata.call('/pinning/unpin/' + result.pin.cid, 'DELETE')).text();
  console.log(resp);
});
resp = await pinata.call('/pinning/unpin/Qme1cYyn9yCFXbBjwuK51uSciQAKzmMgiSbdS5GdKQWLu2', 'DELETE');
console.log(await resp.text());