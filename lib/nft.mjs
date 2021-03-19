import { ethers } from 'ethers';
import KRE from '../lib/kre.mjs';
import endpoint from '../lib/endpoint.mjs';
import fetch from 'node-fetch';

const nft = {};
const maticEthExplorer = 'https://explorer-mainnet.maticvigil.com';
const ipfsGateway = 'https://gateway.pinata.cloud/ipfs';

let kreContract;

nft.get = async function (index) {
  const nft = {};
  try {
    nft.tockenId = (await kreContract.tokenByIndex(index)).toString();
    nft.ownerOf = await kreContract.ownerOf(nft.tockenId);
    nft.tokenURI = await kreContract.tokenURI(nft.tockenId);
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

  console.log(KRE.ADDRESS[network]);

  kreContract = new ethers.Contract(KRE.ADDRESS[network], KRE.ABI, provider);
  const totalSupply = (await kreContract.totalSupply()).toNumber();
  console.log('totalSupply', totalSupply);

  const nftPromises = [];
  for (let index = 0; index < totalSupply; index++) {
    nftPromises[(totalSupply - 1) - index] = nft.get(index);
  }
  const nfts = await Promise.all(nftPromises);

  nfts.forEach(nfti => {
    let cid;
    // console.log("nfti", nfti);
    const img = nfti.tokenJson?.image;
    if (img) {
      const cid1 = img.match(/^ipfs:\/\/(.*)$/i);
      const cid2 = img.match(/^.*\/ipfs\/([^\/]*)(.*)$/i);
      cid = (cid1 && cid1[1]) || (cid2 && cid2[1]);
      console.log('cid nft#' + nfti.tockenId, cid, '<=', img);
      if (cid) {
        nfti.cid = cid;
        nftList.set(`${nfti.tockenId}#${cid}`, nfti);
      }
    }
  });
  return nftList;
}

nft.Mint = async function (signer, json) {
  const urlJson = ipfsGateway + '/' + json.IpfsHash;

  const address = await signer.getAddress();
  console.log('nft.Mint', address, urlJson)

  const tx1 = await kreContract.connect(signer).addUser(address, urlJson);
  console.log(`${maticEthExplorer}/tx/` + tx1.hash);

  const res = await tx1.wait();
  console.log(res);
  console.log(res.events);
  return res;
}

export default nft;
