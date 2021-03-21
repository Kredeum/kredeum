import { ethers } from 'ethers';
import KRE from '../lib/kre.mjs';
import endpoint from '../lib/endpoint.mjs';
import fetch from 'node-fetch';

const nft = {};
const maticEthExplorer = 'https://explorer-mainnet.maticvigil.com';
const ipfsGateway = 'https://gateway.pinata.cloud/ipfs';
const graphQLendpoint = 'https://api.thegraph.com/subgraphs/name/zapaz/kredeum-nft';

let kreContract;

async function _graphQL(url, query) {
  let response;
  try { response = await (await fetch(url, { method: 'POST', body: JSON.stringify({ query }) })).json(); }
  catch (error) { console.error(error); }
  return response;
}

nft.init = async function (chainId) {
  const { network, url } = endpoint(chainId);
  const provider = new ethers.providers.JsonRpcProvider(url);

  console.log(KRE.ADDRESS[network]);

  kreContract = new ethers.Contract(KRE.ADDRESS[network], KRE.ABI, provider);
}

nft.get = async function (index) {
  const nft = {};
  try {
    nft.tokenId = (await kreContract.tokenByIndex(index)).toString();
    nft.ownerOf = await kreContract.ownerOf(nft.tokenId);
    nft.tokenURI = await kreContract.tokenURI(nft.tokenId);
    nft.tokenJson = await (await fetch(nft.tokenURI)).json();
  }
  catch (e) {
    console.error('nft.get ERROR', e, nft);
  }
  // console.log('nft.get #' + nft?.tokenId, nft);
  return nft;
}


nft.listTheGraph = async function () {
  let nfts = [];

  const query = `{ tokens(first: 99) {id owner {id} uri transfers {id}}}`;
  let answerGQL;

  answerGQL = await _graphQL(graphQLendpoint, query);

  nfts = await Promise.all(answerGQL?.data.tokens.map(async token => {
    const nft = {};
    nft.tokenId = Number(token.id).toString();
    nft.ownerOf = token.owner.id;
    nft.tokenURI = token.uri;

    try { nft.tokenJson = await (await fetch(nft.tokenURI)).json(); }
    catch (e) { console.error('nft.listTheGraph ERROR', e, nft.tokenURI); }

    return nft;
  }));

  // console.log('nft.listTheGraph', nfts);
  return nfts;
}


nft.listContract = async function () {

  const totalSupply = (await kreContract.totalSupply()).toNumber();
  console.log('totalSupply', totalSupply);

  const nftPromises = [];
  for (let index = 0; index < totalSupply; index++) {
    nftPromises[(totalSupply - 1) - index] = nft.get(index);
  }
  const nfts = await Promise.all(nftPromises);

  return nfts;
}

nft.list = async function (type = 'thegraph') {
  const nftList = new Map();
  let nfts;

  if (type === 'thegraph') nfts = await nft.listTheGraph();
  else nfts = await nft.listContract();

  nfts.forEach((nfti) => {
    let cid;
    const img = nfti.tokenJson?.image;
    if (img) {
      const cid1 = img.match(/^ipfs:\/\/(.*)$/i);
      const cid2 = img.match(/^.*\/ipfs\/([^\/]*)(.*)$/i);
      cid = (cid1 && cid1[1]) || (cid2 && cid2[1]);
      // console.log('cid nft#' + nfti.tokenId, cid, '<=', img);
      if (cid) {
        nfti.cid = cid;
        nftList.set(`${nfti.tokenId}#${cid}`, nfti);
      }
    }
  });

  // console.log('nftList', nftList);
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
