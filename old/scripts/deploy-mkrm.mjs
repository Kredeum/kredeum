import hre from "hardhat";
const { ethers } = hre;
const ethscan = hre.network.config.ethscan;

const factory = await ethers.getContractFactory("MKRM");
const mkrm = await factory.deploy();
console.log(`Contract  ${ethscan}/address/${mkrm.address}`);

const tx = (await mkrm.deployed()).deployTransaction;
console.log(`TX        ${ethscan}/tx/${tx.hash}`);

console.log("mKRM deployed!");
console.log(await mkrm.symbol());
