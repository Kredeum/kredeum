import { ethers } from "ethers";
import fs from "fs";
import Ipfs from "../lib/ipfs.mjs";
import FormData from "form-data";
import fetch from "node-fetch";
global.fetch = fetch;
global.FormData = FormData;

const theGraphEndpoint = "https://api.thegraph.com/ipfs";
const theGraph = new Ipfs(theGraphEndpoint);

const chainName = "matic";
const MATICVIGIL_API_KEY = "9be3c456ae90b3eea0c4743c483c0dfc9696f2ae";

const contracts = JSON.parse(fs.readFileSync("../config/contracts.json"));
const networks = JSON.parse(fs.readFileSync("../config/networks.json"));
const network = networks.find((nw) => nw.chainName === chainName);

const provider = new ethers.providers.JsonRpcProvider(`${network.rpcUrls[0]}/${MATICVIGIL_API_KEY}`);
const openNFTs = new ethers.Contract(contracts.v1.instances[chainName][0].address, contracts.v1.abi, provider);

console.log("name:", await openNFTs.name());
console.log("symbol:", await openNFTs.symbol());

let totalSupply = (await openNFTs.totalSupply()).toNumber();
console.log("totalSupply", totalSupply);

for (let index = 0; index < totalSupply; index++) {
  const tokenId = await openNFTs.tokenByIndex(index);
  // console.log("index", index, "=> tokenId", tokenId.toNumber());
  // console.log("ownerOf:", await openNFTs.ownerOf(tokenId));
  // console.log("tokenURI:", await openNFTs.tokenURI(tokenId));
  const uri = await openNFTs.tokenURI(tokenId);
  console.log(uri);
  theGraph.addUrl(uri).then(console.log);
}
