import hre from "hardhat";
const { ethers } = hre;
const ethscan = hre.network.config.ethscan;

const OpenNFTsFactoryAddresses = {
  matic: "",
  mumbai: "0xEbf2e7C69500D689B80d3d6fBb5E3aAb644C52aE"
};
const OpenNFTsFactoryAddress = OpenNFTsFactoryAddresses[network.name];
console.log(`Contract OpenNFTsFactory ${ethscan}/address/${OpenNFTsFactoryAddress}`);

const OpenNFTsFactory = await ethers.getContractAt("OpenNFTsFactory", OpenNFTsFactoryAddress);

const tx = await OpenNFTsFactory.createOpenNFTs();
console.log(`Creation OpenNFTs Tx ${ethscan}/address/${tx.hash}`);

const OpenNFTsAddress = (await tx.wait()).events[0].args[0];
console.log(`Contract OpenNFTs deployed! ${ethscan}/address/${OpenNFTsAddress}`);

const OpenNFTs = await ethers.getContractAt("OpenNFTs", OpenNFTsAddress);

console.log(await OpenNFTs.symbol());
console.log((await OpenNFTs.totalSupply()).toString());
