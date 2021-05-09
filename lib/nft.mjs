import { ethers } from "ethers";

import libKRE from "../lib/kre1.mjs";
import networksKRE from "../lib/networks_kre.mjs";
import axios from "axios";

const nft = {};

let network;
let KRE;

async function _graphQL(url, query) {
  console.log("_graphQL", url, query);
  let response;

  try {
    const method = "POST";
    const data = { query: query };
    const config = { url, method, data };
    console.log("_graphQL", config);

    response = (await axios(config)).data;
  } catch (error) {
    console.error(error);
  }
  return response;
}

nft.init = function (chainId) {
  network = networksKRE.find((nw) => Number(nw.chainId) === Number(chainId));

  if (network) {
    network.KRE = libKRE.ADDRESS[network.chainName][0];
    if (network.KRE) {
      const provider = new ethers.providers.JsonRpcProvider(network.rpcUrl);
      KRE = new ethers.Contract(network.KRE, libKRE.ABI, provider);
    }
  }
  return network;
};

nft.get = async function (index) {
  const nft = {};
  try {
    nft.tokenId = (await KRE.tokenByIndex(index)).toString();
    nft.ownerOf = await KRE.ownerOf(nft.tokenId);
    nft.tokenURI = await KRE.tokenURI(nft.tokenId);
    nft.tokenJson = (await axios(nft.tokenURI)).data;
  } catch (e) {
    console.error("nft.get ERROR", e, nft);
  }
  // console.log('nft.get #' + nft?.tokenId, nft);
  return nft;
};

nft.listTheGraph = async function () {
  let nfts = [];

  const query = `{ tokens(first: 99) {id owner {id} uri} }`;
  let answerGQL;

  answerGQL = (await _graphQL(network.subgraphUrl, query)).data;
  //console.log('answerGQL', answerGQL);

  nfts = await Promise.all(
    answerGQL?.tokens.map(async (token) => {
      // console.log('token', token);

      const nft = {};
      nft.tokenId = Number(token.id).toString();
      nft.ownerOf = token.owner.id;
      nft.tokenURI = token.uri;

      try {
        nft.tokenJson = (await axios(nft.tokenURI)).data;
      } catch (e) {
        console.error("nft.listTheGraph ERROR #" + nft.tokenId, nft.tokenURI, e);
      }

      // console.log('nft', nft);
      return nft;
    })
  );

  // console.log('nft.listTheGraph', nfts);
  return nfts;
};

nft.listContract = async function () {
  const totalSupply = (await KRE.totalSupply()).toNumber();
  //console.log('totalSupply', totalSupply);

  const nftPromises = [];
  for (let index = 0; index < totalSupply; index++) {
    nftPromises[totalSupply - 1 - index] = nft.get(index);
  }
  const nfts = await Promise.all(nftPromises);

  return nfts;
};

nft.list = async function () {
  const nftList = new Map();
  let nfts;

  if (network?.subgraphUrl) nfts = await nft.listTheGraph();
  else nfts = await nft.listContract();
  console.log("nfts", nfts);

  nfts.forEach((nfti) => {
    let cid = nfti.tokenJson?.cid;
    if (!cid) {
      const img = nfti.tokenJson?.image;
      if (img) {
        const cid1 = img.match(/^ipfs:\/\/(.*)$/i);
        const cid2 = img.match(/^.*\/ipfs\/([^\/]*)(.*)$/i);
        cid = (cid1 && cid1[1]) || (cid2 && cid2[1]);
        // console.log('cid nft#' + nfti.tokenId, cid, '<=', img);
      }
    }
    if (cid) {
      nfti.cid = cid;
      nftList.set(nfti.tokenId, nfti);
    }
  });

  console.log("nftList", nftList);
  return nftList;
};

nft.Mint = async function (signer, urlJson) {
  const address = await signer.getAddress();
  console.log("nft.Mint", address, urlJson);
  console.log(KRE.address);

  //  const tx1 = await KRE.connect(signer).addUser(address, urlJson);
  const tx1 = await KRE.connect(signer).mintNFT(address, urlJson);
  console.log(`${network.explorer}/tx/` + tx1.hash);

  const res = await tx1.wait();
  console.log(res.events);

  const tokenId = res.events[0].args[2].toString();
  return tokenId;
};

export default nft;
