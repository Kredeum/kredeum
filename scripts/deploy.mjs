import KRU from '../lib/kru.mjs';
import hre from 'hardhat';
const { ethers } = hre;

const network = hre.network.name;
console.log("network", network);

let provider, akey;
if (network === "local") {
  provider = ethers.getDefaultProvider("http://127.0.0.1:7545");
  akey = '0xf19c9206c05efb58e717ca49be79d40484e33f7da3f6c9c4531a12bb76f9b529';
} else {
  provider = ethers.getDefaultProvider(network, {
    etherscan: process.env.ETHERSCAN_API_KEY,
    infura: process.env.INFURA_API_KEY,
    alchemy: process.env.ALCHEMY_API_KEY,
    quorum: 2
  });
  akey = process.env.ACCOUNT_KEY;
}

const signer = new ethers.Wallet(akey, provider);
const factory = new ethers.ContractFactory(KRU.ABI, KRU.BIN, signer);
const kru = await factory.deploy();

console.log(`https://${network}.etherscan.io/address/${kru.address}`);

kru.deployTransaction.wait()
console.log(await kru.symbol());
