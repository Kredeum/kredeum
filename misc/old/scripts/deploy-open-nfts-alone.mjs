import hre from "hardhat";
const { ethers } = hre;
const ethscan = hre.network.config.ethscan;

const factory = await ethers.getContractFactory("OpenNFTs");
const nft = await factory.deploy();
console.log(`Contract  ${ethscan}/address/${nft.address}`);

const tx = (await nft.deployed()).deployTransaction;
console.log(`TX        ${ethscan}/tx/${tx.hash}`);

console.log("OpenNFTs deployed!");
console.log(await nft.symbol());
