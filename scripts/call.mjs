import KRU from '../lib/kru.mjs';
import hre from 'hardhat';
const { ethers } = hre;

const network = hre.network.name;
const initUsers = true

const signer = (await ethers.getSigners())[0];
console.log(signer.address);

const kru = await ethers.getContractAt("KRU", KRU.ADDRESS[network], signer);
console.log("name:", await kru.name());
console.log("symbol:", await kru.symbol());
console.log("balanceOf", (await kru.balanceOf(signer.address)).toString());

let totalSupply = (await kru.totalSupply()).toNumber();
console.log("totalSupply", totalSupply);

if (initUsers) {
  const fleekBaseUrl = 'ipfs://QmTr7JD2PeFAYgBjW3cGv7uT36EBkpijJWWQkBZ8ftrnEm/';
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
