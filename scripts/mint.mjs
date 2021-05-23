import fs from "fs";
import hre from "hardhat";

const { ethers } = hre;
const ethscan = hre.network.config.ethscan;
const network = hre.network.name;
const owner = "0x981ab0d817710d8fffc5693383c00d985a3bda38";
const json = "https://ipfs.io/ipfs/bafkreibjtts66xh4ipz2sixjokrdsejfwe4dkpkmwnyvdrmuvehsh236ta";

const configNetwork = JSON.parse(fs.readFileSync("../config/networks.json")).find((nw) => nw.chainName === network);
const configContract = JSON.parse(fs.readFileSync("../config/contracts.json")).v1.instances[configNetwork.chainName][0];

const kre = await ethers.getContractAt("KRE", configContract.address);
console.log("name:", await kre.name());
console.log("symbol:", await kre.symbol());

let totalSupply = (await kre.totalSupply()).toNumber();
console.log("totalSupply", totalSupply);

const tx = await kre.mintNFT(owner, json);
console.log(`TX        ${ethscan}/tx/${tx.hash}`);

await tx.wait();

totalSupply = (await kre.totalSupply()).toNumber();
console.log("totalSupply", totalSupply);
