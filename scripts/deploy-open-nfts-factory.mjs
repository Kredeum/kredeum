import hre from "hardhat";
const { ethers } = hre;
const ethscan = hre.network.config.ethscan;

const factory = await ethers.getContractFactory("OpenNFTsFactory");
const OpenNFTsFactory = await factory.deploy();
console.log(`Contract OpenNFTsFactory ${ethscan}/address/${OpenNFTsFactory.address}`);

const tx = (await OpenNFTsFactory.deployed()).deployTransaction;
console.log(`TX ${ethscan}/tx/${tx.hash}`);

console.log("OpenNFTsFactory deployed!");
