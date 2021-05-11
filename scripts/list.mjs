import KRE from "../lib/kre1.mjs";
import hre from "hardhat";
const { ethers } = hre;

const network = hre.network.name;

const kre = await ethers.getContractAt("KRE", KRE.ADDRESS[network][0]);
console.log("name:", await kre.name());
console.log("symbol:", await kre.symbol());

let totalSupply = (await kre.totalSupply()).toNumber();
console.log("totalSupply", totalSupply);

for (let index = 0; index < totalSupply; index++) {
  const tokenId = await kre.tokenByIndex(index);
  console.log("index", index, "=> tokenId", tokenId.toNumber());
  console.log("ownerOf:", await kre.ownerOf(tokenId));
  console.log("tokenURI:", await kre.tokenURI(tokenId));
}
