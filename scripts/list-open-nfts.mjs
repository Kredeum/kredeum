import hre from "hardhat";
const { ethers } = hre;
const network = hre.network;
const ethscan = hre.network.config.ethscan;

const OpenNFTsAddresses = {
  matic: "",
  mumbai: [
    "0x98d333dB22158f01797bc7B219c6F18924D0Ca16",
    "0x17Fb61016939409E6b7Cd7cFaE468b707A896Bae",
    "0xAFE822240383dd0ab8A19253212Ea9e1D6BA5E3b",
    "0x5c960b1ffd17eade16a82293e6f591f35af60cee"
  ]
};

OpenNFTsAddresses[network.name].forEach(async (OpenNFTsAddress, i) => {
  console.log(`OpenNFTs #${i} Link ${ethscan}/address/${OpenNFTsAddress}`);

  const OpenNFTs = await ethers.getContractAt("OpenNFTs", OpenNFTsAddress);
  console.log(`OpenNFTs #${i} Contract created`);

  console.log(`OpenNFTs #${i} Name`, await OpenNFTs.name());
  console.log(`OpenNFTs #${i} Symbol`, await OpenNFTs.symbol());
  console.log(`OpenNFTs #${i} Supply`, (await OpenNFTs.totalSupply()).toString());
});
