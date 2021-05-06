import hre from 'hardhat';
const { ethers } = hre;
const ethscan = hre.network.config.ethscan;
// const amount = ethers.BigNumber.from(10).pow(18).mul(420000);

const factory = await ethers.getContractFactory('KRM');
// const krm = await factory.deploy(amount);
const krm = await factory.deploy();
console.log(`Contract  ${ethscan}/address/${krm.address}`);

const tx = (await krm.deployed()).deployTransaction;
console.log(`TX        ${ethscan}/tx/${tx.hash}`);

console.log('KRM deployed!');
console.log(await krm.symbol());
