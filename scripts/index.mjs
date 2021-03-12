import KRU from '../lib/kru.mjs';
import hre from 'hardhat';
const { ethers } = hre;

const network = hre.network.name;
const initUsers = "1";

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
console.log(signer.address);

const kru = new ethers.Contract(KRU.ADDRESS[network], KRU.ABI, signer);
console.log("name:", await kru.name());
console.log("symbol:", await kru.symbol());
console.log("balanceOf", (await kru.balanceOf(signer.address)).toString());

let totalSupply = (await kru.totalSupply()).toNumber();
console.log("totalSupply", totalSupply);

if (initUsers === "1") {
  const fleekBaseUrl = 'https://zapaz-team-bucket.storage.fleek.co/ipfs/QmTr7JD2PeFAYgBjW3cGv7uT36EBkpijJWWQkBZ8ftrnEm/';
  const yoannUri = fleekBaseUrl + 'yoann.json';
  const alexandreUri = fleekBaseUrl + 'alexandre.json';
  const alainUri = fleekBaseUrl + 'alain.json';

  await (await kru.addUser(signer.address, alainUri)).wait();
  await (await kru.addUser(signer.address, yoannUri)).wait();
  await (await kru.addUser(signer.address, alexandreUri)).wait();
  totalSupply = (await kru.totalSupply()).toNumber();
  console.log("totalSupply", totalSupply);

}


for (let index = 0; index < totalSupply; index++) {
  const tockenId = await kru.tokenByIndex(index);
  console.log("index", index, "=> tockenId", tockenId.toNumber());
  console.log("ownerOf:", await kru.ownerOf(tockenId));
  console.log("tokenURI:", await kru.tokenURI(tockenId));
}
