import hre from 'hardhat';
const { ethers } = hre;

const factory = await ethers.getContractFactory("KRU");
const kru = await factory.deploy();
console.log(kru.address);

await kru.deployed();
console.log('Deployed!');

console.log(await kru.symbol());
