import { ethers } from 'ethers';
import KRU from '../lib/kru.mjs';
import endpoint from '../lib/endpoint.mjs';
import fetch from 'node-fetch';

const nft = {};
let kruContract;

nft.list = async function (chainId) {
  const nftMap = new Map();

  const { network, url } = endpoint(chainId);
  const provider = new ethers.providers.JsonRpcProvider(url);

  console.log(KRU.ADDRESS[network]);

  kruContract = new ethers.Contract(KRU.ADDRESS[network], KRU.ABI, provider);
  const totalSupply = (await kruContract.totalSupply()).toNumber();
  console.log('totalSupply', totalSupply);

  for (let index = totalSupply - 1; index > totalSupply - 5; index--) {
    const tockenId = (await kruContract.tokenByIndex(index)).toString();
    const ownerOf = await kruContract.ownerOf(tockenId);
    const tokenURI = await kruContract.tokenURI(tockenId);

    let tokenJson;
    try {
      tokenJson = (await (await fetch(tokenURI)).json());
      const nft = { ownerOf, tockenId, tokenURI, tokenJson }
      console.log('nft.List #' + tockenId, nft);

      const hash = nft.tokenJson.image.replace(/^.*\/ipfs\//, '')
      if (hash) nftMap.set(hash, nft);
    }
    catch (e) {
      console.error('nft.list ERROR', e);
    }
  }
  return nftMap;
}

nft.Mint = async function (signer, json) {
  const urlJson = 'https://gateway.pinata.cloud/ipfs/' + json.IpfsHash;

  const address = await signer.getAddress();
  console.log('nft.Mint', address, urlJson)

  const tx1 = await kruContract.connect(signer).addUser(address, urlJson);
  console.log('https://explorer-mainnet.maticvigil.com/tx/' + tx1.hash);

  const res = await tx1.wait();
  console.log(res);
  return res;
}

export default nft;
