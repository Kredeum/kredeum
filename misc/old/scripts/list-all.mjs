import { ethers } from "ethers";
import fs from "fs";

const MATICVIGIL_API_KEY = "9be3c456ae90b3eea0c4743c483c0dfc9696f2ae";

const contracts = JSON.parse(fs.readFileSync("../config/contracts.json"));
const networks = JSON.parse(fs.readFileSync("../config/networks"));
const abis = JSON.parse(fs.readFileSync("../config/abis.json"));

contracts.forEach(async (contract) => {
  const address = contract.address;
  let abi = [];
  contract.interfaces.forEach((iface) => {
    abi = abi.concat(abis[iface]);
  });
  const network = networks.find((_network) => _network.chainName === contract.network);

  const provider = new ethers.providers.JsonRpcProvider(
    `${network.rpcUrls[0]}/${MATICVIGIL_API_KEY}`
  );
  const openNFTs = new ethers.Contract(address, abi, provider);

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
  // console.log("totalSupply", totalSupply);

  // for (let index = 0; index < totalSupply; index++) {
  //   const tokenId = await openNFTs.tokenByIndex(index);
  //   const tokenURI = await openNFTs.tokenURI(tokenId);

  //   console.log(tokenURI);
  // }
});
