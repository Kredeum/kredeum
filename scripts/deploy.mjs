import hre from 'hardhat';
const { ethers } = hre;

const ethscan = 'https://explorer-mainnet.maticvigil.com';

const factory = await ethers.getContractFactory("KRE");
const kre = await factory.deploy();
console.log(`Contract  ${ethscan}/address/${kre.address}`);

const tx = (await kre.deployed()).deployTransaction;
console.log(`TX        ${ethscan}/tx/${tx.hash}`);

console.log('KRE deployed!');
console.log(await kre.symbol());
