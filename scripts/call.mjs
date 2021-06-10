import hre from "hardhat";
const { ethers } = hre;
import fs from "fs";

const ethscan = hre.network.config.ethscan;
const abis = JSON.parse(fs.readFileSync("../config/abis.json"));

const address = "0x9bc3a986f00b77c80fc281dacd3fda5f8d712406";
let abi = abis["ERC721"];
abi = abi.concat(abis["ERC721Enumerable"]);
abi = abi.concat(abis["ERC721Metadata"]);

console.log(abi);

const contract = await ethers.getContractAt(abi, address);

console.log((await contract.totalSupply()).toString());

console.log((await contract.tokenByIndex(0)).toString());

console.log(await contract.tokenURI(1));
