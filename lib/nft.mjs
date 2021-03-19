import { ethers } from 'ethers';
import KRU from '../lib/kru.mjs';
import endpoint from '../lib/endpoint.mjs';
import fetch from 'node-fetch';

const nft = {};
let kruContract;

nft.get = async function (index) {
  const nft = {};
  try {
    nft.tockenId = (await kruContract.tokenByIndex(index)).toString();
    nft.ownerOf = await kruContract.ownerOf(nft.tockenId);
    nft.tokenURI = await kruContract.tokenURI(nft.tockenId);
    nft.tokenJson = await (await fetch(nft.tokenURI)).json();
  }
  catch (e) {
    console.error('nft.get ERROR', e, nft);
  }
  // console.log('nft.get #' + nft?.tockenId, nft);
  return nft;
}

nft.list = async function (chainId) {
  const nftList = new Map();

  const { network, url } = endpoint(chainId);
  const provider = new ethers.providers.JsonRpcProvider(url);

  console.log(KRU.ADDRESS[network]);

  kruContract = new ethers.Contract(KRU.ADDRESS[network], KRU.ABI, provider);
  const totalSupply = (await kruContract.totalSupply()).toNumber();
  console.log('totalSupply', totalSupply);

  const nftPromises = [];
  for (let index = 0; index < totalSupply; index++) {
    nftPromises[index] = nft.get(index);
  }
  const nfts = await Promise.all(nftPromises);

  nfts.forEach(nfti => {
    // console.log("nfti", nfti);
    const img = nfti.tokenJson?.image;
    if (img) {
      const cid1 = img.match(/^ipfs:\/\/(.*)$/i);
      const cid2 = img.match(/^.*\/ipfs\/([^\/]*)(.*)$/i);
      const cid = (cid1 && cid1[1]) || (cid2 && cid2[1]);
      console.log('cid nft#' + nfti.tockenId, cid, '<=', img);
      if (cid) nftList.set(cid, nfti);
    }
  });
  return nftList;
}

nft.Mint = async function (signer, json) {
  const urlJson = 'ipfs://' + json.IpfsHash;

  const address = await signer.getAddress();
  console.log('nft.Mint', address, urlJson)

  const tx1 = await kruContract.connect(signer).addUser(address, urlJson);
  console.log('https://explorer-mainnet.maticvigil.com/tx/' + tx1.hash);

  const res = await tx1.wait();
  console.log(res);
  console.log(res.events);
  return res;
}

export default nft;
