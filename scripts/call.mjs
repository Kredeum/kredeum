import KRE from '../lib/kre.mjs';
import hre from 'hardhat';
const { ethers } = hre;

const network = hre.network.name;
const initUsers = true

const signer = (await ethers.getSigners())[0];
console.log(signer.address);

const kre = await ethers.getContractAt("KRE", KRE.ADDRESS[network], signer);
console.log("name:", await kre.name());
console.log("symbol:", await kre.symbol());
console.log("balanceOf", (await kre.balanceOf(signer.address)).toString());

let totalSupply = (await kre.totalSupply()).toNumber();
console.log("totalSupply", totalSupply);

if (initUsers) {
  const fleekBaseUrl = 'ipfs://QmTr7JD2PeFAYgBjW3cGv7uT36EBkpijJWWQkBZ8ftrnEm/';
  const yoannUri = fleekBaseUrl + 'yoann.json';
  const alexandreUri = fleekBaseUrl + 'alexandre.json';
  const alainUri = fleekBaseUrl + 'alain.json';

  await (await kre.addUser(signer.address, alainUri)).wait();
  await (await kre.addUser(signer.address, yoannUri)).wait();
  await (await kre.addUser(signer.address, alexandreUri)).wait();
  totalSupply = (await kre.totalSupply()).toNumber();
  console.log("totalSupply", totalSupply);

}

for (let index = 0; index < totalSupply; index++) {
  const tockenId = await kre.tokenByIndex(index);
  console.log("index", index, "=> tockenId", tockenId.toNumber());
  console.log("ownerOf:", await kre.ownerOf(tockenId));
  console.log("tokenURI:", await kre.tokenURI(tockenId));
}
