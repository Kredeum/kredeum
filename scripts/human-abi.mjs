import { ethers } from "ethers";
import fs from "fs";

const MATICVIGIL_API_KEY = "9be3c456ae90b3eea0c4743c483c0dfc9696f2ae";

const contracts = JSON.parse(fs.readFileSync("../config/contracts.json"));
const networks = JSON.parse(fs.readFileSync("../config/networks.json"));

for (const version in contracts) {
  const instances = contracts[version].instances;
  const abi = contracts[version].abi;
  // console.log(version, abi);

  for (const network in instances) {
    const contractList = instances[network];
    const configNetwork = networks.find((nw) => nw.chainName === network);
    // console.log(version, network, contractList);
    const provider = new ethers.providers.JsonRpcProvider(`${configNetwork.rpcUrls[0]}/${MATICVIGIL_API_KEY}`);

    const addresses = contractList.map((_contract) => _contract.address);

    addresses.forEach(async (address) => {
      const openNFTs = new ethers.Contract(address, abi, provider);

      console.log(version, network, address);
      console.log(openNFTs.interface.format(["json"]));
      console.log(await openNFTs.symbol());
      console.log((await openNFTs.totalSupply()).toString());
    });
  }
}
