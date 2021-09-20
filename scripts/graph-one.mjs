import { providers, Contract, utils } from "ethers";
import fs from "fs";
import Ipfs from "../lib/ipfs.mjs";
import FormData from "form-data";
import fetch from "node-fetch";
global.fetch = fetch;
global.FormData = FormData;

const theGraphEndpoint = "https://api.thegraph.com/ipfs";
const theGraph = new Ipfs(theGraphEndpoint);

const MATICVIGIL_API_KEY = "9be3c456ae90b3eea0c4743c483c0dfc9696f2ae";

const contracts = JSON.parse(fs.readFileSync("../config/contracts.json"));
const networks = JSON.parse(fs.readFileSync("../config/networks.json"));
const abis = JSON.parse(fs.readFileSync("../config/abis.json"));

const address = "0xbEaAb0f00D236862527dcF5a88dF3CEd043ab253";
const contract = contracts.find(
  (_contract) => utils.getAddress(_contract.address) === utils.getAddress(address)
);

let abi = [];
contract.interfaces.forEach((iface) => {
  abi = abi.concat(abis[iface]);
});
const network = networks.find((_network) => _network.chainName === contract.network);

const provider = new providers.JsonRpcProvider(`${network.rpcUrls[0]}/${MATICVIGIL_API_KEY}`);
const openNFTs = new Contract(address, abi, provider);

// console.log("name:", await openNFTs.name());
// console.log("symbol:", await openNFTs.symbol());

let totalSupply;
try {
  totalSupply = (await openNFTs.totalSupply()).toNumber();
  console.log(
    `${address}@${network.chainName}:${contract.name} ${totalSupply} ${JSON.stringify(
      contract.interfaces
    )}`
  );
} catch (e) {
  console.log(
    `${address}@${network.chainName}:${contract.name} ${JSON.stringify(contract.interfaces)}`
  );
}

for (let index = 0; index < totalSupply; index++) {
  const tokenId = await openNFTs.tokenByIndex(index);
  const tokenURI = await openNFTs.tokenURI(tokenId);
  console.log(tokenURI);
  theGraph.addUrl(tokenURI).then(console.log);
}
