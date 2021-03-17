import { ethers } from 'ethers';
import KRU from '../lib/kru.mjs';
import endpoint from '../lib/endpoint.mjs';

const nft = {};
let kru;

nft.list = async function (chainId) {
  const nftList = [];

  const { network, url } = endpoint(chainId);
  const provider = new ethers.providers.JsonRpcProvider(url);

  console.log(KRU.ADDRESS[network]);

  kru = new ethers.Contract(KRU.ADDRESS[network], KRU.ABI, provider);
  const totalSupply = (await kru.totalSupply()).toNumber();
  console.log('totalSupply', totalSupply);

  for (let index = 0; index < totalSupply; index++) {
    const tockenId = await kru.tokenByIndex(index);
    const ownerOf = await kru.ownerOf(tockenId);
    const tokenURI = await kru.tokenURI(tockenId);
    // if (ownerOf.toLowerCase() === signer.toLowerCase())
    {
      nftList.push({
        tockenId,
        ownerOf,
        tokenURI
      });
    }
  }
  console.log('nftList', JSON.stringify(nftList, null, '  '));

  return nftList;
}

nft.Mint = async function (signer, json) {
  const urlJson = 'https://gateway.pinata.cloud/ipfs/' + json.IpfsHash;

  console.log('nft.Mint', urlJson)
  const tx1 = await kru.addUser(signer, urlJson);
  console.log(tx1);

  const res = tx1; wait();
  console.log(res);
  return res;
}

export default nft;
